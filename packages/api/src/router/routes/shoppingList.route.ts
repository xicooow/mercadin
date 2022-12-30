import { Types } from "mongoose";
import { Request, Response } from "express";

import ShoppingListController from "../../controllers/shoppingList.controller";

import {
  buildErrorMessage,
  validBody,
  isObject,
  getErrorMessage,
} from "../../helpers/util";
import logger from "../../logger";
import { CustomRequest, Values } from "../../types";

export const deleteShoppingListColumn = async (
  req: Request,
  res: Response
) => {
  const { shoppingListId, columnName } = req.params;

  try {
    const result = await ShoppingListController.deleteColumn(
      new Types.ObjectId(shoppingListId),
      columnName
    );
    return res.status(200).json(result.toJSON());
  } catch (error) {
    logger.error(getErrorMessage(error));
    return res.status(400).json(buildErrorMessage());
  }
};

export const modifyShoppingListColumn = async (
  req: Request,
  res: Response
) => {
  const { body } = req;
  const { shoppingListId } = req.params;

  if (!validBody(body)) {
    return res.status(400).json(buildErrorMessage());
  }

  if (!body.name) {
    return res
      .status(400)
      .json(buildErrorMessage("Missing name"));
  }

  if (!body.label) {
    return res
      .status(400)
      .json(buildErrorMessage("Missing label"));
  }

  try {
    const result = await ShoppingListController.modifyColumn(
      new Types.ObjectId(shoppingListId),
      body.name,
      body.label
    );
    return res.status(200).json(result.toJSON());
  } catch (error) {
    logger.error(getErrorMessage(error));
    return res.status(400).json(buildErrorMessage());
  }
};

export const updateShoppingList = async (
  req: Request,
  res: Response
) => {
  const { body } = req;
  const { shoppingListId } = req.params;

  if (!validBody(body)) {
    return res.status(400).json(buildErrorMessage());
  }

  if (!body.title && !body.status) {
    return res
      .status(400)
      .json(buildErrorMessage("Missing update values"));
  }

  try {
    const result = await ShoppingListController.update(
      new Types.ObjectId(shoppingListId),
      { ...body }
    );
    return res.status(200).json(result.toJSON());
  } catch (error) {
    logger.error(getErrorMessage(error));
    return res.status(400).json(buildErrorMessage());
  }
};

export const getShoppingLists = async (
  req: Request,
  res: Response
) => {
  const { authData, query } = req as CustomRequest;

  try {
    const shoppingListsData = await ShoppingListController.get(
      {
        ...query,
        user: new Types.ObjectId(authData.userId),
      },
      { cre_date: "desc" }
    );

    const shoppingLists = shoppingListsData.map(shoppingList =>
      shoppingList.toJSON()
    );

    return res.status(200).json(shoppingLists);
  } catch (error) {
    logger.error(getErrorMessage(error));
    return res.status(400).json(buildErrorMessage());
  }
};

export const getShoppingList = async (
  req: Request,
  res: Response
) => {
  const { shoppingListId } = req.params;

  try {
    const shoppingListData =
      await ShoppingListController.getById(
        new Types.ObjectId(shoppingListId)
      );

    const shoppingList = shoppingListData.toJSON();

    return res.status(200).json(shoppingList);
  } catch (error) {
    logger.error(getErrorMessage(error));
    return res.status(400).json(buildErrorMessage());
  }
};

export const addShoppingList = async (
  req: Request,
  res: Response
) => {
  const { authData, body } = req as CustomRequest;

  if (!validBody(body)) {
    return res.status(400).json(buildErrorMessage());
  }

  if (!body.title) {
    return res
      .status(400)
      .json(buildErrorMessage("Missing title"));
  }

  try {
    const result = await ShoppingListController.create({
      ...body,
      user: new Types.ObjectId(authData.userId),
    });
    return res.status(201).json(result.toJSON());
  } catch (error) {
    logger.error(getErrorMessage(error));
    return res.status(400).json(buildErrorMessage());
  }
};

export const addShoppingItem = async (
  req: Request,
  res: Response
) => {
  const { body } = req;
  const { shoppingListId } = req.params;

  if (!validBody(body)) {
    return res.status(400).json(buildErrorMessage());
  }

  if (!body.values) {
    return res
      .status(400)
      .json(buildErrorMessage("Missing values"));
  }

  if (!isObject(body.values)) {
    return res
      .status(400)
      .json(buildErrorMessage("Invalid values"));
  }

  const values = Object.entries<string>(body.values);

  try {
    const result = await ShoppingListController.createItem(
      new Types.ObjectId(shoppingListId),
      values
    );
    return res.status(200).json(result.toJSON());
  } catch (error) {
    logger.error(getErrorMessage(error));
    return res.status(400).json(buildErrorMessage());
  }
};

export const updateShoppingItem = async (
  req: Request,
  res: Response
) => {
  const { body } = req;
  const { shoppingListId, shoppingItemId } = req.params;

  if (!validBody(body)) {
    return res.status(400).json(buildErrorMessage());
  }

  if (!body.action) {
    return res
      .status(400)
      .json(buildErrorMessage("Missing action"));
  }

  if (body.action !== "edit" && body.action !== "toggle") {
    return res
      .status(400)
      .json(buildErrorMessage("Invalid action"));
  }

  if (body.action === "edit" && !isObject(body.values)) {
    return res
      .status(400)
      .json(
        buildErrorMessage(
          "Missing/Invalid values for edit action"
        )
      );
  }

  let values: Values | undefined;
  if (body.values) {
    values = Object.entries<string>(body.values);
  }

  try {
    const result = await ShoppingListController.updateItem(
      new Types.ObjectId(shoppingListId),
      new Types.ObjectId(shoppingItemId),
      body.action,
      values
    );
    return res.status(200).json(result);
  } catch (error) {
    logger.error(getErrorMessage(error));
    return res.status(400).json(buildErrorMessage());
  }
};

export const deleteShoppingItem = async (
  req: Request,
  res: Response
) => {
  const { shoppingListId, shoppingItemId } = req.params;

  try {
    await ShoppingListController.deleteItem(
      new Types.ObjectId(shoppingListId),
      new Types.ObjectId(shoppingItemId)
    );
    return res.status(200).json({});
  } catch (error) {
    logger.error(getErrorMessage(error));
    return res.status(400).json(buildErrorMessage());
  }
};
