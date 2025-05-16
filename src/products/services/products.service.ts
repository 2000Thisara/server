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

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>
  ) {}

  async findTopRated(): Promise<ProductDocument[]> {
    const products = await this.productModel
      .find({})
      .sort({ rating: -1 })
      .limit(3);

    if (!products.length) throw new NotFoundException('No products found.');

    return products;
  }

  async findMany(
    keyword?: string,
    pageId?: string
  ): Promise<PaginatedProducts> {
    const pageSize = 8;
    const page = parseInt(pageId) || 1;

    const regex = keyword ? { name: { $regex: keyword, $options: 'i' } } : {};

    const count = await this.productModel.countDocuments({ ...regex });
    const products = await this.productModel
      .find({ ...regex })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    if (!products.length) throw new NotFoundException('No products found.');

    return { products, page, pages: Math.ceil(count / pageSize) };
  }

  async findById(id: string): Promise<ProductDocument> {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid product ID.');

    const product = await this.productModel.findById(id);

    if (!product) throw new NotFoundException('No product with given ID.');

    return product;
  }

  async createMany(
    products: Partial<ProductDocument>[]
  ): Promise<ProductDocument[]> {
    const createdProducts = await this.productModel.insertMany(products);

    return createdProducts as ProductDocument[];
  }

  async createSample(): Promise<ProductDocument> {
    const createdProduct = await this.productModel.create(sampleProduct);

    return createdProduct;
  }

  async update(
    id: string,
    attrs: Partial<ProductDocument>
  ): Promise<ProductDocument> {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid product ID.');

    const product = await this.productModel.findById(id);

    if (!product) throw new NotFoundException('No product with given ID.');

    // Update only if attrs are defined
    if (attrs.name !== undefined) product.name = attrs.name;
    if (attrs.price !== undefined) product.price = attrs.price;
    if (attrs.description !== undefined) product.description = attrs.description;
    if (attrs.image !== undefined) product.image = attrs.image;
    if (attrs.brand !== undefined) product.brand = attrs.brand;
    if (attrs.category !== undefined) product.category = attrs.category;
    if (attrs.countInStock !== undefined) product.countInStock = attrs.countInStock;

    const updatedProduct = await product.save();

    return updatedProduct;
  }

  async createReview(
    id: string,
    user: UserDocument,
    rating: number,
    comment: string
  ): Promise<ProductDocument> {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid product ID.');

    const product = await this.productModel.findById(id);

    if (!product) throw new NotFoundException('No product with given ID.');

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      r => r.user.toString() === user._id.toString()
    );

    if (alreadyReviewed)
      throw new BadRequestException('Product already reviewed!');

    const review: Review = {
      name: user.name,
      rating,
      comment,
      user, // user reference as ObjectId
    };

    product.reviews.push(review);

    // Recalculate rating
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    product.numReviews = product.reviews.length;

    const updatedProduct = await product.save();

    return updatedProduct;
  }

  async deleteOne(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid product ID.');

    const result = await this.productModel.deleteOne({ _id: id });

    if (result.deletedCount === 0)
      throw new NotFoundException('No product with given ID.');
  }

  async deleteMany(): Promise<void> {
    await this.productModel.deleteMany({});
  }
}
