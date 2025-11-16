import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './../dto/create-category.dto';
import { Category } from '../entities/category.entity.js';
import slugify from 'slugify';
import { UpdateCategoryDto } from '../dto/update-category.dto.js';
import { CategoryRepository } from '@models/index';

@Injectable()
export class CategoryFactoryService {
  constructor(private readonly categoryRepository:CategoryRepository){}
  createCategory(createCategoryDto: CreateCategoryDto, user: any) {
    const category = new Category();
    category.name = createCategoryDto.name;
    category.slug = slugify(createCategoryDto.name); //"-"
    category.createdBy = user._id;
    category.updatedBy = user._id;
    category.logo = createCategoryDto.logo;
  
    return category;
  }
  async updateCategory(id:string,updateCategoryDto: UpdateCategoryDto, user: any) {
    const oldCategory = await this.categoryRepository.getOne({_id:id})
    if(!oldCategory) throw new NotFoundException('category not found')
    const category = new Category();
    category.name = updateCategoryDto.name ||oldCategory.name;
    category.slug = slugify(updateCategoryDto.name|| oldCategory.name); //"-"
    category.updatedBy = user._id;
    category.logo = updateCategoryDto.logo || oldCategory.logo;
  
    return category;
  }
}
