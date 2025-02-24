import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Slider, SliderDocument } from '../schemas/slider.schema';

@Injectable()
export class SliderService {
  constructor(
    @InjectModel(Slider.name) private sliderModel: Model<SliderDocument>,
  ) {}

  async uploadSliderItem(data: { name: string; description: string; image: string }) {
    const newSlider = new this.sliderModel(data);
    return await newSlider.save();
  }

  async fetchSliders() {
    return await this.sliderModel.find();
  }
}
