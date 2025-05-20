import { Module } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controller/products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';

@Module({
  imports: [
    // Registers the Product schema with Mongoose to enable database operations
    MongooseModule.forFeature([
      {
        name: Product.name, // Model name
        schema: ProductSchema, // Schema definition
      },
    ]),
  ],
  providers: [ProductsService], // Service provider handling business logic for products
  controllers: [ProductsController], // Controller handling HTTP requests related to products
})
export class ProductsModule {} // Module encapsulating all product-related components
