import { Controller, Post, Get, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { SliderService } from '../services/slider.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('slider')
export class SliderController {
  constructor(private readonly sliderService: SliderService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async uploadSliderItem(
    @Body() body: { name: string; description: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      return { message: 'Image is required!' };
    }

    const imageUrl = `/uploads/${file.filename}`;
    const slider = await this.sliderService.uploadSliderItem({
      name: body.name,
      description: body.description,
      imageUrl,
    });

    return { message: 'Slider uploaded successfully', slider };
  }

  @Get()
  async getAllSliders() {
    return this.sliderService.getAllSliders();
  }
}
