import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { HttpModule } from '@nestjs/axios';
import { ExternalApiService } from 'src/external-api/external-api.service';

@Module({
  imports: [HttpModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, ExternalApiService],
})
export class TransactionsModule {}
