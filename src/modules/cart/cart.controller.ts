import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto.js';
import { Auth, MESSAGE, User } from '@common/index';

@Controller('cart')
@Auth(['Admin','Customer'])
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async addToCart(@Body() addToCartCartDto: AddToCartDto,@User() user:any) {
    const cart =  await this.cartService.addToCart(addToCartCartDto,user);
    return {
      message:MESSAGE.Cart.update,
      success:true,
      data:cart
    }
  }

  @Put("remove/:productId")
  async removeFromCart(@Param('productId') productId:string , @User() user:any){
    await this.cartService.removeFromCart(productId,user)
    return {
      message:MESSAGE.Cart.update,
      success:true,
    }
  }

  @Get()
  async getCart(@User() user:any){
    const cart = await this.cartService.getCart(user)
    return {
      message:'done',
      success:true,
      data:cart
    }
  }
}
