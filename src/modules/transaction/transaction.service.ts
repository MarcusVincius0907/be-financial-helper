import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction as ClassSchema } from '../database/schemas/transaction.schema';
import { Model } from 'mongoose';
import { Transaction } from 'src/models/transaction.model';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(ClassSchema.name)
    private readonly model: Model<Transaction>,
  ) {}

  async getAll() {
    try {
      return await this.model.find().exec();
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async create(data: Transaction) {
    try {
      const createdData = new this.model(data);
      return await createdData.save();
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async update(id: string, data: Transaction) {
    try {
      return await this.model.findByIdAndUpdate(id, data).exec();
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async delete(id: string) {
    try {
      return await this.model.deleteOne({ _id: id }).exec();
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
