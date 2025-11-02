import { Model } from "mongoose";
import { AbstractRepository } from "../abstract.repository.js";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Customer } from "./customer.schema.js";
@Injectable()
export class CustomerRepository extends AbstractRepository<Customer>{
    constructor(@InjectModel(Customer.name) customerModel:Model<Customer>){
        super(customerModel)
    }
}