import { AbstractRepository } from "@models/abstract.repository";
import { User } from "./user.schema.js";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  constructor(@InjectModel(User.name)  private readonly userModel:Model<User>) {
    super(userModel);
  }
}