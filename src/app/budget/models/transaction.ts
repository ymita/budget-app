export interface Transaction {
  id: number, // PK
  date: Date;
  type: string;
  payee: string;
  amount: number;
  verified: boolean;
  budgetId: number; // FK
}
