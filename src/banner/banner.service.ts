import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner, BannerDocument } from './banner.schema';

@Injectable()
export class BannerService {
  constructor(
    @InjectModel(Banner.name) private bannerModel: Model<BannerDocument>,
  ) {}

    async fetchBanner(): Promise<Banner[]> {
        return this.bannerModel.find().exec();
    } 

    async fetchEnableBanner(): Promise<Banner[]> {
        return this.bannerModel.find({enable:true}).exec();
    }

    async createBanner(bannerData: Partial<Banner>): Promise<Banner> { 
        const newBanner = new this.bannerModel(bannerData);
        return newBanner.save();
    }

    async updateBanner(id: string, bannerData: Partial<Banner>): Promise<Banner> {
        const updatedBanner = await this.bannerModel.findByIdAndUpdate(id, bannerData, { new: true });
        if (!updatedBanner) {
            throw new Error('Banner not found');
        }
        return updatedBanner;
    }

    async deleteBanner(id: string): Promise<{ message: string }> {
        const result = await this.bannerModel.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            throw new Error('Banner not found');
        }
        return { message: 'Banner deleted successfully' };
    }
}
