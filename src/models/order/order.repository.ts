import { AbstractRepository } from "@models/abstract.repository";
import { Order } from "./order.schema.js";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OrderRepository extends AbstractRepository<Order> {
    constructor(@InjectModel(Order.name) private readonly orderModel: Model<Order>) {
        super(orderModel)
    }
}