import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from 'src/models/category.model';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('all')
  async getAll() {
    try {
      const allCategories = await this.categoryService.getAll();
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
  async create(@Body() bodyData: Category) {
    try {
      const dataCreated = await this.categoryService.create(bodyData);
      return { status: 'success', data: dataCreated };
    } catch (err) {
      return { status: 'error', data: err };
    }
  }
}
