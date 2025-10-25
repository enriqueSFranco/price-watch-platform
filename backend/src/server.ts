import dotenv from "dotenv";
import { envConfig } from "./config/env.ts";
import { createApp } from "./modules/shared/infraestructure/http/express";

dotenv.config();
const app = createApp()
const { REPOSITORY_TYPE, PORT } = envConfig;
const port = PORT || 3000;

async function bootstrap() {
  try {
    app.listen(port, () => {
      console.log(`REPOSITORY: ${REPOSITORY_TYPE}`);
    });
  } catch (error) {
    console.error("Error al iniciar la aplicación:", error);
    process.exit(1)
  }
}

bootstrap()
