import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Transaction extends Document {
  @Prop({ required: true })
  externalId: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  amount: string;

  @Prop({ required: true })
  categoryId: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
