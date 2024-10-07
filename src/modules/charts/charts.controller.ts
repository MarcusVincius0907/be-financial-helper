import { Controller, Get, Param } from '@nestjs/common';
import { TransactionService } from '../transaction/transaction.service';
import { CategoryService } from '../category/category.service';
import {
  filterByDateRange,
  generateDashboardData,
} from 'src/utils/utils';

@Controller('charts')
export class ChartsController {
  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService,
  ) {}

  //TODO: save object in cache
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
      const payload = generateDashboardData(filteredTransactions, categories);
      return { status: 'success', data: payload };
    } catch (err) {
      return { status: 'error', data: err };
    }
  }

  
}
