import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HeaderDocument = Header & Document;

@Schema({ timestamps: true })
export class Header {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  color: string;

  @Prop({ type: [String], default: [] }) // optional array field
  items?: string[];

  @Prop({ required: true })
  image: string; // Store the image URL/path
}

export const HeaderSchema = SchemaFactory.createForClass(Header);
