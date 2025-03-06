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
    @Body() body: { contactNumber: string; email: string; aboutUs: string; fbLink: string; whatsappLink: string; instaLink: string; ytLink: string; ttLink: string;  } // Now, image is just a string
  ) {
    const footer = await this.footerService.updateFooter({
      contactNumber: body.contactNumber,
      email: body.email,
      aboutUs: body.aboutUs,
      fbLink: body.fbLink,
      whatsappLink: body.whatsappLink,
      instaLink: body.instaLink,
      ytLink: body.ytLink,
      ttLink: body.ttLink, 
    });

    return { message: 'Footer Updated Successfully', footer };
  }

  @Get()
  async getAllFooters() {
    return this.footerService.fetchFooter();
  }
}
