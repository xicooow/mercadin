import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import express from "express";

/** load .env stuff */
dotenv.config();

import router from "./router";
import dbConnect from "./db/connect";
import { APP_PORT } from "./constants";
import logger, { MORGAN_CONFIG } from "./logger";

const app = express();

/** logs */
app.use(morgan(MORGAN_CONFIG.format, MORGAN_CONFIG.options));

/** middlewares */
import cors from "./middlewares/cors.middleware";
import auth from "./middlewares/auth.middleware";
import notFound from "./middlewares/404.middleware";

/** json body */
app.use(express.json());

/** security headers */
app.use(helmet.xssFilter());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.dnsPrefetchControl());

/** cors */
app.use(cors);

/** api server start */
app.listen(APP_PORT, async () => {
  logger.info(`App listening in port ${APP_PORT}`);
  await dbConnect();

  app.use(auth);
  router(app);
  app.use(notFound);
});
