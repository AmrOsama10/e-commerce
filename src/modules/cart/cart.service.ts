import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ProductService } from '@modules/product/product.service';
import { CartRepository } from '@models/index';
import { DiscountType, MESSAGE } from '@common/index';
import { Types } from 'mongoose';
import { CouponService } from '@modules/coupon/coupon.service';

@Injectable()
export class CartService {
  constructor(
    private readonly ProductService: ProductService,
    private readonly cartRepository: CartRepository,
    private readonly couponService: CouponService,
  ) { }
  async addToCart(addToCartCartDto: AddToCartDto, user: any) {
    const product = await this.ProductService.findOne(addToCartCartDto.productId);
    const cart = await this.cartRepository.getOne({ userId: user._id });

    if (!cart) {
      return await this.createCart(product, addToCartCartDto.quantity, user);
    }
    const index = cart.products.findIndex((product) =>
      product.productId.equals(addToCartCartDto.productId),
    );

    if (index == -1) {
      cart.products.push({
        productId: addToCartCartDto.productId,
        quantity: addToCartCartDto.quantity,
        finalPrice: addToCartCartDto.quantity * product.finalPrice,
      });
      cart.totalPrice = cart.products.reduce((sum: number, item: any) => {
        return sum + item.finalPrice;
      }, 0);

    } else {
      cart.products[index].quantity = addToCartCartDto.quantity;
    }

    cart.totalPrice = cart.products.reduce((sum: number, item: any) => {
      return sum + item.finalPrice;
    }, 0);

    // ✅ لو في كوبون اتطبق قبل كده، أعد حساب الـ priceAfterDiscount بس
    if (cart.couponCode) {
      await this.recalculateDiscount(cart);
    }
    await cart.save();
    return cart;
  }

  async createCart(product: any, quantity: number, user: any) {
    const cart = await this.cartRepository.create({
      userId: user._id,
      products: [
        {
          productId: product._id,
          quantity,
          finalPrice: quantity * product.finalPrice,
        },
      ],
      totalPrice: quantity * product.finalPrice,
    });
    return cart;
  }

  async removeFromCart(productId: string, user: any) {
    const product = await this.cartRepository.update(
      { userId: user._id, 'products.productId': productId },
      {
        $pull: { products: { productId } },
      },
    );
    if (!product) {
      throw new NotFoundException(MESSAGE.Product.notFound);
    }
    return true;
  }

  async clearCart(user: any) {
    await this.cartRepository.delete({ userId: user._id });
  }

  async getCart(user: any) {
    const cart = await this.cartRepository.getOne(
      { userId: user._id },
      {},
      { populate: 'products.productId' }
    );
    if (!cart) {
      throw new NotFoundException(MESSAGE.Cart.notFound);
    }
    return cart;
  }

  private async recalculateDiscount(cart: any) {
    if (!cart.couponCode) return;

    const coupon = await this.couponService.findOneByCode(cart.couponCode);

  
    if (!coupon || !coupon.active || coupon.toDate < new Date()) {
   
      cart.couponCode = null;
      cart.priceAfterDiscount = 0;
      return;
    }

    if(coupon.usedBy.some((user) => user.toString() === user._id.toString())) {
      throw new ConflictException("coupon is already used by this user");
    }

    if (coupon.discountType === DiscountType.percentage) {
      const discount = (cart.totalPrice * coupon.discountAmount) / 100;
      cart.priceAfterDiscount = cart.totalPrice - discount;
    } else {
      cart.priceAfterDiscount = cart.totalPrice - coupon.discountAmount;
    }
  }
}
