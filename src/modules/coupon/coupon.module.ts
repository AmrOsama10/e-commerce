import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { CouponFactoryService } from './factory/index';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartRepository, cartSchema, Coupon, CouponRepository, couponSchema, Product, ProductRepository, productSchema } from '@models/index';
import { UserModule } from '@shared/index';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: Coupon.name, schema: couponSchema },
      { name: Product.name, schema: productSchema },
      { name: Cart.name, schema: cartSchema }
    ]),
  ],
  controllers: [CouponController],
  providers: [CouponService, CouponFactoryService, CouponRepository, ProductRepository, CartRepository],
  exports: [CouponService, CouponFactoryService, CouponRepository, ProductRepository, CartRepository],
})
export class CouponModule { }
