import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction as ClassSchema } from '../database/schemas/transaction.schema';
import { Model } from 'mongoose';
import { Transaction } from 'src/models/transaction.model';
import { NubankIntegrationService } from 'src/external-api/nubank-integration.service';
import { convertToISO, filterByDateRange, formatAmountValue, parseCurrency } from 'src/utils/utils';
import { GoogleSheetService } from 'src/external-api/google-sheets.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(ClassSchema.name)
    private readonly model: Model<Transaction>,
    private nubankService: NubankIntegrationService,
    private googleSheetService: GoogleSheetService
  ) { }

  async getAll(userId: string) {
    try {
      return await this.model.find({ userId }).exec();
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getFilteredByDate(userId: string, fromDate: string, toDate: string) {
    try {
      const allTransactions = await this.model.find({ userId }).exec();
      return filterByDateRange(allTransactions, fromDate, toDate);
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

  //not in use anymore
  async syncNubankTransactions(userId: string, fromDate: string, toDate: string) {
    try {
      const externalTransactions = await this.nubankService.getTransactions(
        fromDate,
        toDate,
      );
      const currentTransactions = await this.model.find().exec();

      let needToAddTransactions: Transaction[] = [];

      externalTransactions?.data?.forEach((externalTransaction) => {
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
              date: externalTransaction.time,
              amount: formatAmountValue(externalTransaction.amount),
              categoryId: 'default',
              userId
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

  async syncGoogleSheet(userId: string) {
    const sheetData = await this.googleSheetService.getSheetData();
    const needToAddTransactions: Transaction[] = [];
    
    sheetData.forEach(({ date, description, value }) => {
      needToAddTransactions.push({
        userId,
        date: convertToISO(date),
        description,
        amount: parseCurrency(value),
        categoryId: 'default',
      })
    })

    const currentTransactions = await this.model.find().exec();
    currentTransactions?.forEach((currentTransaction) => {
      needToAddTransactions.forEach((transaction, i, arr) => {
        if(
          currentTransaction.date === transaction.date &&
          currentTransaction.description === transaction.description &&
          Number(currentTransaction.amount) === transaction.amount 
        ){
          arr[i].categoryId = currentTransaction.categoryId;
        }
      })
    })

    await this.deleteAll();

    return await this.model.create(needToAddTransactions)
  }
}
