// src/orders/dto/order-item.dto.ts

import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  qty: number;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  productId: string;
}
