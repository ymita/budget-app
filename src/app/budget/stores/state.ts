import {
  TotalBudget,
  Budget,
  Transaction,
  Income,
  User,
  Notification
} from '../models';

export interface State {
  totalBudget: TotalBudget;
  budgets: Budget[];
  transactions: Transaction[];
  incomes: Income[];
  user: User;
  notifications: Notification[];
}
