import { IsString, IsNumber, Min, Max } from 'class-validator';

// Data Transfer Object for review data validation and typing
export class ReviewDto {
  @Min(1) 
  @Max(5) 
  @IsNumber() 
  rating: number;

  @IsString()
  comment: string;
}
