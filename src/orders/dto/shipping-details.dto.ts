// src/orders/dto/shipping-details.dto.ts

import { IsString, IsNotEmpty } from 'class-validator';

export class ShippingDetailsDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}
