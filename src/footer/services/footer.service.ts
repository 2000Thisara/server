import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Footer, FooterDocument } from '../schemas/footer.schema';

@Injectable()
export class FooterService {
  constructor(
    @InjectModel(Footer.name) private footerModel: Model<FooterDocument>,
  ) {}

  async updateFooter(data: { name: string; description: string; image: string }) {
    // Find the existing footer document
    const existingFooter = await this.footerModel.findById("67be06d948daefa59a81ac83");
  
    if (!existingFooter) {
      throw new Error("Footer not found");
    }
  
    // Update the existing footer with new data
    existingFooter.name = data.name;
    existingFooter.description = data.description;
    existingFooter.image = data.image;
  
    return await existingFooter.save(); // Save the changes
  }
  

  async fetchFooter() {
    return await this.footerModel.find();
  }
}
