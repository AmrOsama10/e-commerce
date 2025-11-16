import { RegisterAuthDto } from './../dto/register-auth.dto';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import {
  generateOtp,
  generateOtpExpiry,
} from '../../../common/helpers/otp-helper.js';
import { Customer, USER_AGENT } from './../entities/auth.entity';

@Injectable()
export class AuthFactoryService {
  async createdCustomer(registerAuthDto: RegisterAuthDto) {
    const customer = new Customer();

    customer.userName = registerAuthDto.userName;
    customer.email = registerAuthDto.email;
    customer.password = await bcrypt.hash(registerAuthDto.password, 10);
    customer.otp = generateOtp();
    customer.otpExpiry = generateOtpExpiry();
    customer.dob = registerAuthDto.dob;
    customer.isVerified = false;

    return customer;
  }

  async googleLogin(userName: string, email: string) {
    const customer = new Customer();

    customer.userName = userName;
    customer.email = email;
    customer.userAgent = USER_AGENT.google;
    customer.isVerified = true

    return customer;
  }
}
