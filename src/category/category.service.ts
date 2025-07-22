import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './category.schema';
import { CreateCategoryDto } from './create-category.dto';

@Injectable() // Marks this class as a provider that can be injected into other classes
export class CategoryService {
  // Injects the Mongoose model for Category
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

  // Creates and saves a new category in the database
  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryDocument> {
    const createdCategory = new this.categoryModel(createCategoryDto);
    return createdCategory.save();
  }

  // Retrieves all categories from the database
  async findAll(): Promise<CategoryDocument[]> {
    return this.categoryModel.find().exec();
  }

  // Retrieves a single category by its ID
  async findOne(id: string): Promise<CategoryDocument> {
    return this.categoryModel.findById(id).exec();
  }

  async update(id: string, updateCategoryDto: CreateCategoryDto): Promise<CategoryDocument> {
    return this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true }).exec();
  }

  async remove(id: string): Promise<void> {
    await this.categoryModel.findByIdAndDelete(id).exec();
  } 
}
