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
import { privacyPolicyService } from './privacyPolicy.service';
import { privacyPolicyDto } from './privacyPolicy.dto';
import { privacyPolicyDocument } from './privacyPolicy.schema';
import { AdminGuard } from '../guards/admin.guard';

@Controller('privacyPolicy')
export class privacyPolicyController {
  constructor(private readonly privacyPolicyService: privacyPolicyService) {}

  //@UseGuards(AdminGuard)
  @Post()
  async create(@Body() privacyPolicyDto: privacyPolicyDto): Promise<privacyPolicyDocument> {
    return this.privacyPolicyService.create(privacyPolicyDto);
  }

  @Get()
  async findAll(): Promise<privacyPolicyDocument[]> {
    return this.privacyPolicyService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<privacyPolicyDocument> {
    return this.privacyPolicyService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() privacyPolicyDto: privacyPolicyDto
  ): Promise<privacyPolicyDocument> {
    return this.privacyPolicyService.update(id, privacyPolicyDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.privacyPolicyService.remove(id);
    return { message: 'Privacy & Policy deleted successfully' };
  }
}
