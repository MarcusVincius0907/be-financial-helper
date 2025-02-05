import { Module } from '@nestjs/common';
import { ChartsController } from './charts.controller';
import { CategoryService } from '../category/category.service';
import { TransactionService } from '../transaction/transaction.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from '../database/schemas/category.schema';
import { Transaction, TransactionSchema } from '../database/schemas/transaction.schema';
import { NubankIntegrationService } from 'src/external-api/nubank-integration.service';
import { JwtService } from '@nestjs/jwt';
import { GoogleSheetService } from 'src/external-api/google-sheets.service';

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: Category.name, schema: CategorySchema },
        { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [ChartsController],
  providers: [CategoryService, TransactionService, NubankIntegrationService, JwtService, GoogleSheetService]
})
export class ChartsModule {}
