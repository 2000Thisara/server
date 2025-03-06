import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FooterDocument = Footer & Document;

@Schema({ timestamps: true })
export class Footer {
  @Prop({ required: true })
  contactNumber: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  aboutUs: string;

  @Prop({ required: true })
  fbLink: string;

  @Prop({ required: true })
  whatsappLink: string;

  @Prop({ required: true })
  instaLink: string;

  @Prop({ required: true })
  ytLink: string;

  @Prop({ required: true })
  ttLink: string;
  
}

export const FooterSchema = SchemaFactory.createForClass(Footer);
