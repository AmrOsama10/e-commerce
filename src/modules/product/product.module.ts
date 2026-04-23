import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductFactoryService } from './factory/index';
import { UserModule } from '@shared/index';
import { Product, ProductRepository, productSchema } from '@models/index';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from '@modules/category/category.module';
import { BrandModule } from '@modules/brand/brand.module';

@Module({
  imports: [
    UserModule,
    CategoryModule,
    BrandModule,
    MongooseModule.forFeature([{ name: Product.name, schema: productSchema }]),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductFactoryService, ProductRepository],
  exports: [ProductService],
})
export class ProductModule {}
