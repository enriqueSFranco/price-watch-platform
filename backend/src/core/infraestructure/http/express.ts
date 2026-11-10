import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { buildScraperRouter } from "../../../modules/scraper/rest/scraper.routes";
import { ScraperController } from "../../../modules/scraper/rest/scraper.controller";
import { ScraperPreviewUseCase } from "../../../modules/scraper/application/use-cases/run-scraper.usecase";
import { buildUserRouter } from "../../../modules/auth/rest/auth.routes";
import { RegisterUseCase } from "../../../modules/auth/application/use-cases/RegisterUseCase";
import { UserRepository } from "../../../modules/users/infrastructure/persistence/drizzle/UserRepository";
import { BcryptPasswordHasher } from "../security/BcryptPasswordHasher";
import { AuthController } from "../../../modules/auth/rest/auth.controller";
import { JwtService } from "../../../modules/auth/infrastructure/JwtService";
import { SignInUseCase } from "../../../modules/auth/application/use-cases/SignInUseCase";
import { authMiddleware } from "../../../modules/auth/rest/auth.middleware";
import { ProductScraperService } from "../../../modules/scraper/application/services/ProductScraperService";
import { LogoutUseCase } from "../../../modules/auth/application/use-cases/LogoutUseCase";
import { buildProductsRouter } from "../../../modules/products/rest/product.routes";
import { ProductController } from "../../../modules/products/rest/product.controller";
import { AddProductUseCase } from "../../../modules/products/application/use-cases/AddProductUseCase";
import { GetProductUseCase } from "../../../modules/products/application/use-cases/GetProductUseCase";
import { ListProductsUseCase } from "../../../modules/products/application/use-cases/ListProductsUseCase";
import { DrizzleProductPersistence } from "../../../modules/products/infrastructure/persistence/drizzle/DrizzleProductPersistence";

export function createApp() {
  const app = express();
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  // const productRepo = new DrizzleProductPersistence();
  // const listUC: ListProductsUseCase = new ListProductsUseCase(productRepo);
  // const getUC: GetProductUseCase = new GetProductUseCase(productRepo);
  // const addProductUC: AddProductUseCase = new AddProductUseCase(productRepo);
  // const productController = new ProductController(listUC, getUC, addProductUC);

  // Todo: Usar la fabrica para obtener el scraper del Store correspodiente
  const scraperFactory = new ProductScraperService();
  const scraperPreviewUseCase = new ScraperPreviewUseCase(scraperFactory);
  const scraperController = new ScraperController(scraperPreviewUseCase);

  const userRepo = new UserRepository();
  const hasher = new BcryptPasswordHasher();

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) throw new Error("JWT_SECRET must be defined");

  const jwtService = new JwtService<{ userId: string }>(jwtSecret, "7d");

  const registerUseCase = new RegisterUseCase(userRepo, hasher, jwtService);
  const signInUseCase = new SignInUseCase(userRepo, hasher, jwtService);
  const logoutUseCase = new LogoutUseCase();
  const authController = new AuthController(
    registerUseCase,
    signInUseCase,
    logoutUseCase
  );

  // Public routes
  app.use("/api", buildUserRouter(authController));

  // Protected routes: from here on, you need token
  app.use(authMiddleware(jwtService));
  // Protected modules
  app.use("/api", buildScraperRouter(scraperController));
  // app.use("/api", buildProductsRouter(productController));

  return app;
}
