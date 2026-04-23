import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Order, OrderRepository, orderSchema } from '@models/index';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: orderSchema }])
  ],
  controllers: [PaymentController],
  providers: [PaymentService, OrderRepository],
  exports: [PaymentService], 
})
export class PaymentModule { }
