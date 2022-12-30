import { Schema, model } from "mongoose";

import { ShoppingList, ShoppingItem } from "../types";

const shoppingItemSchema = new Schema<ShoppingItem>({
  done: {
    type: Boolean,
    default: false,
    required: true,
  },
  fields: {
    type: Schema.Types.Map,
    of: String,
  },
  cre_date: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

const shoppingListSchema = new Schema<ShoppingList>(
  {
    title: {
      type: String,
      maxlength: 25,
      required: true,
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "inactive", "archived"],
    },
    user: {
      ref: "user",
      required: true,
      type: Schema.Types.ObjectId,
    },
    cre_date: {
      type: Date,
      required: true,
      default: new Date(),
    },
    columns: {
      type: Schema.Types.Map,
      of: String,
    },
    items: {
      type: [shoppingItemSchema],
    },
  },
  {
    versionKey: false,
  }
);

export default model("shoppingList", shoppingListSchema);
