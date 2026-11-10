import { NextFunction, Request, Response } from "express";
import { JwtService } from "../infrastructure/JwtService";
import { Token } from "../domain/Token";

// Extendemos el Request de Express para añadir req.user
declare module "express-serve-static-core" {
  interface Request {
    user?: {
      userId: string;
    };
  }
}

export function authMiddleware(jwt: JwtService<{ userId: string }>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.token;
      // const header = req.headers.authorization;
      if (!token) {
        return res
          .status(401)
          .json({ status: "error", message: "No token found in cookies" });
      }
      // const [type, token] = header.split(" ");
      // if (type !== "Bearer" || !token) {
      //   return res
      //     .status(401)
      //     .json({ status: "error", message: "Invalid Authorization format" });
      // }
      const payload = jwt.verify(Token.create(token));
      req.user = { userId: payload.userId };
      next();
    } catch (e) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
}
