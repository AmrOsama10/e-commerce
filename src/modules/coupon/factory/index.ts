
import { generateCode } from '@common/index';
import { Coupon } from '../entities/coupon.entity';
import { CreateCouponDto } from './../dto/create-coupon.dto';
export class CouponFactoryService {
  async createCoupon(createCouponDto: CreateCouponDto, user: any) {
    const coupon = new Coupon();

    let code;
    if (createCouponDto.code) {
      code = createCouponDto.code;
    } else {
      code = await generateCode();
    }

    coupon.code = code;
    coupon.discountAmount = createCouponDto.discountAmount;
    coupon.discountType = createCouponDto.discountType;
    coupon.createdBy = user._id;
    coupon.updatedBy = user._id;
    coupon.fromDate = createCouponDto.fromDate;
    coupon.toDate = createCouponDto.toDate;
    coupon.active = createCouponDto.active;
    coupon.usedBy = [];

    return coupon;
  }
}
