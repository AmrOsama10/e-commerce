import { Auth, MESSAGE, Public, User } from '@common/index';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFactoryService } from './factory/index';
import { ProductService } from './product.service';

@Controller('product')
@Auth(['Admin', 'Seller'])
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productFactoryService: ProductFactoryService,
  ) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto, @User() user: any) {
    const product = this.productFactoryService.createProduct(
      createProductDto,
      user,
    );
    const createdProduct = await this.productService.create(product , user);
    return {
      message: MESSAGE.Product.create,
      success:true,
      data:createdProduct
    };
  }

  @Get()
  @Public()
  async findAll() {
    const products = await this.productService.findAll();
    return {
      message: 'done',
      success: true,
      data: products,
    };
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne(id);
    return {
      success:true,
      data:product
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() product: UpdateProductDto) {
   
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.productService.remove(id);
    return {
      message: MESSAGE.Product.delete,
      success: true,
    };
  }
}
