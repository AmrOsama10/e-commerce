import { Model } from "mongoose";
import { AbstractRepository } from "../abstract.repository.js";
import { Seller } from "./seller.schema.js";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
@Injectable()
export class SellerRepository extends AbstractRepository<Seller> {
  constructor(@InjectModel(Seller.name) sellerSchema: Model<Seller>) {
    super(sellerSchema);
  }
}