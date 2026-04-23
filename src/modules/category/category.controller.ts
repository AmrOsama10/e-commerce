import { Auth, Public } from '@common/decorator';
import { MESSAGE, User } from '@common/index';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryFactoryService } from './factory';

@Controller('category')
@Auth(['Admin'])
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly categoryFactoryService: CategoryFactoryService,
  ) {}

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @User() user: any,
  ) {
    const category = this.categoryFactoryService.createCategory(
      createCategoryDto,
      user,
    );
    const createdCategory = await this.categoryService.create(category);
    return {
      message: MESSAGE.Category.create,
      success: true,
      data: createdCategory,
    };
  }

  @Get()
  @Public()
  async findAll() {
    const categories = await this.categoryService.findAll();
    return {
      message: 'done',
      success: true,
      data: categories,
    };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const category = await this.categoryService.findOne(id);
    return {
      message: 'done',
      success: true,
      data: category,
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @User() user: any,
  ) {
    const category = await this.categoryFactoryService.updateCategory(
      id,
      updateCategoryDto,
      user,
    );
    const updatedCategory = await this.categoryService.update(id, category);
    return {
      message: MESSAGE.Category.update,
      success: true,
      data: updatedCategory,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.categoryService.remove(id);
    return {
      message: MESSAGE.Category.delete,
      success: true,
    };
  }
}
