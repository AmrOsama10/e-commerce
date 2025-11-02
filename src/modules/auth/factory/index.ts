import { Customer } from '../entities/auth.entity.js';
import { RegisterAuthDto } from './../dto/register-auth.dto';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { generateOtp, generateOtpExpiry } from '../../../common/helpers/otp-helper.js';

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
}
