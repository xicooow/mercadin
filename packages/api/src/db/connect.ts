import mongoose from "mongoose";

import logger from "../logger";
import { APP_DB_URL } from "../constants";
import { getErrorMessage } from "../helpers/util";

export default async () => {
  try {
    await mongoose.connect(`${APP_DB_URL}`);
    logger.info("Successfully connected to MongoDB");
  } catch (error) {
    throw new Error(
      `Failed to connect to MongoDB: ${getErrorMessage(error)}`
    );
  }
};
