export interface User {
  id: number;
  userName: string;
  email: string;
  password: string;
  notifyIncome: boolean;
  notifyBudgetAllocation: boolean;
  notifyExpense: boolean;
  notifyTransfer: boolean;
  currency: string;
  timezone: string;
}
