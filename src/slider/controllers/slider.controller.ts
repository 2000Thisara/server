import { Controller, Post, Get, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { SliderService } from '../services/slider.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('slider')
export class SliderController {
  constructor(private readonly sliderService: SliderService) {}

  @Post('upload')
  async uploadSliderItem(
    @Body() body: { name: string; description: string; image: string } // Now, image is just a string
  ) {
    const slider = await this.sliderService.uploadSliderItem({
      name: body.name,
      description: body.description,
      image: body.image, // Directly store the image URL
    });

    return { message: 'Slider uploaded successfully', slider };
  }

  @Get()
  async getAllSliders() {
    return this.sliderService.fetchSliders();
  }
}
