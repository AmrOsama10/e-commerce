import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { ProductRepository } from '@models/index';
import { CategoryService } from './../category/category.service';
import { BrandService } from './../brand/brand.service';
import { MESSAGE } from '@common/index';
import { Types } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(
    private readonly ProductRepository: ProductRepository,
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService,
  ) {}
  async create(product: Product, user: any) {
    await this.categoryService.findOne(product.categoryId);
    await this.brandService.findOne(product.brandId);
    const productExist = await this.ProductRepository.getOne({
      slug: product.slug,
      $or: [{ createdBy: user._id }, { updatedBy: user._id }],
    });
    if (productExist) {
      return await this.update(productExist._id, product);
    }
    return await this.ProductRepository.create(product);
  }

  async findAll() {
    return await this.ProductRepository.getAll();
  }

  async findOne(id: string | Types.ObjectId) {
    const productExist = await this.ProductRepository.getOne({ _id: id });
    if (!productExist) throw new NotFoundException(MESSAGE.Product.notFound);
    return productExist;
  }

  async update(id: string | Types.ObjectId, product: Product) {
    const productExist = await this.ProductRepository.getOne({ _id: id });
    if (!productExist) throw new NotFoundException(MESSAGE.Product.notFound);
    product.stock += productExist.stock;
    return await this.ProductRepository.update({ _id: id }, product, {
      new: true,
    });
  }

  async remove(id: string | Types.ObjectId) {
    const product = await this.ProductRepository.delete({ _id: id });
    if (!product) throw new NotFoundException(MESSAGE.Product.notFound);
    return product;
  }
}
