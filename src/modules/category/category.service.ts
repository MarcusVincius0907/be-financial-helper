import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from 'src/models/category.model';
import { Category as CategoryClassSchema } from '../database/schemas/category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(CategoryClassSchema.name)
    private readonly categoryModel: Model<Category>,
  ) {}

  async getAll(userId: string) {
    try {
      return await this.categoryModel.find({userId}).exec();
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async create(data: Category) {
    try {
      const createdData = new this.categoryModel(data);
      return await createdData.save();
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async update(id: string, data: Category) {
    try {
      return await this.categoryModel.findByIdAndUpdate(id, data).exec();
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async delete(id: string) {
    try {
      return await this.categoryModel.deleteOne({ _id: id }).exec();
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
