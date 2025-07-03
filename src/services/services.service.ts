import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Services, ServicesDocument } from './services.schema';
import { ServicesDto } from './services.dto';

@Injectable()
export class ServicesService {
  constructor(@InjectModel(Services.name) private ServicesModel: Model<ServicesDocument>) {}

  async create(ServicesDto: ServicesDto): Promise<ServicesDocument> {
    const Services = new this.ServicesModel(ServicesDto);
    return Services.save();
  }

  async findAll(): Promise<ServicesDocument[]> {
    return this.ServicesModel.find().exec();
  }

  async findOne(id: string): Promise<ServicesDocument> {
    return this.ServicesModel.findById(id).exec();
  }
}