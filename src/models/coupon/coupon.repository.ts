import { AbstractRepository } from "@models/abstract.repository";
import { Coupon } from "./coupon.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()

export class CouponRepository extends AbstractRepository<Coupon> {
    constructor (@InjectModel(Coupon.name) private readonly couponModel:Model<Coupon>){
        super(couponModel)
    }
}