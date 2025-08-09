import express from "express";
import { ProductService } from "../../../services/products.service";
import { ProductRepository } from "../../../infraestructure/repositories/product.repository";
import { ProductController } from "../controllers/product.controller";

const router = express.Router();

// Inyectando dependencias
const productRepository = new ProductRepository();
// Instanciamos el servicio y le inyectamos el repositorio
const productService = new ProductService(productRepository);
// Instanciamos el controlador y le inyectamos el servicio
const productController = new ProductController(productService);

// TODO: Pasarle el controlador
router.get(
  "/products/search",
  productController.searchProducts.bind(productController)
);
router.get("/products/:id");
router.put("/products/:id");
router.patch("/products/:id");

export default router;
