import { IsString, IsNumber, Min, Max, IsNotEmpty } from 'class-validator';

export class ReviewDto {
  @IsNumber({}, { message: 'Rating must be a number' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must not exceed 5' })
  @IsNotEmpty({ message: 'Rating is required' })
  rating: number;

  @IsString({ message: 'Comment must be a string' })
  @IsNotEmpty({ message: 'Comment cannot be empty' })
  comment: string;
}