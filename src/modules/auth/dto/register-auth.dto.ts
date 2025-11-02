import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
export class RegisterAuthDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  userName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsDateString()
  @IsNotEmpty()
  dob: Date;
}
