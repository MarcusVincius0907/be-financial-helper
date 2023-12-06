import { Controller, Get } from '@nestjs/common';
import { ExternalApiService } from 'src/external-api/external-api.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private externalService: ExternalApiService) {}

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
}
