import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { PaymentResult } from 'src/interfaces';
import { Order, OrderDocument } from '../schemas/order.schema';
import Stripe from 'stripe';
import {Product, ProductDocument} from 'src/products/schemas/product.schema'; 

@Injectable()
export class OrdersService {
  private stripe: Stripe;
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-06-30.basil', // or your Stripe API version
    });
}

  async create(
    orderAttrs: Partial<OrderDocument>,
    userId: string,
    userName: string
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
      userName: userName,
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

 async createOrderFromStripeSession(sessionId: string, userId: string): Promise<OrderDocument> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items', 'customer_details', 'payment_intent'],
      });

      if (!session) throw new NotFoundException('Stripe session not found');

      const lineItems = session.line_items?.data ?? [];
      if (lineItems.length === 0) {
        throw new BadRequestException('No line items found in Stripe session');
      }

      // Fetch all products from DB to map names to IDs
      const allProducts = await this.productModel.find().exec();

      const orderItems = lineItems.map((item) => {
        const productName = item.description || 'Unknown Product';

        // Find matching product in DB by name
        const matchedProduct = allProducts.find(
          (p) => p.name === productName
        );

        if (!matchedProduct) {
          throw new BadRequestException(`Product not found in DB: ${productName}`);
        }

        return {
          name: productName,
          qty: item.quantity ?? 1,
          price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
          productId: matchedProduct._id,
          image: matchedProduct.image || 'https://example.com/default-image.png', // adjust as needed
        };
      });

      const shippingDetails = session.customer_details?.address
        ? {
            address: session.customer_details.address.line1 || 'N/A',
            city: session.customer_details.address.city || 'N/A',
            postalCode: session.customer_details.address.postal_code || '00000',
            country: session.customer_details.address.country || 'N/A',
          }
        : {
            address: 'N/A',
            city: 'N/A',
            postalCode: '00000',
            country: 'N/A',
          };

      const createdOrder = await this.orderModel.create({
        user: new mongoose.Types.ObjectId(userId),
        userName: session.customer_details?.name || 'Stripe Customer',
        orderItems,
        shippingDetails,
        paymentMethod: session.payment_method_types?.[0] || 'card',
        itemsPrice: session.amount_subtotal ? session.amount_subtotal / 100 : 0,
        shippingPrice: session.shipping_cost?.amount_total
          ? session.shipping_cost.amount_total / 100
          : 0,
        totalPrice: session.amount_total ? session.amount_total / 100 : 0,
        taxPrice: 0,
        status: 'Order Confirmed',
        isPaid: session.payment_status === 'paid',
        paidAt: session.payment_status === 'paid' ? new Date() : null,
        paymentResult: {
          id: typeof session.payment_intent === 'object' && session.payment_intent !== null
            ? session.payment_intent.id
            : (typeof session.payment_intent === 'string' ? session.payment_intent : ''),
          status: session.payment_status,
          update_time: new Date().toISOString(),
          email_address: session.customer_details?.email || '',
        },
      });

      return createdOrder;
    } catch (error) {
      console.error('Error creating order from Stripe session:', error);
      throw new InternalServerErrorException('Failed to create order from Stripe session');
    }
  }
}

