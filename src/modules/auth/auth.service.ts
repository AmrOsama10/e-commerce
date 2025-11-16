import {
  checkOtp,
  generateOtp,
  generateOtpExpiry,
  MESSAGE,
  sendEmail,
} from '@common/index';
import { CustomerRepository, UserRepository } from '@models/index';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IsVerifyDTO } from './dto/IsVerify.dto.js';
import { LoginDTO } from './dto/login.dto.js';
import { Customer } from './entities/auth.entity.js';
import { ForgetPasswordDTO } from './dto/forget-password.dto';
import { OAuth2Client } from 'google-auth-library';
import { AuthFactoryService } from './factory/index.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authFactoryService: AuthFactoryService,
  ) {}
  async register(customer: Customer) {
    const customerExist = await this.customerRepository.getOne({
      email: customer.email,
    });
    if (customerExist) throw new ConflictException(MESSAGE.User.alreadyExist);

    await sendEmail({
      to: customer.email,
      subject: 'confirm email',
      html: `<h1>your otp is ${customer.otp} </h1>`,
    });

    const createdCustomer = await this.customerRepository.create(customer);

    const { otp, otpExpiry, password, ...customerObj } = JSON.parse(
      JSON.stringify(createdCustomer),
    );

    return customerObj as Customer;
  }

  async login(loginDTO: LoginDTO) {
    const userExist = await this.userRepository.getOne({
      email: loginDTO.email,
    });
    const match = await bcrypt.compare(
      loginDTO.password,
      userExist?.password || '',
    );
    if (!userExist) {
      throw new UnauthorizedException('invalid credentials');
    }
    if (!match) {
      throw new UnauthorizedException('invalid credentials');
    }
    const token = await this.jwtService.signAsync(
      { _id: userExist._id, email: userExist.email, role: 'Customer' },
      { expiresIn: '1h', secret: this.configService.get('access').jwt_secret },
    );
    return token;
  }

  async isVerify(isVerifyDTO: IsVerifyDTO) {
    const userExist = await this.customerRepository.getOne({
      email: isVerifyDTO.email,
    });
    if (!userExist) throw new NotFoundException(MESSAGE.User.notFound);
    await checkOtp(userExist, isVerifyDTO);

    const userUpdated = await this.customerRepository.update(
      { _id: userExist._id },
      { isVerified: true, otp: '', otpExpiry: '' },
    );
    return userUpdated;
  }

  async senOtp(email: string) {
    const userExist = await this.customerRepository.getOne({
      email,
    });
    if (!userExist) throw new NotFoundException(MESSAGE.User.notFound);
    const otp = generateOtp();
    const otpExpiry = generateOtpExpiry();
    await sendEmail({
      to: userExist.email,
      subject: 'confirm otp',
      html: `<h1>your otp is ${otp} </h1>`,
    });
    userExist.otp = otp;
    userExist.otpExpiry = otpExpiry;
    userExist.save();
    return userExist;
  }

  async forgetPassword(forgetPasswordDTO: ForgetPasswordDTO) {
    const userExist = await this.customerRepository.getOne({
      email: forgetPasswordDTO.email,
    });
    if (!userExist) throw new NotFoundException(MESSAGE.User.notFound);

    await checkOtp(userExist, forgetPasswordDTO);
    this.customerRepository.update(
      { _id: userExist._id },
      {
        password: await bcrypt.hash(forgetPasswordDTO.newPassword, 10),
        otp: '',
        otpExpiry: '',
      },
    );
    return userExist;
  }

  async googleLogin(idToken: string) {
    const clint = new OAuth2Client(
      this.configService.get('access').googleClintId,
    );
    const ticket = await clint.verifyIdToken({ idToken });
    const payload = ticket.getPayload();
    if (!payload) throw new BadRequestException('invalid google token');
    const userExist = await this.userRepository.getOne({
      email: payload.email,
    });

    if (!userExist) {
      const user = await this.authFactoryService.googleLogin(
        payload.name as string,
        payload.email as string,
      );
      const createdUser = await this.userRepository.create(user);
      return createdUser;
    }
  }
}
