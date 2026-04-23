import { OrderStatus, PaymentMethod } from "@common/index";
import { Types } from "mongoose";


export class OrderProduct {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
    discount: number;
    totalPrice: number;
}

export class Address {
    street: string;
    city: string;
    country: string;
    zipCode: string;
    phoneNumber: string;
}

export class OrderCoupon {
    couponId: Types.ObjectId;
    discount: number;
    code: string;
}

export class Order {
    readonly _id: Types.ObjectId;
    userId: Types.ObjectId;
    address: Address
    products: OrderProduct[];
    coupon: OrderCoupon;
    paymentMethod: PaymentMethod;
    status: OrderStatus;
    totalAmount: number;

}