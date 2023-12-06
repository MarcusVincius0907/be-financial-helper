import { Controller, Get } from '@nestjs/common';
import { ExternalApiService } from 'src/external-api/external-api.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private externalService: ExternalApiService) {}

  @Get('test')
  async test() {
    try {
      const resp = await this.externalService.createApiKey();
      return { status: 'sucess', data: resp?.data };
    } catch (e) {
      return { status: 'error', data: e };
    }
  }
}
