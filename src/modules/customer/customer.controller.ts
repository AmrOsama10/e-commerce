import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { AuthGuard } from '../../common/guard/auth.guard.js';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}
  @UseGuards(AuthGuard)
  @Get()
  getProfile(@Request() req: any) {
    return { message: 'done', success: true, data: { users: req.user } };
  }
}
