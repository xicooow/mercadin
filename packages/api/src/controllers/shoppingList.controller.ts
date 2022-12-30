import { Types, FilterQuery } from "mongoose";

import { getErrorMessage } from "../helpers/util";
import ShoppingListModel from "../models/shoppingList";
import {
  ShoppingItem,
  ShoppingItemActions,
  ShoppingList,
  Sort,
  Values,
} from "../types";

class ShoppingListController {
  async get(query: FilterQuery<ShoppingList>, sort?: Sort) {
    return await ShoppingListModel.find(query, {
      _id: true,
      title: true,
      cre_date: true,
    }).sort(sort);
  }

  async getById(shoppingListId: Types.ObjectId) {
    const shoppingList = await ShoppingListModel.findById(
      shoppingListId
    );

    if (!shoppingList) {
      throw new Error("Invalid shopping list provided");
    }

    shoppingList.items.sort(
      (a, b) => b.cre_date.getTime() - a.cre_date.getTime()
    );

    return shoppingList;
  }

  async deleteColumn(
    shoppingListId: Types.ObjectId,
    columnName: string
  ) {
    let shoppingList;

    try {
      shoppingList = await ShoppingListModel.findById(
        shoppingListId
      );
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }

    if (!shoppingList) {
      throw new Error("Invalid shopping list provided");
    }

    // Delete provided column from list
    shoppingList.columns.delete(columnName);
    // Delete provided column in fields
    shoppingList.items.forEach(shoppingItem => {
      shoppingItem.fields.delete(columnName);
    });

    try {
      const savedShoppingList = await shoppingList.save();
      return savedShoppingList;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  async modifyColumn(
    shoppingListId: Types.ObjectId,
    name: string,
    label: string
  ) {
    let shoppingList;

    try {
      shoppingList = await ShoppingListModel.findById(
        shoppingListId
      );
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }

    if (!shoppingList) {
      throw new Error("Invalid shopping list provided");
    }

    // Add or modify provided list column
    shoppingList.columns.set(name, label);
    // Add or modify provided column in fields
    shoppingList.items.forEach(shoppingItem => {
      const fieldValue = shoppingItem.fields.get(name);
      shoppingItem.fields.set(name, fieldValue || "");
    });

    try {
      const savedShoppingList = await shoppingList.save();
      return savedShoppingList;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  async create({
    title,
    user,
  }: Pick<ShoppingList, "title" | "user">) {
    const shoppingListData: ShoppingList = {
      user,
      title,
      items: [],
      status: "active",
      cre_date: new Date(),
      columns: new Types.Map([
        // default columns
        ["name", "Nome"],
        ["price", "Preço"],
      ]),
    };

    const shoppingList = new ShoppingListModel(shoppingListData);

    try {
      const savedShoppingList = await shoppingList.save();
      return savedShoppingList;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  async update(
    shoppingListId: Types.ObjectId,
    {
      title,
      status,
    }: Partial<Pick<ShoppingList, "title" | "status">>
  ) {
    try {
      const updatedShoppingList =
        await ShoppingListModel.findByIdAndUpdate(
          shoppingListId,
          {
            $set: {
              title,
              status,
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!updatedShoppingList) {
        throw new Error("Invalid shopping list provided");
      }

      return updatedShoppingList;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  async createItem(
    shoppingListId: Types.ObjectId,
    values: [string, string][]
  ) {
    let shoppingList;

    try {
      shoppingList = await ShoppingListModel.findById(
        shoppingListId
      );
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }

    if (!shoppingList) {
      throw new Error("Invalid shopping list provided");
    }

    for (const [name] of values) {
      if (!shoppingList.columns.has(name)) {
        throw new Error(`Item "${name}" does not exist`);
      }
    }

    shoppingList.items.push({
      done: false,
      cre_date: new Date(),
      fields: new Types.Map(values),
    });

    try {
      const savedShoppingList = await shoppingList.save();
      return savedShoppingList;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  async updateItem(
    shoppingListId: Types.ObjectId,
    shoppingItemId: Types.ObjectId,
    action: ShoppingItemActions,
    values?: Values
  ) {
    let shoppingList;

    try {
      shoppingList = await ShoppingListModel.findById(
        shoppingListId
      );
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }

    if (!shoppingList) {
      throw new Error("Invalid shopping list provided");
    }

    switch (action) {
      case "toggle":
        shoppingList.items.every(item => {
          if (item._id?.equals(shoppingItemId)) {
            item.done = !item.done;
            // break
            return false;
          }
          //  continue
          return true;
        });
        break;
      case "edit":
        if (values) {
          shoppingList.items.every(item => {
            if (item._id?.equals(shoppingItemId)) {
              for (const [key, value] of values) {
                if (item.fields.has(key)) {
                  item.fields.set(key, value);
                }
              }
              // break
              return false;
            }
            //  continue
            return true;
          });
        }
        break;
      default:
        throw new Error("Invalid action provided");
    }

    try {
      const savedShoppingList = await shoppingList.save();
      const shoppingItem = savedShoppingList.items.find(item =>
        item._id?.equals(shoppingItemId)
      );

      return shoppingItem as ShoppingItem;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  async deleteItem(
    shoppingListId: Types.ObjectId,
    shoppingItemId: Types.ObjectId
  ) {
    let shoppingList;

    try {
      shoppingList = await ShoppingListModel.findById(
        shoppingListId
      );
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }

    if (!shoppingList) {
      throw new Error("Invalid shopping list provided");
    }

    const deleteItemIndex = shoppingList.items.findIndex(item =>
      item._id?.equals(shoppingItemId)
    );

    if (deleteItemIndex === -1) {
      throw new Error("Invalid shopping item provided");
    }

    shoppingList.items.splice(deleteItemIndex, 1);

    try {
      await shoppingList.save();
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }
}

export default new ShoppingListController();
