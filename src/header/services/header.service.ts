import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Header, HeaderDocument } from '../schemas/header.schema';

@Injectable()
export class HeaderService {
  constructor(
    @InjectModel(Header.name) private headerModel: Model<HeaderDocument>,
  ) {}

  async updateHeader(data: { name: string; color: string; secondaryColor: string; ternaryColor: string; image: string; items:string[] }) {
    // Find the existing footer document
    const existingHeader = await this.headerModel.findById("67be06d948daefa59a81ac83");
  
    if (!existingHeader) {
      throw new Error("Footer not found");
    }
  
    // Update the existing footer with new data
    existingHeader.name = data.name;
    existingHeader.color = data.color;
    existingHeader.secondaryColor = data.secondaryColor;
    existingHeader.ternaryColor = data.ternaryColor;
    existingHeader.image = data.image;
    existingHeader.items = data.items;
  
    return await existingHeader.save(); // Save the changes
  }
  

  async fetchHeader() {
    return await this.headerModel.find();
  }
}
