import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document; // Mongoose document type for Category

@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt timestamps
export class Category {
  @Prop({ required: true, unique: true }) // Category name, must be unique and is required
  name: string;

  @Prop() // Optional description for the category
  description: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category); // Creates a Mongoose schema from the Category class
