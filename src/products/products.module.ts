// import { Module } from '@nestjs/common';
// import { ProductsService } from './services/products.service';
// import { ProductsController } from './controller/products.controller';
// import { MongooseModule } from '@nestjs/mongoose';
// import { Product, ProductSchema } from './schemas/product.schema';

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       {
//         name: Product.name,
//         schema: ProductSchema,
//       },
//     ]),
//   ],
//   providers: [ProductsService],
//   controllers: [ProductsController],
// })
// export class ProductsModule {}

import { Module } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controller/products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { Category, CategorySchema } from 'src/category/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}