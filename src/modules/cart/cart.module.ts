import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ProductModule } from '@modules/product/product.module';
import { Cart, CartRepository, cartSchema } from '@models/index';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '@shared/index';
import { CouponModule } from '@modules/coupon/coupon.module';

@Module({
  imports: [
    ProductModule,
    UserModule,
    CouponModule,
    MongooseModule.forFeature([{ name: Cart.name, schema: cartSchema }]),
  ],
  controllers: [CartController],
  providers: [CartService, CartRepository],
  exports: [CartService, CartRepository],
})
export class CartModule {}
