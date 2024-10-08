import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from 'src/models/category.model';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('all')
  async getAll(@Request() req) {
    try {
      const allCategories = await this.categoryService.getAll(req?.user?.id);
      return { status: 'success', data: allCategories };
    } catch (err) {
      return { status: 'error', data: err };
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() bodyData: Category) {
    try {
      if (!id) {
        throw 'É necessário enviar o id';
      }
      const updatedData = await this.categoryService.update(id, bodyData);
      return { status: 'success', data: updatedData };
    } catch (err) {
      return { status: 'error', data: err };
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      if (!id) {
        throw 'É necessário enviar o id';
      }
      const deletedData = await this.categoryService.delete(id);
      return { status: 'success', data: deletedData };
    } catch (err) {
      return { status: 'error', data: err };
    }
  }

  @Post('create')
  async create(@Request() req, @Body() bodyData: Category) {
    try {
      const addUserIdObj = {...bodyData, userId: req?.user?.id}
      const dataCreated = await this.categoryService.create(addUserIdObj);
      return { status: 'success', data: dataCreated };
    } catch (err) {
      return { status: 'error', data: err };
    }
  }
}
