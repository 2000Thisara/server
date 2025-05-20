import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/schemas/user.schema';

export type ProductDocument = Product & mongoose.Document;

// Schema representing a product review
@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt timestamps
export class Review {
  @Prop({
    type: mongoose.Schema.Types.ObjectId, // Reference to a User document by ObjectId
    required: true,
    ref: 'User', // Links to the 'User' collection
    default: null,
  })
  user: User;

  @Prop({ required: true }) // Reviewer's name, required field
  name: string;

  @Prop({ required: true }) // Rating given in the review, required field
  rating: number;

  @Prop({ required: true }) // Review comment, required field
  comment: string;
}

// Schema representing a product
@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt timestamps
export class Product {
  @Prop({ required: true }) // Product name, required field
  name: string;

  @Prop({ required: true }) // Product brand, required field
  brand: string;

  @Prop({ required: true }) // Product category, required field
  category: string;

  @Prop({ require: true }) // Product image URL or path, required field
  image: string;

  @Prop({ required: true }) // Product description, required field
  description: string;

  @Prop({ required: true }) // Array of reviews associated with the product, required field
  reviews: Review[];

  @Prop({ required: true, default: 0 }) // Average rating for the product, defaults to 0
  rating: number;

  @Prop({ required: true, default: 0 }) // Number of reviews, defaults to 0
  numReviews: number;

  @Prop({ required: true, default: 0 }) // Product price, defaults to 0
  price: number;

  @Prop({ required: true, default: 0 }) // Stock count available for the product, defaults to 0
  countInStock: number;
}

// Mongoose schema factory to create the Product schema from the Product class
export const ProductSchema = SchemaFactory.createForClass(Product);
