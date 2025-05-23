import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: false })
  isAdmin: boolean;

  @Prop({ required: true, default: false })
  isVerified: boolean;

  @Prop()
  v_token: string;

  @Prop({ default: 0 })
  v_token_attempts: number;

  @Prop()
  v_token_exp: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
