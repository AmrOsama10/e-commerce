import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

export enum DiscountType {
  fixed_amount = 'fixed_amount',
  percentage = 'percentage',
}

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Product {
  readonly _id: Types.ObjectId;
  @Prop({ type: String, trim: true, required: true })
  name: string;

  @Prop({ type: String, trim: true, required: true })
  slug: string;

  @Prop({ type: String, trim: true, required: true })
  description: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Brand', required: true })
  brandId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  updatedBy: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 1 })
  price: number;

  @Prop({ type: Number, default: 0, min: 1 })
  discountAmount: number;

  @Prop({
    type: String,
    enum: DiscountType,
    default: DiscountType.fixed_amount,
  })
  discountType: DiscountType.fixed_amount;

  @Virtual({
    get: function (this: Product) {
      if (this.discountType == DiscountType.fixed_amount)
        return this.price - this.discountAmount;
      return this.price - (this.price * this.discountAmount) / 100;
    },
  })
  finalPrice: number;

  @Prop({ type: Number, default: 1, min: 0 })
  stock: number;

  @Prop({ type: Number, min: 0 })
  sold: number;

  @Prop({ type: [String] })
  colors: string[];

  @Prop({ type: [String] })
  size: string[];
}

export const productSchema = SchemaFactory.createForClass(Product);
