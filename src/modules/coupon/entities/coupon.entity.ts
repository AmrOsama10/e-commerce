import { DiscountType } from "@common/index";
import { UsedBy } from "@models/index";
import mongoose, { Types } from "mongoose";

export class Coupon {
  readonly _id: Types.ObjectId;
  code: string;

  discountAmount: number;

  discountType: DiscountType;

  fromDate: Date;

  toDate: Date;

  createdBy: Types.ObjectId;

  updatedBy: Types.ObjectId;

  active: boolean;

  usedBy: mongoose.Types.ObjectId[];
}
