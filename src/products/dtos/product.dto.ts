import { IsString, IsNumber } from 'class-validator';

export class ProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  description: string;

  @IsString()
  image: string;

  @IsString()
  brand: string;

  @IsString()
  category: string; // Category ID as string (ObjectId)

  @IsNumber()
  countInStock: number;
}