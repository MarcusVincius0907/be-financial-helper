import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { HttpModule } from '@nestjs/axios';
import { ExternalApiService } from 'src/external-api/external-api.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Transaction,
  TransactionSchema,
} from '../database/schemas/transaction.schema';
import { Category, CategorySchema } from '../database/schemas/category.schema';
import { NubankIntegrationService } from 'src/external-api/nubank-integration.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, ExternalApiService, NubankIntegrationService],
})
export class TransactionModule {}
