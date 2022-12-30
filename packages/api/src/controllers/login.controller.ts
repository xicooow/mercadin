import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { getErrorMessage } from "../helpers/util";
import { getJWTSecret } from "../constants";
import UserModel from "../models/user";
import { Login } from "../types";

class LoginController {
  async authenticate({ email, password }: Login) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return { error: "User not found", status: 404 };
    }

    const { _id, identity } = user.toObject();

    if (!bcrypt.compareSync(password, identity)) {
      return { error: "Wrong password", status: 400 };
    }

    try {
      const token = jwt.sign(
        { userId: _id.toString() },
        getJWTSecret(),
        {
          expiresIn: "1d",
        }
      );

      return { token };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }
}

export default new LoginController();
