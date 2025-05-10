// src/orders/dto/create-order.dto.ts

import { IsArray, IsString, IsNotEmpty, IsNumber, IsOptional,IsIn, IsStrongPassword } from 'class-validator';
import { OrderItemDto } from './order-item.dto';
import { ShippingDetailsDto } from './shipping-details.dto';

export class CreateOrderDto {
  @IsArray()
  @IsNotEmpty()
  orderItems: OrderItemDto[];

  @IsNotEmpty()
  shippingDetails: ShippingDetailsDto;

  @IsString()
  @IsNotEmpty()
  @IsIn(['Credit Card', 'Cash On Delivery', 'PayPal'])
  paymentMethod: string;

  @IsNumber()
  @IsNotEmpty()
  itemsPrice: number;

  @IsNumber()
  @IsNotEmpty()
  taxPrice: number;

  @IsNumber()
  @IsNotEmpty()
  shippingPrice: number;

  @IsNumber()
  @IsNotEmpty()
  @IsStrongPassword()
  totalPrice: number;
}
