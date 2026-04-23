import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandFactoryService } from './factory/index';
import { Auth, MESSAGE, Public, User } from '@common/index';

@Controller('brand')
@Auth(['Admin'])
export class BrandController {
  constructor(
    private readonly brandService: BrandService,
    private readonly brandFactoryService: BrandFactoryService,
  ) {}

  @Post()
  async create(@Body() createBrandDto: CreateBrandDto, @User() user: any) {
    const brand = this.brandFactoryService.createBrand(createBrandDto, user);
    const createdBrand = await this.brandService.create(brand);
    return {
      message: MESSAGE.Brand.create,
      success: true,
      data: createdBrand,
    };
  }

  @Public()
  @Get()
  async findAll() {
    const brands = await this.brandService.findAll();
    return {
      message: 'done',
      success: true,
      data: brands,
    };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const brand = await this.brandService.findOne(id);
    return {
      message: 'done',
      success: true,
      data: brand,
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
    @User() user: string,
  ) {
    const brand = await this.brandFactoryService.updateBrand(
      id,
      updateBrandDto,
      user,
    );
    const updatedBrand = await this.brandService.update(id, brand);
    return {
      message: MESSAGE.Brand.update,
      success: true,
      data: updatedBrand,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.brandService.remove(id);
    return {
      message: MESSAGE.Brand.delete,
      success: true,
    };
  }
}
