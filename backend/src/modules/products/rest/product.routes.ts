import {Router} from "express"
import { ProductController } from "./product.controller";
import { authMiddleware } from "../../auth/rest/auth.middleware";

export function buildProductsRouter(controller: ProductController) {
  const router = Router()

  router.post("/products", authMiddleware, controller.list)
  router.post("/products", authMiddleware, controller.add)
  router.post("/products/:id", authMiddleware, controller.get);
  // router.patch("/products/:id/pause", controller.pause);
  // router.patch("/products/:id/resume", controller.resume);
  // router.patch("/products/:id/notes", controller.notes);

  return router
}
