import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class IsVerifyDTO {
    @IsString()
    @IsNotEmpty()
  otp: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
