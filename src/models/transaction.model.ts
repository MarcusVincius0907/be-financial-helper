export interface Transaction {
  __id?: string;
  userId?: string;
  externalId?: string;
  description: string;
  date: string;
  amount: number;
  categoryId: string;
}

export interface GoogleSheetRowData {
  date: string;
  description: string;
  value: string;
}