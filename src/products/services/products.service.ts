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
// import { Product, ProductDocument } from '../schemas/product.schema';

// // Define Review interface to match schema expectations
// interface Review {
//   name: string;
//   rating: number;
//   comment: string;
//   user: Types.ObjectId; // Matches schema: ObjectId with ref to User
// }

// @Injectable()
// export class ProductsService {
//   constructor(
//     @InjectModel(Product.name) private productModel: Model<ProductDocument>,
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
//     pageId?: string,
//   ): Promise<PaginatedProducts> {
//     const pageSize = 8;
//     const page = parseInt(pageId) || 1;

//     const rgex = keyword ? { name: { $regex: keyword, $options: 'i' } } : {};

//     const count = await this.productModel.countDocuments({ ...rgex });
//     const products = await this.productModel
//       .find({ ...rgex })
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

//   async createMany(
//     products: Partial<ProductDocument>[],
//   ): Promise<ProductDocument[]> {
//     const createdProducts = await this.productModel.insertMany(products);
//     return createdProducts as ProductDocument[]; // Type assertion for Mongoose
//   }

//   async createSample(): Promise<ProductDocument> {
//     const createdProduct = await this.productModel.create(sampleProduct);

//     return createdProduct;
//   }

//   async update(
//     id: string,
//     attrs: Partial<ProductDocument>,
//   ): Promise<ProductDocument> {
//     const { name, price, description, image, brand, category, countInStock } =
//       attrs;

//     if (!Types.ObjectId.isValid(id))
//       throw new BadRequestException('Invalid product ID.');

//     const product = await this.productModel.findById(id);

//     if (!product) throw new NotFoundException('No product with given ID.');

//     product.name = name || product.name; // Allow partial updates
//     product.price = price ?? product.price; // Use nullish coalescing for defaults
//     product.description = description || product.description;
//     product.image = image || product.image;
//     product.brand = brand || product.brand;
//     product.category = category || product.category;
//     product.countInStock = countInStock ?? product.countInStock;

//     const updatedProduct = await product.save();

//     return updatedProduct;
//   }

//   async createReview(
//     id: string,
//     user: Partial<UserDocument>,
//     rating: number,
//     comment: string,
//   ): Promise<ProductDocument> {
//     if (!Types.ObjectId.isValid(id))
//       throw new BadRequestException('Invalid product ID.');

//     const product = await this.productModel.findById(id);

//     if (!product) throw new NotFoundException('No product with given ID.');

//     const alreadyReviewed = product.reviews.find(
//       (r) => r.user.toString() === user._id.toString(),
//     );

//     if (alreadyReviewed)
//       throw new BadRequestException('Product already reviewed!');

//     const review: Review = {
//       name: user.name,
//       rating,
//       comment,
//       user: user._id as Types.ObjectId, // Cast to ObjectId, matches schema
//     };

//     product.reviews.push(review);

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

//     const product = await this.productModel.findById(id);

//     if (!product) throw new NotFoundException('No product with given ID.');

//     await product.deleteOne();
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
import { Product, ProductDocument } from '../schemas/product.schema';

interface Review {
  name: string;
  rating: number;
  comment: string;
  user: Types.ObjectId;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findByCategory(categoryId: string, pageId?: string): Promise<PaginatedProducts> {
    if (!Types.ObjectId.isValid(categoryId))
      throw new BadRequestException('Invalid category ID.');

    const pageSize = 8;
    const page = parseInt(pageId) || 1;

    const count = await this.productModel.countDocuments({ category: categoryId });
    const products = await this.productModel
      .find({ category: categoryId })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .populate('category', 'name');

    if (!products.length) throw new NotFoundException('No products found in this category.');

    return { products, page, pages: Math.ceil(count / pageSize) };
  }

  async findLatest(pageId?: string): Promise<PaginatedProducts> {
    const pageSize = 8;
    const page = parseInt(pageId) || 1;

    const count = await this.productModel.countDocuments({});
    const products = await this.productModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .populate('category', 'name');

    if (!products.length) throw new NotFoundException('No products found.');

    return { products, page, pages: Math.ceil(count / pageSize) };
  }

  async findTopRated(pageId?: string): Promise<PaginatedProducts> {
    const pageSize = 8;
    const page = parseInt(pageId) || 1;

    const count = await this.productModel.countDocuments({});
    const products = await this.productModel
      .find({})
      .sort({ rating: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .populate('category', 'name');

    if (!products.length) throw new NotFoundException('No products found.');

    return { products, page, pages: Math.ceil(count / pageSize) };
  }

  async findMostPopular(pageId?: string): Promise<PaginatedProducts> {
    const pageSize = 8;
    const page = parseInt(pageId) || 1;

    const count = await this.productModel.countDocuments({});
    const products = await this.productModel
      .find({})
      .sort({ viewCount: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .populate('category', 'name');

    if (!products.length) throw new NotFoundException('No products found.');

    return { products, page, pages: Math.ceil(count / pageSize) };
  }

  async findMany(
    keyword?: string,
    pageId?: string,
  ): Promise<PaginatedProducts> {
    const pageSize = 8;
    const page = parseInt(pageId) || 1;

    const rgex = keyword ? { name: { $regex: keyword, $options: 'i' } } : {};

    const count = await this.productModel.countDocuments({ ...rgex });
    const products = await this.productModel
      .find({ ...rgex })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .populate('category', 'name');

    if (!products.length) throw new NotFoundException('No products found.');

    return { products, page, pages: Math.ceil(count / pageSize) };
  }

  async findById(id: string): Promise<ProductDocument> {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid product ID.');

    const product = await this.productModel
      .findById(id)
      .populate('category', 'name');

    if (!product) throw new NotFoundException('No product with given ID.');

    product.viewCount += 1;
    await product.save();

    return product;
  }

  async createMany(
    products: Partial<ProductDocument>[],
  ): Promise<ProductDocument[]> {
    const createdProducts = await this.productModel.insertMany(products);
    return createdProducts as ProductDocument[];
  }

  async createSample(): Promise<ProductDocument> {
    console.log('Creating sample product...');
    const createdProduct = await this.productModel.create(sampleProduct);
    return createdProduct;
  }

  async update(
    id: string,
    attrs: Partial<ProductDocument>,
  ): Promise<ProductDocument> {
    const { name, price, description, image, brand, category, countInStock } =
      attrs;

    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid product ID.');

    if (category && !Types.ObjectId.isValid(category))
      throw new BadRequestException('Invalid category ID.');

    const product = await this.productModel.findById(id);

    if (!product) throw new NotFoundException('No product with given ID.');

    product.name = name || product.name;
    product.price = price ?? product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock = countInStock ?? product.countInStock;

    const updatedProduct = await product.save();
    return updatedProduct.populate('category', 'name');
  }

  async createReview(
    id: string,
    user: Partial<UserDocument>,
    rating: number,
    comment: string,
  ): Promise<ProductDocument> {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid product ID.');

    const product = await this.productModel.findById(id);

    if (!product) throw new NotFoundException('No product with given ID.');

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === user._id.toString(),
    );

    if (alreadyReviewed)
      throw new BadRequestException('Product already reviewed!');

    const review: Review = {
      name: user.name,
      rating,
      comment,
      user: user._id as Types.ObjectId,
    };

    product.reviews.push(review);

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    product.numReviews = product.reviews.length;

    const updatedProduct = await product.save();
    return updatedProduct.populate('category', 'name');
  }

  async deleteOne(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid product ID.');

    const product = await this.productModel.findById(id);

    if (!product) throw new NotFoundException('No product with given ID.');

    await product.deleteOne();
  }

  async deleteMany(): Promise<void> {
    await this.productModel.deleteMany({});
  }
}