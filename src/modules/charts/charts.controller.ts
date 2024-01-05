import { Controller, Get, Param } from '@nestjs/common';
import { TransactionService } from '../transaction/transaction.service';
import { CategoryService } from '../category/category.service';
import {
  filterByDateRange,
  groupByTransactionsWithCategories,
} from 'src/utils/utils';

@Controller('charts')
export class ChartsController {
  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService,
  ) {}

  @Get('transactions/:fromDate/:toDate')
  async getChartTransactions(
    @Param('fromDate') fromDate: string,
    @Param('toDate') toDate: string,
  ) {
    try {
      const transacions = await this.transactionService.getAll();
      const filteredTransactions = filterByDateRange(
        transacions,
        fromDate,
        toDate,
      );
      const categories = await this.categoryService.getAll();
      const labels = categories.map((category) => category.text);
      labels.push('default');
      const series = groupByTransactionsWithCategories(
        filteredTransactions,
        categories,
      );
      const payload = {
        labels,
        series,
      };
      return { status: 'success', data: payload };
    } catch (err) {
      return { status: 'error', data: err };
    }
  }
}
