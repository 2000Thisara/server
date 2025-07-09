import { IsString } from 'class-validator';
import { Url } from 'url';

export class BranchesDto {
  @IsString()
  city: string;

  @IsString()
  image: string;

  @IsString()
  contact: string;
  
  @IsString()
  openAt: string;

  @IsString()
  closeAt: string;

  @IsString()
  location: string;
  
  }