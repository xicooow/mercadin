import bcrypt from "bcrypt";
import { FilterQuery, Types } from "mongoose";

import UserModel from "../models/user";
import { AddUser, Sort, User } from "../types";

class UserController {
  async get(query: FilterQuery<User>, sort?: Sort) {
    return await UserModel.find(query).sort(sort);
  }

  async getById(userId: Types.ObjectId) {
    return await UserModel.findById(userId);
  }

  async remove(userId: Types.ObjectId) {
    return await UserModel.findByIdAndDelete(userId);
  }

  async create({ name, email, password }: AddUser) {
    const userData: User = {
      name,
      email,
      cre_date: new Date(),
      identity: bcrypt.hashSync(password, 8),
    };

    const user = new UserModel(userData);
    return await user.save();
  }
}

export default new UserController();
