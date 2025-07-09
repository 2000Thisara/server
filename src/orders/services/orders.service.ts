import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PaymentResult } from 'src/interfaces';
import { Order, OrderDocument } from '../schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>
  ) {}

  async create(
    orderAttrs: Partial<OrderDocument>,
    userId: string
  ): Promise<OrderDocument> {
    const {
      orderItems,
      shippingDetails,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = orderAttrs;

    if (orderItems && orderItems.length < 1)
      throw new BadRequestException('No order items received.');

    const createdOrder = await this.orderModel.create({
      user: userId,
      orderItems,
      shippingDetails,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      status: 'Order Confirmed', // Initialize default status on create
    });

    return createdOrder;
  }

  async findAll(): Promise<OrderDocument[]> {
    const orders = await this.orderModel.find();

    return orders;
  }

  async findById(id: string): Promise<OrderDocument> {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid order ID.');

    const order = await this.orderModel
      .findById(id)
      .populate('user', 'name email');

    if (!order) throw new NotFoundException('No order with given ID.');

    return order;
  }

  async updatePaid(
    id: string,
    paymentResult: PaymentResult
  ): Promise<OrderDocument> {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid order ID.');

    const order = await this.orderModel.findById(id);

    if (!order) throw new NotFoundException('No order with given ID.');

    order.isPaid = true;
    order.paidAt = Date();
    order.paymentResult = paymentResult;

    const updatedOrder = await order.save();

    return updatedOrder;
  }

  async updateDelivered(id: string): Promise<OrderDocument> {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid order ID.');

    const order = await this.orderModel.findById(id);

    if (!order) throw new NotFoundException('No order with given ID.');

    order.isDelivered = true;
    order.deliveredAt = Date();

    const updatedOrder = await order.save();

    return updatedOrder;
  }

  async findUserOrders(userId: string): Promise<OrderDocument[]> {
    if (!Types.ObjectId.isValid(userId))
      throw new BadRequestException('Invalid user ID.');

    const orders = await this.orderModel
      .find({ user: userId })
      .sort({ createdAt: -1 });

    return orders;
  }

  // NEW METHOD: Update the order status string field
  async updateStatus(id: string, status: string): Promise<OrderDocument> {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid order ID.');
    }

    const validStatuses = [
      'Order Confirmed',
      'Processing',
      'Shipped',
      'Delivered',
    ];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid order status.');
    }

    const update: Partial<OrderDocument> = { status };

    // If Delivered, set additional fields
    if (status === 'Delivered') {
      update['isDelivered'] = true;
      update['deliveredAt'] = new Date().toISOString();
    }

    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      throw new NotFoundException('No order with the given ID.');
    }

    return updatedOrder;
  } catch (error) {
    console.error('UpdateStatus Error:', error);

    if (error.name === 'ValidationError') {
      throw new BadRequestException(
        `Validation failed: ${error.message}`,
      );
    }

    throw new InternalServerErrorException(
      'Could not update order status. Please try again later.',
    );
  }
}

}
