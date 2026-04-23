import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Coupon } from './entities/coupon.entity';
import { CartRepository, CouponRepository, ProductRepository } from '@models/index';
import { DiscountType, MESSAGE } from '@common/index';

@Injectable()
export class CouponService {
  constructor(private readonly couponRepository: CouponRepository,
    private readonly productRepository: ProductRepository,
    private readonly cartRepository: CartRepository,
  ) { }
  async create(coupon: Coupon) {
    const couponExist = await this.couponRepository.getOne({ _id: coupon._id })
    if (couponExist) throw new ConflictException(MESSAGE.Coupon.alreadyExist)
    return await this.couponRepository.create(coupon)
  }

  async findAll(userId: string) {
    const coupons = await this.couponRepository.getAll({ createdBy: userId });
    
    if (coupons.length === 0) throw new ConflictException(MESSAGE.Coupon.notFound)
    return coupons;
  }

  async findOne(id: string) {
    const coupon = await this.couponRepository.getOne({ _id: id });
    if (!coupon) throw new ConflictException(MESSAGE.Coupon.notFound)
    return coupon;
  }
  
  async findOneByCode(code: string) {
    const coupon = await this.couponRepository.getOne({ code });
    if (!coupon) throw new ConflictException(MESSAGE.Coupon.notFound)
    return coupon;
  }

  async update(id: string, updateCouponDto: UpdateCouponDto, user: any) {
    const coupon = await this.couponRepository.getOne({ _id: id });
    if (!coupon) throw new ConflictException(MESSAGE.Coupon.notFound)
    if (user.role !== 'Admin') {
      if (coupon.createdBy.toString() !== user._id.toString()) {
        throw new ConflictException(MESSAGE.Unauthorized.unauthorized)
      }
    }
    
    return await this.couponRepository.update({ _id: id }, {...updateCouponDto, updatedBy: user._id },{new: true});
  }
  
  async remove(id: string, user: any) {
    const coupon = await this.couponRepository.getOne({ _id: id });
    if (!coupon) throw new ConflictException(MESSAGE.Coupon.notFound)
    if (user.role !== 'Admin') {
      if (coupon.createdBy.toString() !== user._id.toString()) {
        throw new ConflictException(MESSAGE.Unauthorized.unauthorized)
      }
    }
    return await this.couponRepository.delete({ _id: id });
  }

  async applyCoupon(couponCode: string, userId: string) {

    const coupon = await this.couponRepository.getOne({ code: couponCode });
    if (!coupon) throw new NotFoundException(MESSAGE.Coupon.notFound);
    if (!coupon.active) throw new ConflictException("coupon is inactive");
    if (coupon.toDate < new Date()) throw new ConflictException("coupon is expired");
    if (coupon.usedBy.some((user) => user.toString() === userId.toString()))
      throw new ConflictException("coupon is already used by this user");

    const cart = await this.cartRepository.getOne({ userId });
    if (!cart) throw new NotFoundException("Cart not found");
    if (cart.products.length === 0) throw new ConflictException("Cart is empty");

  
    let priceAfterDiscount: number;
    if (coupon.discountType === DiscountType.percentage) {
      const discount = (cart.totalPrice * coupon.discountAmount) / 100;
      priceAfterDiscount = cart.totalPrice - discount;
    } else {
      priceAfterDiscount = cart.totalPrice - coupon.discountAmount;
    }

  
    const updatedCart = await this.cartRepository.update(
      { userId },
      {
        totalPrice: cart.totalPrice,     
        priceAfterDiscount,
        couponCode: coupon.code
      },
      { new: true }
    );

    await this.couponRepository.update(
      { _id: coupon._id },
      
      { new: true }
    );

    return updatedCart;
  }
  
}

