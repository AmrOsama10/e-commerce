import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Coupon, CouponRepository, couponSchema, Order, OrderRepository, orderSchema, Product, ProductRepository, productSchema } from '@models/index';
import { MongooseModule } from '@nestjs/mongoose';
import { CartModule } from '@modules/cart/cart.module';
// import { OrderFactory } from './factory/index.js';
import { UserModule } from '@shared/index';
import { PaymentModule } from '@modules/payment/payment.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: orderSchema },
      { name: Product.name, schema: productSchema },
      { name: Coupon.name, schema: couponSchema },
    ]),
    UserModule,
    CartModule,
    PaymentModule

],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, ProductRepository, CouponRepository],
})
export class OrderModule {}
