import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type privacyPolicyDocument = privacyPolicy & Document;

@Schema({ timestamps: true })
export class privacyPolicy{
  @Prop({ required: true})
  title: string;

  @Prop()
  description: string;

}

export const privacyPolicySchema = SchemaFactory.createForClass(privacyPolicy);