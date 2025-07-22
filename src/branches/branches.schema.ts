import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Url } from 'url';

export type BranchesDocument = Branches & Document;

@Schema({ timestamps: true })
export class Branches{
  @Prop({ required: true})
  city: string;

  @Prop({required: true})
  image: string;

  @Prop({ required: true})
  contact: string;

  @Prop({ required: true })
  openAt: string;

  @Prop({ required: true })
  closeAt: string;

  @Prop({ required: true})
  location: string;

}


export const BranchesSchema = SchemaFactory.createForClass(Branches);