import {
  Controller,
  Post,
  Get, // Add Get decorator
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from '../services/app.service';

@Controller('')
export class AppController {
  constructor(private appService: AppService) {}

  // Add this root route for GET /
  @Get('/')
  getRoot(): string {
    return 'Nest.js backend is running!';
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const response = await this.appService.uploadImageToCloudinary(file);
    return response.url;
  }

  @Post('uploadLogo')
  @UseInterceptors(FileInterceptor('image'))
  async uploadLogo(@UploadedFile() file: Express.Multer.File) {
    const response = await this.appService.uploadImageToCloudinary(file);
    return response.url;
  }
}