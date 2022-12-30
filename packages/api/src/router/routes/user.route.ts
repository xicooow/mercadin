import { Types } from "mongoose";
import { Request, Response } from "express";

import {
  buildErrorMessage,
  getErrorMessage,
  validBody,
} from "../../helpers/util";
import logger from "../../logger";
import { CustomRequest } from "../../types";
import UserController from "../../controllers/user.controller";

export const addUser = async (req: Request, res: Response) => {
  const { body } = req;

  if (!validBody(body)) {
    return res.status(400).json(buildErrorMessage());
  }

  if (!body.name) {
    return res
      .status(400)
      .json(buildErrorMessage("Missing name"));
  }

  if (!body.email) {
    return res
      .status(400)
      .json(buildErrorMessage("Missing email"));
  }

  if (!body.password) {
    return res
      .status(400)
      .json(buildErrorMessage("Missing password"));
  }

  try {
    const result = await UserController.create(body);
    return res.status(201).json(result.toJSON());
  } catch (error) {
    logger.error(getErrorMessage(error));
    return res.status(400).json(buildErrorMessage());
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId.trim()) {
    return res
      .status(400)
      .json(buildErrorMessage("Missing user id param"));
  }

  try {
    const userData = await UserController.getById(
      new Types.ObjectId(userId)
    );

    if (!userData) {
      return res
        .status(404)
        .json(buildErrorMessage("User not found"));
    }

    const user = userData.toJSON();

    return res.status(200).json(user);
  } catch (error) {
    logger.error(getErrorMessage(error));
    return res.status(400).json(buildErrorMessage());
  }
};

export const getLoggedUser = async (
  req: Request,
  res: Response
) => {
  const { authData } = req as CustomRequest;

  try {
    const userData = await UserController.getById(
      new Types.ObjectId(authData.userId)
    );

    if (!userData) {
      return res
        .status(404)
        .json(buildErrorMessage("Logged user not found"));
    }

    const user = userData.toJSON();

    return res.status(200).json(user);
  } catch (error) {
    logger.error(getErrorMessage(error));
    return res.status(400).json(buildErrorMessage());
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const usersData = await UserController.get(
      {},
      { cre_date: "desc" }
    );

    const users = usersData.map(user => user.toJSON());

    return res.status(200).json(users);
  } catch (error) {
    logger.error(getErrorMessage(error));
    return res.status(400).json(buildErrorMessage());
  }
};
