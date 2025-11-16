import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryFactoryService } from './factory/index.js';
import { Category, CategoryRepository, categorySchema } from '@models/index';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '@shared/index';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: Category.name, schema: categorySchema },
    ]),
  ],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    CategoryFactoryService,
    CategoryRepository,
  ],
  exports: [
    CategoryService,
    CategoryFactoryService,
    CategoryRepository,
  ],
})
export class CategoryModule {}
