export interface PluggyTransactionResponse {
  total: number;
  totalPages: number;
  page: number;
  results: PluggyTransactionItem[];
}

export interface PluggyTransactionItem {
  id: string;
  description: string;
  descriptionRaw: string;
  currencyCode: string;
  amount: string;
  date: string;
  balance: string;
  category: string;
  accountId: string;
  providerCode: string;
  status: string;
  paymentData: string;
}
