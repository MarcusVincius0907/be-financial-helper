import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Category extends Document {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  value: string;

  @Prop({ required: true })
  budget: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
