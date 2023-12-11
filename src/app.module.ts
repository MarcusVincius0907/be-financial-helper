import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { TransactionModule } from './modules/transaction/transaction.module';
import { DatabaseModule } from './modules/database/database.module';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [HttpModule, TransactionModule, DatabaseModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
