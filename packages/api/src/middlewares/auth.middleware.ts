import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { NextFunction, Request, Response } from "express";

import logger from "../logger";
import {
  buildErrorMessage,
  getErrorMessage,
} from "../helpers/util";
import { CustomJwtPayload, CustomRequest } from "../types";
import UserController from "../controllers/user.controller";
import { getJWTSecret, UNPROTECTED_ROUTES } from "../constants";

export default async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { path, headers } = req;

  if (UNPROTECTED_ROUTES.includes(path)) {
    return next();
  }

  const token = headers.authorization?.replace(
    /^Bearer[\s]/,
    ""
  );

  if (!token) {
    res
      .status(401)
      .json(buildErrorMessage("Authentication needed"));
  } else {
    try {
      const decoded = jwt.verify(
        token,
        getJWTSecret()
      ) as CustomJwtPayload;

      const { userId } = decoded;
      const user = await UserController.getById(
        new Types.ObjectId(userId)
      );

      if (!user) {
        return res
          .status(403)
          .json(buildErrorMessage("Authentication invalid"));
      }

      (req as CustomRequest).authData = decoded;

      return next();
    } catch (error) {
      logger.error(getErrorMessage(error));
      res
        .status(403)
        .json(buildErrorMessage("Authentication failed"));
    }
  }
};
