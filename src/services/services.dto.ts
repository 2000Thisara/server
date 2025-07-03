import { IsString } from 'class-validator';

export class ServicesDto {
  @IsString()
  title: string;

  @IsString()
  description?: string;

    @IsString()
    image: string;
}