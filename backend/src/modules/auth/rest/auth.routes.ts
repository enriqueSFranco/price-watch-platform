import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware } from "./auth.middleware";

export function buildUserRouter(controller: AuthController) {
  const router = Router();
  router.post("/register", controller.register);
  router.post("/signin", controller.signIn);
  router.post("/logout", authMiddleware, controller.logout);

  return router;
}
