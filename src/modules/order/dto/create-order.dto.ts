import { PaymentMethod } from "@common/index";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsMongoId, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { Types } from "mongoose";


class AddressDto {
    @IsString()
    street: string;
    @IsString()
    city: string;
    @IsString()
    country: string;
    @IsString()
    zipCode: string;
    @IsString()
    phoneNumber: string;
}


export class CreateOrderDto {
    @ValidateNested()
    @Type(() => AddressDto)
    address: AddressDto;

    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;
}