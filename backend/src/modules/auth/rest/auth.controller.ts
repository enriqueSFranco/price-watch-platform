import { Request, Response } from "express";
import { RegisterUseCase } from "../application/use-cases/RegisterUseCase";
import { SignInUseCase } from "../application/use-cases/SignInUseCase";
import { LogoutUseCase } from "../application/use-cases/LogoutUseCase";

export class AuthController {
  constructor(
    private readonly registerUserCase: RegisterUseCase,
    private readonly signInUseCase: SignInUseCase,
    private readonly logoutUseCase: LogoutUseCase
  ) {}

  logout = async (_: Request, res: Response) => {
    try {
      await this.logoutUseCase.execute();
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      return res.status(200).json({
        status: "success",
        message: "Logged out successfully",
      });
    } catch (e) {
      return res.status(500).json({
        status: "error",
        message: "Unexpected error during logout",
      });
    }
  };

  signIn = async (req: Request, res: Response) => {
    try {
      const result = await this.signInUseCase.execute(req.body);

      if (result.isFailure()) {
        return res.status(400).json({
          status: "error",
          message: result.Error?.message
        })
      }
      const {id, email, token} = result.Value

      res.cookie("token", token.Value, {
        httpOnly: true,
        expires: token.ExpiresAt,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      return res.status(200).json({
        status: "success",
        data: {
          id,
          email,
        },
      });
    } catch (e) {
      return res
        .status(400)
        .json({ status: "error", message: (e as Error).message });
    }
  };

  register = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const result = await this.registerUserCase.execute({ email, password });
      if (result.isFailure()) {
        return res.status(400).json({ error: result.Error!.message });
      }

      return res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: result.Value,
      });
    } catch (e) {
      return res.status(400).json({
        status: "error",
        message: (e as Error).message,
      });
    }
  };
}
