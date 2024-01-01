import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { TransactionModule } from './modules/transaction/transaction.module';
import { DatabaseModule } from './modules/database/database.module';
import { CategoryModule } from './modules/category/category.module';
import { ChartsModule } from './modules/charts/charts.module';

@Module({
  imports: [HttpModule, TransactionModule, DatabaseModule, CategoryModule, ChartsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
