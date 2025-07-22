import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SliderDocument = Slider & Document;

@Schema({ timestamps: true })
export class Slider {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  image: string; // Store the image URL/path


  @Prop({ required: true })
  productId: string; // Reference to the product this slider is associated with
}

export const SliderSchema = SchemaFactory.createForClass(Slider);
