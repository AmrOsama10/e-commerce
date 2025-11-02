import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '@shared/index';

@Module({
  imports:[UserModule],
  controllers: [CustomerController],
  providers: [CustomerService, JwtService],
})
export class CustomerModule {}
