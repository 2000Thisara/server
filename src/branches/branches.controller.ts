import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BranchesService } from './branches.service';
import { BranchesDto } from './branches.dto';
import { BranchesDocument } from './branches.schema';
import { AdminGuard } from '../guards/admin.guard';

@Controller('branches')
export class BranchesController {
  constructor(private readonly BranchesService: BranchesService) {}

  @Post()
  async create(@Body() BranchesDto: BranchesDto): Promise<BranchesDocument> {
    try {
      return await this.BranchesService.create(BranchesDto);
    } catch (error) {
      if (
        error?.status === 413 ||
        error?.message?.includes('Payload Too Large')
      ) {
        throw new HttpException(
          'Image size too large. Please upload a smaller file.',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Failed to create branch.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll(): Promise<BranchesDocument[]> {
    return this.BranchesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BranchesDocument> {
    return this.BranchesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() BranchesDto: BranchesDto,
  ): Promise<BranchesDocument> {
    try {
      return await this.BranchesService.update(id, BranchesDto);
    } catch (error) {
      if (
        error?.status === 413 ||
        error?.message?.includes('Payload Too Large')
      ) {
        throw new HttpException(
          'Image size too large. Please upload a smaller file.',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Failed to update branch.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    try {
      await this.BranchesService.remove(id);
      return { message: 'Branch deleted successfully' };
    } catch (error) {
      throw new HttpException(
        'Failed to delete branch.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
