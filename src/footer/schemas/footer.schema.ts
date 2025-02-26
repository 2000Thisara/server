import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FooterDocument = Footer & Document;

@Schema({ timestamps: true })
export class Footer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  image: string; // Store the image URL/path
}

export const FooterSchema = SchemaFactory.createForClass(Footer);
