import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Services, ServicesDocument } from './services.schema';
import { ServicesDto } from './services.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Services.name)
    private ServicesModel: Model<ServicesDocument>
  ) {}

  async create(ServicesDto: ServicesDto): Promise<ServicesDocument> {
    const service = new this.ServicesModel(ServicesDto);
    return service.save();
  }

  async findAll(): Promise<ServicesDocument[]> {
    return this.ServicesModel.find().exec();
  }

  async findOne(id: string): Promise<ServicesDocument> {
    return this.ServicesModel.findById(id).exec();
  }

  async update(id: string, ServicesDto: ServicesDto): Promise<ServicesDocument> {
    return this.ServicesModel.findByIdAndUpdate(id, ServicesDto, { new: true });
  }

  async remove(id: string): Promise<void> {
    await this.ServicesModel.findByIdAndDelete(id);
  }
}
