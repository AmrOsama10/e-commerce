import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category } from './entities/category.entity.js';
import { MESSAGE } from '@common/index';
import { CategoryRepository } from '@models/index';
import { Types } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}
  async create(category: Category) {
    const categoryExist = await this.categoryRepository.getOne({
      slug: category.slug,
    });
    if (categoryExist)
      throw new ConflictException(MESSAGE.Category.alreadyExist);
    return await this.categoryRepository.create(category);
  }

  findAll() {
    return `This action returns all category`;
  }

  async findOne(id: string | Types.ObjectId) {
    const category = await this.categoryRepository.getOne(
      { _id: id },
      {},
      {
        populate: [
          { path: 'createdBy', select: 'userName email' },
          { path: 'updatedBy', select: 'userName email' },
        ],
      },
    );
    if (!category) throw new NotFoundException(MESSAGE.Category.notFound);
    return category;
  }

  async update(id: string, category: Category) {
    const categoryExist = await this.categoryRepository.getOne({
      slug: category.slug,
      _id: { $ne: id },
    });
    if (categoryExist)
      throw new ConflictException(MESSAGE.Category.alreadyExist);
    return await this.categoryRepository.update({ _id: id }, category, {
      new: true,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
