import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionsService {
  private transactions = [];

  getTransactions() {
    return this.transactions;
  }

  updateTransactionCategory() {}
}
