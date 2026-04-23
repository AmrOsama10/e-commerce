
import mongoose, { SchemaTypes, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DiscountType } from '../../common/enum/discount-type';

@Schema({ timestamps: true })
export class UsedBy {
  customerId: Types.ObjectId;
  count: number;
}

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Coupon {
  readonly _id: Types.ObjectId;

  @Prop({ type: String, unique: true, trim: true })
  code: string;

  @Prop({ type: Number, required: true })
  discountAmount: number;

  @Prop({
    type: String,
    enum: DiscountType,
    default: DiscountType.fixed_amount,
  })
  discountType: DiscountType;

  @Prop({ type: Date, required: true })
  fromDate: Date;

  @Prop({ type: Date, required: true })
  toDate: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  updatedBy: Types.ObjectId;    

  @Prop({ type: Boolean, default: true })
  active: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  usedBy: mongoose.Types.ObjectId[];
}

export const couponSchema = SchemaFactory.createForClass(Coupon);
