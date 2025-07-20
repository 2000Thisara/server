import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './controller/orders.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrdersService } from './services/orders.service';
import { Product, ProductSchema } from 'src/products/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Product.name, schema: ProductSchema },   // add this line
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrderModule {}
