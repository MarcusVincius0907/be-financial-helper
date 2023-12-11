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

@Controller('transaction')
export class TransactionController {
  constructor(
    private externalService: ExternalApiService,
    private service: TransactionService,
  ) {}

  @Get()
  async getTransactions() {
    try {
      const resp = await this.externalService.getTransactions();
      return { status: 'success', data: resp?.data };
    } catch (e) {
      return { status: 'error', data: e };
    }
  }

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
      const allCategories = await this.service.getAll();
      return { status: 'success', data: allCategories };
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
}
