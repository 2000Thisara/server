import { Controller, Post, Get, Body, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FooterService } from '../services/footer.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('footer')
export class FooterController {
  constructor(private readonly footerService: FooterService) {}

  @Post('upload')
  async updateFooter(
    @Body() body: { name: string; description: string; image: string } // Now, image is just a string
  ) {
    const footer = await this.footerService.updateFooter({
      name: body.name,
      description: body.description,
      image: body.image, // Directly store the image URL
    });

    return { message: 'Footer Updated Successfully', footer };
  }

  @Get()
  async getAllFooters() {
    return this.footerService.fetchFooter();
  }
}
