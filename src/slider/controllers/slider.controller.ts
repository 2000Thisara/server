import { Controller, Post, Get, Body, Put, Delete, Param, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { SliderService } from '../services/slider.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { use } from 'passport';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('slider')
export class SliderController {
  constructor(private readonly sliderService: SliderService) {}

  @UseGuards(AdminGuard)
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

  @UseGuards(AdminGuard)
  @Put(':id')
  async updateSliderItem(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string; image?: string },
  ) {
    const updated = await this.sliderService.updateSliderItem(id, body);
    return { message: 'Slider updated successfully', slider: updated };
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  async deleteSliderItem(@Param('id') id: string) {
    await this.sliderService.deleteSliderItem(id);
    return { message: 'Slider deleted successfully' };
  }



  @Get()
  async getAllSliders() {
    return this.sliderService.fetchSliders();
  }
}
