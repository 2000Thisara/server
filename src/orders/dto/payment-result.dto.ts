// src/orders/dto/payment-result.dto.ts

import { IsString, IsNotEmpty } from 'class-validator';

export class PaymentResultDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  update_time: string;

  @IsString()
  @IsNotEmpty()
  email_address: string;
}
