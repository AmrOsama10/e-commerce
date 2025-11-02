import { BadRequestException, UnauthorizedException } from '@nestjs/common';

export const generateOtp = () => {
  return Math.ceil(Math.random() * 9999 + 10000) as unknown as string;
};

export const generateOtpExpiry =()=>{
  return new Date(Date.now() + 5 * 60 * 1000);
}

export const checkOtp = async (userExist: any, DTO: any) => {
  if (DTO.otp != userExist.otp) {
    throw new UnauthorizedException('invalid otp');
  }
  if (new Date(Date.now()) > userExist.otpExpiry) {
    throw new BadRequestException('otp expiry');
  }
};
