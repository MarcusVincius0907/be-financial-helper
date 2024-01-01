import { Controller, Get } from '@nestjs/common';
import { TransactionService } from '../transaction/transaction.service';
import { CategoryService } from '../category/category.service';
import { groupByTransactionsWithCategories } from 'src/utils/utils';

@Controller('charts')
export class ChartsController {

    constructor(
        private transactionService: TransactionService,
        private categoryService: CategoryService
    ){}

    @Get('transactions')
    async getChartTransactions() {
        try {
            const transacions = await this.transactionService.getAll();
            const categories = await this.categoryService.getAll();
            const labels = (categories).map(category =>  (category.text))
            labels.push('default')
            const series = groupByTransactionsWithCategories(transacions, categories);
            const payload = {
                labels,
                series
            }
            return { status: 'success', data: payload };
        } catch (err) {
            return { status: 'error', data: err };
        }
    }
}
