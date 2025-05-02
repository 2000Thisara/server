import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type AboutDocument = About & Document;

@Schema()
export class About {    
    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    image: string;

    @Prop()
    vision: string;

    @Prop()
    mission: string;
}

export  const AboutSchema = SchemaFactory.createForClass(About);