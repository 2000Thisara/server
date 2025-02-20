import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SliderController } from './controllers/slider.controller';
import { SliderService } from './services/slider.service';
import { Slider, SliderSchema } from './schemas/slider.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Slider.name, schema: SliderSchema }])],
  controllers: [SliderController],
  providers: [SliderService],
})
export class SliderModule {}
