import { Recurrence, Currency } from '../enums';

export interface TotalBudget {
  id: number;
  totalAmount: number;
  currency: Currency;
}

export interface Budget {
  id: number;
  name: string;
  amount: number;
  recurrence: Recurrence;
  allocated: Allocation[];
}

export interface Allocation {
  id: number;
  budgetId: number;
  month: number;
  amount: number;
}
