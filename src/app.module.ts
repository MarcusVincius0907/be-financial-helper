import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { TransactionsModule } from './modules/transactions/transactions.module';

@Module({
  imports: [HttpModule, TransactionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
