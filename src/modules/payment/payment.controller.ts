import { Controller, Post, Body, Query, Headers, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';

import { Public, User } from '@common/index';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  // الـ frontend بيكلم ده عشان ياخد الـ iframe url
  @Post('create')
  async createPayment(@Body() body: { totalAmount: number }, @User() user: any) {
    return this.paymentService.create(body.totalAmount, user);
  }

  // Paymob بيكلم ده بعد الدفع
  @Public()
  @Post('webhook')
  async handleWebhook(
    @Body() body: any,
    @Query('hmac') hmac: string,  // Paymob بيبعت الـ hmac في الـ query
  ) {
    return this.paymentService.handleWebhook(body, hmac);
  }

  @Public()
  @Get('success')
  async paymentSuccess(@Query() query: any) {
    console.log('payment success query:', query);
    return { message: 'Payment processed' };
  }
}