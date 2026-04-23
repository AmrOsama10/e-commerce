import { DiscountType, IsValidDate } from '@common/index';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MinDate,
} from 'class-validator';

export class CreateCouponDto {
  @IsString()
  @Length(5)
  code: string;

  @IsNumber()
  @IsOptional()
  discountAmount: number;

  @IsString()
  @IsEnum(DiscountType)
  discountType: DiscountType;

  @Transform(({ value }) => {
    const d = new Date(value);
    return isNaN(d.getTime()) ? undefined : d;
  })
  @IsDate()
  @MinDate(new Date())
  fromDate: Date;

  @Transform(({ value }) => {
    const d = new Date(value);
    return isNaN(d.getTime()) ? undefined : d;
  })
  @IsDate()
  @IsValidDate('fromDate')
  toDate: Date;

  @IsBoolean()
  active: boolean;
}
