import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Branches, BranchesSchema } from './branches.schema';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Branches.name, schema: BranchesSchema }]),
  ],
  controllers: [BranchesController],
  providers: [BranchesService],
})
export class BranchesModule {}