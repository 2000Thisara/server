import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { privacyPolicy, privacyPolicyDocument } from './privacyPolicy.schema';
import { privacyPolicyDto } from './privacyPolicy.dto';

@Injectable()
export class privacyPolicyService {
  constructor(
    @InjectModel(privacyPolicy.name)
    private privacyPolicyModel: Model<privacyPolicyDocument>
  ) {}

  async create(privacyPolicyDto: privacyPolicyDto): Promise<privacyPolicyDocument> {
    const privacyPolicy = new this.privacyPolicyModel(privacyPolicyDto);
    return privacyPolicy.save();
  }

  async findAll(): Promise<privacyPolicyDocument[]> {
    return this.privacyPolicyModel.find().exec();
  }

  async findOne(id: string): Promise<privacyPolicyDocument> {
    return this.privacyPolicyModel.findById(id).exec();
  }

  async update(id: string, privacyPolicyDto: privacyPolicyDto): Promise<privacyPolicyDocument> {
    return this.privacyPolicyModel.findByIdAndUpdate(id, privacyPolicyDto, { new: true });
  }

  async remove(id: string): Promise<void> {
    await this.privacyPolicyModel.findByIdAndDelete(id);
  }
}
