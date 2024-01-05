import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ExternalApiService } from 'src/external-api/external-api.service';
import { TransactionService } from './transaction.service';
import { Transaction } from 'src/models/transaction.model';
import { sortByDate } from 'src/utils/utils';

@Controller('transaction')
export class TransactionController {
  constructor(
    private externalService: ExternalApiService,
    private service: TransactionService,
  ) {}

  @Get('get-token')
  async getToken() {
    try {
      const resp = await this.externalService.createApiKey();
      return { status: 'success', data: resp?.data };
    } catch (e) {
      return { status: 'error', data: e };
    }
  }

  @Get('all')
  async getAll() {
    try {
      const allTransactions: Transaction[] = await this.service.getAll();
      const sortedTransactions = sortByDate(allTransactions);
      return { status: 'success', data: sortedTransactions };
    } catch (err) {
      return { status: 'error', data: err };
    }
  }

  @Get('/:fromDate/:toDate')
  async getFilteredByDate(
    @Param('fromDate') fromDate: string,
    @Param('toDate') toDate: string,
  ) {
    try {
      const allTransactions: Transaction[] =
        await this.service.getFilteredByDate(fromDate, toDate);
      const sortedTransactions = sortByDate(allTransactions);
      return { status: 'success', data: sortedTransactions };
    } catch (err) {
      return { status: 'error', data: err };
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() bodyData: Transaction) {
    try {
      if (!id) {
        throw 'É necessário enviar o id';
      }
      const updatedData = await this.service.update(id, bodyData);
      return { status: 'success', data: updatedData };
    } catch (err) {
      return { status: 'error', data: err };
    }
  }

  @Delete('delete-all')
  async deleteAll() {
    try {
      const deletedData = await this.service.deleteAll();
      return { status: 'success', data: deletedData };
    } catch (err) {
      return { status: 'error', data: err };
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      if (!id) {
        throw 'É necessário enviar o id';
      }
      const deletedData = await this.service.delete(id);
      return { status: 'success', data: deletedData };
    } catch (err) {
      return { status: 'error', data: err };
    }
  }

  @Post('create')
  async create(@Body() bodyData: Transaction) {
    try {
      const dataCreated = await this.service.create(bodyData);
      return { status: 'success', data: dataCreated };
    } catch (err) {
      return { status: 'error', data: err };
    }
  }

  @Get('sync-transactions/:fromDate/:toDate')
  async syncTransactions(
    @Param('fromDate') fromDate: string,
    @Param('toDate') toDate: string,
  ) {
    try {
      if (!fromDate || !toDate) {
        throw 'Need to send fromDate and toDate query params.';
      }
      const resp = await this.service.syncTransactions(fromDate, toDate);
      return { status: 'success', data: resp };
    } catch (e) {
      return { status: 'error', data: e };
    }
  }
}
