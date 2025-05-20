import { IsString, IsNumber, Min, Max } from 'class-validator';

// Data Transfer Object for review data validation and typing
export class ReviewDto {
  @Min(1) // Ensures rating is at least 1
  @Max(5) // Ensures rating does not exceed 5
  @IsNumber() // Validates that 'rating' is a number
  rating: number;

  @IsString() // Validates that 'comment' is a string
  comment: string;
}
