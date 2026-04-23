import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CouponRepository, OrderRepository, ProductRepository } from '@models/index';
import { CartService } from '@modules/cart/cart.service';

import { Types } from 'mongoose';
import { PaymentMethod } from '@common/index';
import { PaymentService } from '@modules/payment/payment.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly cartService: CartService,
    private readonly productRepository: ProductRepository,
    private readonly couponRepository: CouponRepository,
    private readonly paymentService: PaymentService,

  ) { }
  async create(createOrderDto: CreateOrderDto, user: any) {
    // 1. Get cart 
    const cart = await this.cartService.getCart(user);

    // 2. Check if cart is not empty
    if (!cart || cart.products.length === 0)
      throw new NotFoundException('Cart is empty');

    // 3. Check stock for each product
    for (const item of cart.products) {
      const product = item.productId as any;
      if (item.quantity > product.stock)
        throw new ConflictException(`Product ${product.name} is out of stock`);
    }

    // 4. totalAmount
    let totalAmount = cart.products.reduce((sum, item) => {
      const product = item.productId as any;
      return sum + (product.finalPrice * item.quantity);
    }, 0);

    // 5. Check for coupon
    let orderCoupon;
    if (cart.couponCode) {
      const coupon = await this.couponRepository.getOne({ code: cart.couponCode });
      if (coupon) {
        orderCoupon = {
          couponId: coupon._id,
          code: coupon.code,
          discount: coupon.discountAmount,
        };
        totalAmount = cart.priceAfterDiscount ?? totalAmount;
      }
    }

    // 6. create order
    const order = await this.orderRepository.create({
      userId: user._id,
      address: createOrderDto.address,
      paymentMethod: createOrderDto.paymentMethod,
      coupon: orderCoupon || null,
      totalAmount,
      products: cart.products.map((item) => {
        const product = item.productId as any;
        return {
          productId: product._id,
          quantity: item.quantity,
          price: product.price,
          discount: product.discountAmount ?? 0,
          totalPrice: product.finalPrice * item.quantity,
        };
      }),
    });

    // 7. Update coupon usedBy
    await this.couponRepository.update(
      { code: cart.couponCode },
      { $push: { usedBy: user._id } },
    );
    
    // 8. Update product stock and sold
    for (const item of cart.products) {
      const product = item.productId as any;
      await this.productRepository.update(
        { _id: product._id },
        {
          $inc: {
            stock: -item.quantity,
            sold: item.quantity
          }
        },
        { new: true }
      );
    }

    
    
    // 9. Store paymob order id in the order
    if (createOrderDto.paymentMethod === PaymentMethod.CREDIT_CARD) {
      const payment = await this.paymentService.create(totalAmount, user);
      
      await this.orderRepository.update(
        { _id: order._id },
        { paymentIntentId: payment.paymobOrderId },
        { new: true }
      );
      
      
      return { order, iframeUrl: payment.iframeUrl };
    }
    
    // 10. Clear cart
    await this.cartService.clearCart(user);
    
    return order;
  }

  async findAll() {
    return await this.orderRepository.getAll({});
  }

  async findMyOrders(userId: string) {
    const orders = await this.orderRepository.getAll({ userId });
    if (!orders) throw new NotFoundException('No orders found for this user');
    return orders;
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}



