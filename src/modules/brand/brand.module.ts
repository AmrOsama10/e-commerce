import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { BrandFactoryService } from './factory/index';
import { Brand, BrandRepository, brandSchema } from '@models/index';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '@shared/index';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Brand.name, schema: brandSchema }]),
  ],
  controllers: [BrandController],
  providers: [
    BrandService,
    BrandFactoryService,
    BrandRepository,
  ],
  exports: [
    BrandService,
    BrandFactoryService,
    BrandRepository,
  ],
})
export class BrandModule {}
