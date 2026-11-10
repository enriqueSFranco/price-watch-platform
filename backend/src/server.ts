import dotenv from "dotenv";
import { createApp } from "./core/infraestructure/http/express.ts";
import { envConfig } from "./shared/config/env.ts";

dotenv.config();
const app = createApp();
const { REPOSITORY_TYPE, PORT } = envConfig;
const port = PORT || 3000;

async function bootstrap() {
  try {
    app.listen(port, () => {
      console.log(`REPOSITORY: ${REPOSITORY_TYPE}`);
    });
  } catch (error) {
    console.error("Error al iniciar la aplicación:", error);
    process.exit(1);
  }
}

bootstrap();
