import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServicesDocument = Services & Document;

@Schema({ timestamps: true })
export class Services{
  @Prop({ required: true})
  title: string;

  @Prop()
  description: string;

  @Prop()
    image: string;
}

export const ServicesSchema = SchemaFactory.createForClass(Services);