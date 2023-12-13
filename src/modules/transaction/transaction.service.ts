import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction as ClassSchema } from '../database/schemas/transaction.schema';
import { Model } from 'mongoose';
import { Transaction } from 'src/models/transaction.model';
import { ExternalApiService } from 'src/external-api/external-api.service';
import { PluggyTransactionItem } from 'src/models/external.model';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(ClassSchema.name)
    private readonly model: Model<Transaction>,
    private externalService: ExternalApiService,
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

  async deleteAll() {
    try {
      return await this.model.deleteMany({}).exec();
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async syncTransactions() {
    try {
      const externalTransactions = await this.externalService.getTransactions();
      const currentTransactions = await this.model.find().exec();

      let needToAddTransactions: Transaction[] = [];

      externalTransactions?.data?.results.forEach((externalTransaction) => {
        let transactionNotFound = false;

        currentTransactions?.forEach((currentTransaction) => {
          if (externalTransaction.id === currentTransaction.externalId) {
            transactionNotFound = true;
          }
        });

        if (!transactionNotFound) {
          needToAddTransactions = [
            ...needToAddTransactions,
            {
              externalId: externalTransaction.id,
              description: externalTransaction.description,
              date: externalTransaction.date,
              amount: externalTransaction.amount,
              categoryId: 'default',
            },
          ];
        }
      });

      return await this.model.create(needToAddTransactions);
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}
