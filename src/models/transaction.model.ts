import { Category } from './category.model';

export interface Transaction {
  __id: string;
  externalId: string;
  description: string;
  date: string;
  amount: string;
  categoryId: string;
}
