import { AbstractRepository } from "@models/abstract.repository";
import { Product } from "./product.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductRepository extends AbstractRepository<Product> {
    constructor(@InjectModel(Product.name) productModel:Model<Product>) {
        super(productModel)
    }
}