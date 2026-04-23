import { OrderStatus, PaymentMethod } from "@common/enum/index";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class OrderProduct {
    @Prop({ type: SchemaTypes.ObjectId, ref: "Product", required: true })
    productId: Types.ObjectId;

    @Prop({ type: Number, required: true })
    quantity: number;

    @Prop({ type: Number, required: true })
    price: number;

    @Prop({ type: Number })
    discount: number;

    @Prop({ type: Number, required: true })
    totalPrice: number;
}

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Address {
    @Prop({ type: String, required: true })
    street: string;

    @Prop({ type: String, required: true })
    city: string;

    @Prop({ type: String, required: true })
    country: string;

    @Prop({ type: String })
    zipCode: string;

    @Prop({ type: String, required: true })
    phoneNumber: string;
}

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class OrderCoupon {
    @Prop({ type: SchemaTypes.ObjectId, ref: "Coupon", required: true })
    couponId: Types.ObjectId;

    @Prop({ type: Number, required: true })
    discount: number;

    @Prop({ type: String, required: true })
    code: string;
}



@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Order {
    readonly _id: Types.ObjectId;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'Customer', required: true })
    userId: Types.ObjectId;

    @Prop({ type: Address, required: true })
    address: Address

    @Prop({ type: [OrderProduct], required: true })
    products: OrderProduct[];

    @Prop({ type: OrderCoupon, default: null })
    coupon: OrderCoupon;

    @Prop({ type: String, enum: PaymentMethod, default: PaymentMethod.COD })
    paymentMethod: PaymentMethod;

    @Prop({ type: String, default: null })
    paymentIntentId: string;

    @Prop({
        type: String, enum: OrderStatus, default: function () {
            if (this.paymentMethod == PaymentMethod.COD) {
                return OrderStatus.PLACED;
            }
            return OrderStatus.PENDING;
        }
    })
    status: OrderStatus;


    @Prop({ type: Number, required: true })
    totalAmount: number;

    @Prop({ type: Boolean, default: false })
    isPaid: boolean;

    @Prop({ type: Date })
    paidAt: Date;


}
export const orderSchema = SchemaFactory.createForClass(Order);