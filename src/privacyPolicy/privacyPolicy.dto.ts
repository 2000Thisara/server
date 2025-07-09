import { IsString } from 'class-validator';

export class privacyPolicyDto {
  @IsString()
  title: string;

  @IsString()
  description?: string;

}