import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { CouponFactoryService } from './factory/index';
import { Auth, MESSAGE, Public, User } from '@common/index';

@Controller('coupon')
@Auth(['Admin','Seller'])
export class CouponController {
  constructor(
    private readonly couponService: CouponService,
    private readonly couponFactoryService: CouponFactoryService,
  ) {}

  @Post()
  async create(@Body() createCouponDto: CreateCouponDto , @User()user:any) {
    const coupon = await this.couponFactoryService.createCoupon(createCouponDto,user)
    const createdCoupon = await this.couponService.create(coupon)
    return {
      message:MESSAGE.Coupon.create,
      success:true,
      data:createdCoupon
    }
  }

  @Get()
  async findAll(@User() user:any) {
    const coupons = await this.couponService.findAll(user._id);
    return {
      message: 'done',
      success: true,
      data: coupons,
    };
  }

  
  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    const coupon = await this.couponService.findOne(id);
    return {
      message: 'done',
      success: true,
      data: coupon,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto, @User() user: any) {
    const coupon = await this.couponService.update(id, updateCouponDto, user);
    return {
      message: MESSAGE.Coupon.update,
      success: true,
      data: coupon,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: any) {
    await this.couponService.remove(id, user);
    return {
      message: MESSAGE.Coupon.delete,
      success: true,
    };
  }
  
  @Post('apply')
  async applyCoupon(@Body('couponCode') couponCode: string, @User() user: any) {
      const cart = await this.couponService.applyCoupon(couponCode, user._id);
    return {
      message: 'done',
      success: true,
      data: cart,
    };
  }
}
