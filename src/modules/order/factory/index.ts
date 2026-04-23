// import { Order } from "../entities/order.entity.js";
// import { CreateOrderDto } from "../dto/create-order.dto.js";
// import { OrderStatus } from "@common/index";
// import { Types } from "mongoose";

// export class OrderFactory {
//     create(createOrderDto: CreateOrderDto, userId: string) {
//         const order = new Order();

//         order.address = createOrderDto.address;
   
//         order.paymentMethod = createOrderDto.paymentMethod;

//         // ❌ شيل الـ status من هنا، الـ schema بيحدده تلقائي حسب paymentMethod

//         return order;
//     }
// }