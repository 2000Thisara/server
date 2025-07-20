import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type BannerDocument = Banner & Document;

@Schema({ timestamps: true })
export class Banner {
  @Prop({ required: true })
  title: String;

  @Prop({ required: true })
  image: String; // Store the image URL/path

  @Prop()
  productId:String; // Reference to the product associated with the banner
}

export const BannerSchema = SchemaFactory.createForClass(Banner);