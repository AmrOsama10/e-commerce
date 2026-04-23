import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
// import { OrderFactory } from './factory/index';
import { Auth, MESSAGE, User } from '@common/index';

@Controller('order')
@Auth(['Customer','Admin'])
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    // private readonly orderFactory: OrderFactory
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto,@User() user: any) {
    // const order = await this.orderFactory.create(createOrderDto,user._id);
    const order = await this.orderService.create(createOrderDto,user);
    return {
      success: true,
      message: MESSAGE.Order.create,
      data: order
    };
  }

  @Get('/all')
  @Auth(['Admin'])
  async findAll() {
    const orders = await this.orderService.findAll();
    return {
      success: true,
      message: "Done",
      data: orders
    };
  }

  @Get('')
  async findOne(@User() user: any) {
    const orders = await this.orderService.findMyOrders(user._id);
    return {
      success: true,
      message: 'Done',
      data: orders
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
