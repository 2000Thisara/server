import { Controller, Post, Get, Body, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { HeaderService } from '../services/header.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('header')
export class HeaderController {
  constructor(private readonly headerService: HeaderService) {}
  
  @Post('upload')
  async updateHeader(
    @Body() body: { name: string; color: string; description: string; image: string; items?: string[] }// Now, image is just a string
  ) {
    const header = await this.headerService.updateHeader({
      name: body.name,
      color: body.color,
      image: body.image,
      items: body.items || []
    });
    
    return { message: 'Header Updated Successfully', header };
  }

  @Get()
  async getAllHeaders() {
    return this.headerService.fetchHeader();
  }
}
