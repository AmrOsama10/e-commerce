import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { UserModule } from '@shared/index';

@Module({
  imports:[UserModule],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
