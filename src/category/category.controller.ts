import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './create-category.dto';
import { CategoryDocument } from './category.schema';
import { AdminGuard } from '../guards/admin.guard';

@Controller('categories') // Sets the route prefix for all category-related endpoints
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // Creates a new category; access restricted to admin users
 //@UseGuards(AdminGuard)
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryDocument> {
    return this.categoryService.create(createCategoryDto);
  }

  // Retrieves all categories
  @Get()
  async findAll(): Promise<CategoryDocument[]> {
    return this.categoryService.findAll();
  }

  // Retrieves a single category by its ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CategoryDocument> {
    return this.categoryService.findOne(id);
  }
}
