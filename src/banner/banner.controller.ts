import { Get, Param, Body, Controller, Post, Put, Delete } from '@nestjs/common';
import { BannerService } from './banner.service';
import { Banner } from './banner.schema';

@Controller('banner')
export class BannerController {
    constructor(private readonly bannerService: BannerService) {}

    @Get()
    async getAllBanners() {
    return this.bannerService.fetchBanner();
  }

  @Get('enabled')
  async getEnabledBanners() {
    return this.bannerService.fetchEnableBanner();
  }

  @Post()
  async createHeader(@Body() bannerData: Partial<Banner>) {
    return this.bannerService.createBanner(bannerData);
  }

  @Put(':id')
  async updateHeader(@Param('id') id: string, @Body() bannerData: Partial<Banner>) {
    return this.bannerService.updateBanner(id, bannerData);
  }

  @Delete(':id')
  async deleteHeader(@Param('id') id: string) {
    return this.bannerService.deleteBanner(id);
  }
}
