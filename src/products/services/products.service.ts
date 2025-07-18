// import {
//   BadRequestException,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import { PaginatedProducts } from 'src/interfaces';
// import { UserDocument } from 'src/users/schemas/user.schema';
// import { sampleProduct } from '../../utils/data/product';
// import { Product, ProductDocument, Review } from '../schemas/product.schema';
// import pick from 'lodash/pick';

// @Injectable()
// export class ProductsService {
//   constructor(
//     @InjectModel(Product.name) private productModel: Model<ProductDocument>
//   ) {}

//   async findTopRated(): Promise<ProductDocument[]> {
//     const products = await this.productModel
//       .find({})
//       .sort({ rating: -1 })
//       .limit(3);

//     if (!products.length) throw new NotFoundException('No products found.');

//     return products;
//   }

//   async findMany(
//     keyword?: string,
//     pageId?: string
//   ): Promise<PaginatedProducts> {
//     const pageSize = 8;
//     const page = parseInt(pageId) || 1;

//     const regex = keyword ? { name: { $regex: keyword, $options: 'i' } } : {};

//     const count = await this.productModel.countDocuments({ ...regex });
//     const products = await this.productModel
//       .find({ ...regex })
//       .limit(pageSize)
//       .skip(pageSize * (page - 1));

//     if (!products.length) throw new NotFoundException('No products found.');

//     return { products, page, pages: Math.ceil(count / pageSize) };
//   }

//   async findById(id: string): Promise<ProductDocument> {
//     if (!Types.ObjectId.isValid(id))
//       throw new BadRequestException('Invalid product ID.');

//     const product = await this.productModel.findById(id);

//     if (!product) throw new NotFoundException('No product with given ID.');

//     return product;
//   }

//   async createMany(products: Partial<ProductDocument>[]): Promise<ProductDocument[]> {
//     const createdProducts = await this.productModel.insertMany(products);

//     return createdProducts as ProductDocument[];
//   }
  

//   async createSample(): Promise<ProductDocument> {
//     const createdProduct = await this.productModel.create(sampleProduct);

//     return createdProduct;
//   }

//   async update(
//     id: string,
//     attrs: Partial<ProductDocument>
//   ): Promise<ProductDocument> {
//     if (!Types.ObjectId.isValid(id))
//       throw new BadRequestException('Invalid product ID.');

//     const product = await this.productModel.findById(id);

//     if (!product) throw new NotFoundException('No product with given ID.');

//     // Update only if attrs are defined
//     if (attrs.name !== undefined) product.name = attrs.name;
//     if (attrs.price !== undefined) product.price = attrs.price;
//     if (attrs.description !== undefined) product.description = attrs.description;
//     if (attrs.image !== undefined) product.image = attrs.image;
//     if (attrs.brand !== undefined) product.brand = attrs.brand;
//     if (attrs.category !== undefined) product.category = attrs.category;
//     if (attrs.countInStock !== undefined) product.countInStock = attrs.countInStock;

//     const updatedProduct = await product.save();

//     return updatedProduct;
//   }

//   async createReview(
//     id: string,
//     user: Pick<UserDocument, '_id' | 'name'>,
//     rating: number,
//     comment: string
//   ): Promise<ProductDocument> {
//     if (!Types.ObjectId.isValid(id))
//       throw new BadRequestException('Invalid product ID.');

//     const product = await this.productModel.findById(id);

//     if (!product) throw new NotFoundException('No product with given ID.');

//     // Check if user already reviewed
//     const alreadyReviewed = product.reviews.find(
//       r => r.user.toString() === user._id.toString()
//     );

//     if (alreadyReviewed)
//       throw new BadRequestException('Product already reviewed!');

//     const review: Review = {
//       name: user.name,
//       rating,
//       comment,
//       user:pick<UserDocument, '_id'>, // user reference as ObjectId
//     };

//     //product.reviews.push(review);

//     // Recalculate rating
//     product.rating =
//       product.reviews.reduce((acc, item) => item.rating + acc, 0) /
//       product.reviews.length;

//     product.numReviews = product.reviews.length;

//     const updatedProduct = await product.save();

//     return updatedProduct;
//   }

//   async deleteOne(id: string): Promise<void> {
//     if (!Types.ObjectId.isValid(id))
//       throw new BadRequestException('Invalid product ID.');

//     const result = await this.productModel.deleteOne({ _id: id });

//     if (result.deletedCount === 0)
//       throw new NotFoundException('No product with given ID.');
//   }

//   async deleteMany(): Promise<void> {
//     await this.productModel.deleteMany({});
//   }
// }

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PaginatedProducts } from 'src/interfaces';
import { UserDocument } from 'src/users/schemas/user.schema';
import { sampleProduct } from '../../utils/data/product';
import { Product, ProductDocument, Review } from '../schemas/product.schema';
import { pick } from 'lodash';

@Injectable()
export class ProductsService {
  constructor(
    // Inject the Product model from Mongoose to interact with the product collection
    @InjectModel(Product.name) private productModel: Model<ProductDocument>
  ) {}

  // Find top 3 rated products sorted by rating descending
  async findTopRated(): Promise<ProductDocument[]> {
    const products = await this.productModel
      .find({})
      .sort({ rating: -1 }) // sort by rating descending
      .limit(3); // limit to top 3

    if (!products.length) throw new NotFoundException('No products found.');

    return products;
  }

  // Find products with optional search keyword and pagination
  async findMany(
    keyword?: string,
    pageId?: string
  ): Promise<PaginatedProducts> {
    const pageSize = 8; // items per page
    const page = parseInt(pageId) || 1; // current page number

    // Build regex filter for keyword search on product name, case-insensitive
    const regex = keyword ? { name: { $regex: keyword, $options: 'i' } } : {};

    // Count total matching documents for pagination
    const count = await this.productModel.countDocuments({ ...regex });

    // Find matching products with limit and skip for pagination
    const products = await this.productModel
      .find({ ...regex })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    if (!products.length) throw new NotFoundException('No products found.');

    return { products, page, pages: Math.ceil(count / pageSize) };
  }

  // Find a single product by its ID
  async findById(id: string): Promise<ProductDocument> {
    // Validate the ID is a valid Mongo ObjectId
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid product ID.');

    // Find product by ID
    const product = await this.productModel.findById(id);

    if (!product) throw new NotFoundException('No product with given ID.');

    return product;
  }

  // Get all unique categories from products
  async getCategories(): Promise<string[]> {
    const categories = await this.productModel.distinct('category');
    
    // Filter out null/undefined values and ensure we have categories
    const validCategories = categories.filter(category => category != null);
    
    if (!validCategories.length) {
      throw new NotFoundException('No categories found.');
    }

    return validCategories;
  }

  // Create multiple products at once
  async createMany(products: Partial<ProductDocument>[]): Promise<ProductDocument[]> {
    // Insert many products to database
    const createdProducts = await this.productModel.insertMany(products);

    return createdProducts as ProductDocument[];
  }
  
  // Create a sample product (for testing or seeding)
  async createSample(): Promise<ProductDocument> {
    const createdProduct = await this.productModel.create(sampleProduct);

    return createdProduct;
  }

  // Update an existing product by ID with partial attributes
  async update(
    id: string,
    attrs: Partial<ProductDocument>
  ): Promise<ProductDocument> {
    // Validate product ID
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid product ID.');

    // Find the product to update
    const product = await this.productModel.findById(id);

    if (!product) throw new NotFoundException('No product with given ID.');

    // Update fields only if they are defined in attrs
    if (attrs.name !== undefined) product.name = attrs.name;
    if (attrs.price !== undefined) product.price = attrs.price;
    if (attrs.description !== undefined) product.description = attrs.description;
    if (attrs.image !== undefined) product.image = attrs.image;
    if (attrs.brand !== undefined) product.brand = attrs.brand;
    if (attrs.category !== undefined) product.category = attrs.category;
    if (attrs.countInStock !== undefined) product.countInStock = attrs.countInStock;

    // Save updated product to database
    const updatedProduct = await product.save();

    return updatedProduct;
  }

  // Create a new review for a product
  async createReview(
    id: string,
    user: Pick<UserDocument, '_id' | 'name'>,
    rating: number,
    comment: string
  ): Promise<ProductDocument> {
    // Validate product ID
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid product ID.');

    // Find product by ID
    const product = await this.productModel.findById(id);

    if (!product) throw new NotFoundException('No product with given ID.');

    // Check if user already submitted a review for this product
    const alreadyReviewed = product.reviews.find(
      r => r.user.toString() === user._id.toString()
    );

    if (alreadyReviewed)
      throw new BadRequestException('Product already reviewed!');

    // Create a new review object
    const review: Review = {
      name: user.name,
      rating,
      comment,
      user: pick<UserDocument, '_id'>(user, '_id'), // user reference as ObjectId
    };

    // NOTE: the line that pushes the review is commented out:
    // product.reviews.push(review);

    // Recalculate product rating based on all reviews
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    // Update number of reviews
    product.numReviews = product.reviews.length;

    // Save updated product
    const updatedProduct = await product.save();

    return updatedProduct;
  }

  // Delete a single product by ID
  async deleteOne(id: string): Promise<void> {
    // Validate product ID
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid product ID.');

    // Delete product by ID
    const result = await this.productModel.deleteOne({ _id: id });

    // If no document deleted, throw not found exception
    if (result.deletedCount === 0)
      throw new NotFoundException('No product with given ID.');
  }

  // Delete all products (use with caution)
  async deleteMany(): Promise<void> {
    await this.productModel.deleteMany({});
  }
}