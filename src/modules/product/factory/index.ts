import slugify from 'slugify';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from './../dto/create-product.dto';
import { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductFactoryService {
  createProduct(createProductDto: CreateProductDto, user: any) {
    const product = new Product();

    product.name = createProductDto.name;
    product.description = createProductDto.description;
    product.slug = slugify(createProductDto.name);

    product.brandId = new Types.ObjectId(createProductDto.brandId);
    product.categoryId = new Types.ObjectId(createProductDto.categoryId);
    product.createdBy = user._id;
    product.updatedBy = user._id;

    product.price = createProductDto.price;
    product.discountAmount = createProductDto.discountAmount;
    product.discountType = createProductDto.discountType;
    product.stock = createProductDto.stock;
    product.sold = 0;

    product.colors = createProductDto.colors;
    product.size = createProductDto.size;

    return product
  }
}
