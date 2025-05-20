import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './category.schema';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  imports: [
    // Registers the Category schema with Mongoose to enable database operations
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
  ],
  controllers: [CategoryController], // Controller handling HTTP requests related to categories
  providers: [CategoryService], // Service provider handling business logic for categories
})
export class CategoryModule {} // Module encapsulating all category-related components
