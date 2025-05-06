import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './create-category.dto';
import { CategoryDocument } from './category.schema';
import { AdminGuard } from '../guards/admin.guard';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AdminGuard)
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryDocument> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  async findAll(): Promise<CategoryDocument[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CategoryDocument> {
    return this.categoryService.findOne(id);
  }
}