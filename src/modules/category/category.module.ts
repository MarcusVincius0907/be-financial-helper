import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { HttpModule } from '@nestjs/axios';
import { Category, CategorySchema } from '../database/schemas/category.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryService } from './category.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, JwtService],
})
export class CategoryModule {}
