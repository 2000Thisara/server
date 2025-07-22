import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Put, 
  Delete, 
  UseGuards 
} from '@nestjs/common';
import { BranchesService } from './branches.service';
import { BranchesDto } from './branches.dto';
import { BranchesDocument } from './branches.schema';
import { AdminGuard } from '../guards/admin.guard';

@Controller('branches')
export class BranchesController {
  constructor(private readonly BranchesService: BranchesService) {}

  @UseGuards(AdminGuard)
  @Post()
  async create(@Body() BranchesDto: BranchesDto): Promise<BranchesDocument> {
    return this.BranchesService.create(BranchesDto);
  }

  @Get()
  async findAll(): Promise<BranchesDocument[]> {
    return this.BranchesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BranchesDocument> {
    return this.BranchesService.findOne(id);
  }

  @UseGuards(AdminGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() BranchesDto: BranchesDto
  ): Promise<BranchesDocument> {
    return this.BranchesService.update(id, BranchesDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.BranchesService.remove(id);
    return { message: 'Branch deleted successfully' };
  }


}
