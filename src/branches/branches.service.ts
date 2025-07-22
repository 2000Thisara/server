import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Branches, BranchesDocument } from './branches.schema';
import { BranchesDto } from './branches.dto';

@Injectable()
export class BranchesService {
  constructor(
    @InjectModel(Branches.name)
    private BranchesModel: Model<BranchesDocument>
  ) {}

  async create(BranchesDto: BranchesDto): Promise<BranchesDocument> {
    const branch = new this.BranchesModel(BranchesDto);
    return branch.save();
  }

  async findAll(): Promise<BranchesDocument[]> {
    return this.BranchesModel.find().exec();
  }

  async findOne(id: string): Promise<BranchesDocument> {
    return this.BranchesModel.findById(id).exec();
  }

  async update(id: string, BranchesDto: BranchesDto): Promise<BranchesDocument> {
    return this.BranchesModel.findByIdAndUpdate(id, BranchesDto, { new: true });
  }

  async remove(id: string): Promise<void> {
    await this.BranchesModel.findByIdAndDelete(id);
  }
}
