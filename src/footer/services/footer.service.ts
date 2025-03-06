import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Footer, FooterDocument } from '../schemas/footer.schema';

@Injectable()
export class FooterService {
  constructor(
    @InjectModel(Footer.name) private footerModel: Model<FooterDocument>,
  ) {}

  async updateFooter(data: Partial<Footer>) {
    let footer = await this.footerModel.findOne().exec();
  
    if (!footer) {
      // If no footer exists, create a new one
      footer = new this.footerModel(data);
      return footer.save();
    }
  
    // Otherwise, update the existing footer
    return this.footerModel.findOneAndUpdate({}, data, { new: true }).exec();
  }
  
  

  async fetchFooter() {
    return await this.footerModel.find();
  }
}
