import { BadRequestException, Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/services/cloudinary.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AppService {
  constructor(private cloudinary: CloudinaryService) {}

  
  async uploadImageToCloudinary(file: Express.Multer.File) {
    return await this.cloudinary.uploadImage(file).catch(err => {
      throw new BadRequestException('Invalid file type.');
    });
  }

  async uploadLogoToCloudinary(file: Express.Multer.File) {
    return await this.cloudinary.uploadImage(file).catch(err => {
      throw new BadRequestException('Invalid file type.');
    });
  }
}
