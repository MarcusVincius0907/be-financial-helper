import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { HttpModule } from '@nestjs/axios';
import { TransactionModule } from './modules/transaction/transaction.module';
import { DatabaseModule } from './modules/database/database.module';
import { CategoryModule } from './modules/category/category.module';
import { ChartsModule } from './modules/charts/charts.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LoggerMiddleware } from './middlewares/logger.middleware';

@Module({
  imports: [
    HttpModule,
    TransactionModule,
    DatabaseModule,
    CategoryModule,
    ChartsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'fe-financial-helper', 'dist'),
    }),
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer){
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*')
  }
}
