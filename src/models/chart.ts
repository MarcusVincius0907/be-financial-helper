import { Transaction } from "./transaction.model";


export interface SerieItem {
  name: string;
  amount: number;
  quantity: number;
}

export interface TrasactionChart {
  mostVisited: string;
  mostExpensive: string;
  mostSpentCategory: string;
  overHungredSpent: number;

  categoryChart: { label: string; data: number }[];
  currentMonthExpense: { label: string; data: number }[];
  budgetByCategory: BudgetChart[];
  lastBoughtItems: Transaction[];
}

export interface BudgetChart {
  category: string;
  expected: number;
  current: number;
}
