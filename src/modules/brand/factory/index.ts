import slugify from 'slugify';
import { Brand } from '../entities/brand.entity';
import { CreateBrandDto } from './../dto/create-brand.dto';
import { UpdateBrandDto } from './../dto/update-brand.dto';
import { BrandRepository } from '@models/index';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class BrandFactoryService {
  constructor(private readonly brandRepository: BrandRepository) {}
  createBrand(createBrandDto: CreateBrandDto, user: any) {
    const brand = new Brand();

    brand.name = createBrandDto.name;
    brand.slug = slugify(createBrandDto.name);
    brand.createdBy = user._id;
    brand.updatedBy = user._id;
    brand.logo = createBrandDto.logo;

    return brand;
  }

  async updateBrand(id: string, updateBrandDto: UpdateBrandDto, user: any) {
    const oldBrand = await this.brandRepository.getOne({ _id: id });
    if (!oldBrand) throw new NotFoundException('brand not found');

    const brand = new Brand();

    brand.name = updateBrandDto.name || oldBrand.name;
    brand.slug = slugify(updateBrandDto.name || oldBrand.name);
    brand.updatedBy = user._id;
    brand.logo = updateBrandDto.logo || oldBrand.logo;

    return brand;
  }
}
