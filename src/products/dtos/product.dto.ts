import { IsString, IsNumber } from 'class-validator';

// Data Transfer Object for product data validation and typing
export class ProductDto {
  @IsString() // Validates that 'name' is a string
  name: string;

  @IsNumber() // Validates that 'price' is a number
  price: number;

  @IsString() // Validates that 'description' is a string
  description: string;

  @IsString() // Validates that 'image' is a string (typically a URL or path)
  image: string;

  @IsString() // Validates that 'brand' is a string
  brand: string;

  @IsString() // Validates that 'category' is a string
  category: string;

  @IsNumber() // Validates that 'countInStock' is a number representing available stock
  countInStock: number;
}
