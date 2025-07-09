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
import { ServicesService } from './services.service';
import { ServicesDto } from './services.dto';
import { ServicesDocument } from './services.schema';
import { AdminGuard } from '../guards/admin.guard';

@Controller('services')
export class ServicesController {
  constructor(private readonly ServicesService: ServicesService) {}

  //@UseGuards(AdminGuard)
  @Post()
  async create(@Body() ServicesDto: ServicesDto): Promise<ServicesDocument> {
    return this.ServicesService.create(ServicesDto);
  }

  @Get()
  async findAll(): Promise<ServicesDocument[]> {
    return this.ServicesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ServicesDocument> {
    return this.ServicesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() ServicesDto: ServicesDto
  ): Promise<ServicesDocument> {
    return this.ServicesService.update(id, ServicesDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.ServicesService.remove(id);
    return { message: 'Service deleted successfully' };
  }


}
