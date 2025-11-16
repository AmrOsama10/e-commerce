import { Body, Controller, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ForgetPasswordDTO,
  IsVerifyDTO,
  LoginDTO,
  RegisterAuthDto,
} from './dto';
import { AuthFactoryService } from './factory/index';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authFactoryService: AuthFactoryService,
  ) {}

  @Post('/register')
  async register(@Body() registerAuthDto: RegisterAuthDto) {
    const customer =
      await this.authFactoryService.createdCustomer(registerAuthDto);

    const createdCustomer = await this.authService.register(customer);
    return {
      message: 'user created successfully',
      success: true,
      data: { createdCustomer },
    };
  }

  @Post('/login')
  async login(@Body() loginDTO: LoginDTO) {
    const accessToken = await this.authService.login(loginDTO);
    return {
      message: 'user login successfully',
      success: true,
      data: { accessToken },
    };
  }

  @Post('/verify')
  async isVerify(@Body() isVerifyDTO: IsVerifyDTO) {
    await this.authService.isVerify(isVerifyDTO);
    return {
      message: 'user verify successfully',
      success: true,
    };
  }

  @Post('send-otp')
  async sendOtp(@Body('email') email:string){
    await this.authService.senOtp(email)
    return {
      message: 'done',
      success: true,
    };
  }

  @Patch('forget-password')
  async forgetPassword(@Body() forgetPasswordDTO: ForgetPasswordDTO) {
    await this.authService.forgetPassword(forgetPasswordDTO)
    return {
      message: 'done',
      success: true,
    };
  }

  @Post('/google-login')
  async googleLogin (@Body('idToken') idToken:string){
    const createdCustomer = await this.authService.googleLogin(idToken);
     return {
       message: 'user created successfully',
       success: true,
       data: { createdCustomer },
     };
  }
}
