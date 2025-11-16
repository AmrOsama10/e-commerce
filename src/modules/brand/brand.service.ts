import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Brand } from './entities/brand.entity';
import { MESSAGE } from '@common/index';
import { BrandRepository } from '@models/index';
import { Types } from 'mongoose';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {}
  async create(brand: Brand) {
    const brandExist = await this.brandRepository.getOne({ slug: brand.slug });

    if (brandExist) throw new ConflictException(MESSAGE.Brand.alreadyExist);

    return await this.brandRepository.create(brand);
  }

  findAll() {
    return `This action returns all brand`;
  }

  async findOne(id: string | Types.ObjectId) {
    const brand = await this.brandRepository.getOne(
      { _id: id },
      {},
      {
        populate: [
          { path: 'createdBy', select: 'userName email' },
          { path: 'updatedBy', select: 'userName email' },
        ],
      },
    );
    if (!brand) throw new NotFoundException(MESSAGE.Brand.notFound);
    return brand;
  }

  async update(id: string, brand: Brand) {
    const brandExist = await this.brandRepository.getOne({
      slug: brand.slug,
      _id: { $ne: id },
    });
    if (brandExist) throw new ConflictException(MESSAGE.Brand.alreadyExist);

    return await this.brandRepository.update({ _id: id }, brand, {
      new: true,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} brand`;
  }
}
