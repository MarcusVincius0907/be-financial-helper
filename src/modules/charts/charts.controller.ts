import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { TransactionService } from '../transaction/transaction.service';
import { CategoryService } from '../category/category.service';
import {
  filterByDateRange,
  generateDashboardData,
  sortByDate,
} from 'src/utils/utils';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('charts')
export class ChartsController {
  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService,
  ) {}

  //TODO: save object in cache
  @Get('transactions/:fromDate/:toDate')
  async getChartTransactions(
    @Request() req,
    @Param('fromDate') fromDate: string,
    @Param('toDate') toDate: string,
  ) {
    try {
      const transacions = await this.transactionService.getAll(req?.user?.id);
      const filteredTransactions = filterByDateRange(
        transacions,
        fromDate,
        toDate,
      );
      const categories = await this.categoryService.getAll(req?.user?.id);
      const payload = generateDashboardData(sortByDate(filteredTransactions), categories);
      return { status: 'success', data: payload };
    } catch (err) {
      return { status: 'error', data: err };
    }
  }

  
}
