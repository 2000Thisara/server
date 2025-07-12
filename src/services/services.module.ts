import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Services, ServicesSchema } from './services.schema';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Services.name, schema: ServicesSchema }]),
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}