import { Schema, model } from "mongoose";

import { User } from "../types";
import { EMAIL_REGEX } from "../constants";

const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    identity: {
      type: String,
      required: true,
    },
    cre_date: {
      type: Date,
      required: true,
      default: new Date(),
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform: (_doc, ret: Partial<User>) => {
        delete ret.identity;
        return ret;
      },
    },
  }
);

userSchema.path("email").validate((value: string) => {
  if (!value) return false;
  return EMAIL_REGEX.test(value);
}, "Invalid email");

export default model("user", userSchema);
