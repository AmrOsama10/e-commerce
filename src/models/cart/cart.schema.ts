import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  SchemaTypes, Types } from 'mongoose';

@Schema()
export class ProductCart {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Product' })
  productId: Types.ObjectId;

  @Prop({ type: Number, default: 1 })
  quantity: number;

  @Prop({ type: Number, required: true })  
  finalPrice: number;
}

@Schema({ timestamps: true, toObject: { virtuals: true } })
export class Cart {
  readonly _id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Customer' })
  userId: Types.ObjectId;

  @Prop({ type: [ProductCart], default: [] })
  products: ProductCart[];

  @Prop({ type: Number, default: 0 })
  totalPrice: number;

  @Prop({ type: Number, default: 0 })         
  priceAfterDiscount: number;

  @Prop({ type: String, default: null })     
  couponCode: string;
}

export const cartSchema = SchemaFactory.createForClass(Cart)