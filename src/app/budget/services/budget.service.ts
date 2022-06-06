import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// RxJS
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// App
import { Store } from '../stores/store';
import {
  TotalBudget,
  Budget,
  Transaction,
  Income,
  User,
  Notification
} from '../models';

@Injectable()
export class BudgetService {
  private totalBudgetsUrl = '/api/total-budgets';
  private budgetsUrl = '/api/budgets';
  private transactionsUrl = '/api/transactions';
  private incomesUrl = '/api/incomes';
  private usersUrl = '/api/users';
  private notificationsUrl = '/api/notifications';

  constructor(private http: HttpClient, private store: Store) {}

  getTotalBudget$(year: number): Observable<TotalBudget> {
    return this.http
      .get<TotalBudget>(`${this.totalBudgetsUrl}/${year}`)
      .pipe(tap(totalBudget => this.store.set('totalBudget', totalBudget)));
  }

  addTotalBudget(event: TotalBudget): void {
    this.http
      .post<TotalBudget>(this.totalBudgetsUrl, event)
      .subscribe(totalBudget => {
        const newTotalBudget = {
          ...this.store.value.totalBudget,
          ...totalBudget
        };
        this.store.set('totalBudget', newTotalBudget);
      });
  }

  updateTotalBudget(event: TotalBudget): void {
    this.http
      .put<TotalBudget>(`${this.totalBudgetsUrl}/${event.id}`, event)
      .subscribe(totalBudget => {
        const newTotalBudget = {
          ...this.store.value.totalBudget,
          ...totalBudget
        };
        this.store.set('totalBudget', newTotalBudget);
      });
  }

  getBudgets$ = this.http
    .get<Budget[]>(this.budgetsUrl)
    .pipe(tap(budgets => this.store.set('budgets', budgets)));

  addBudget(event: Budget) {
    this.http.post<Budget>(this.budgetsUrl, event).subscribe(budget => {
      const newBudgets = [...this.store.value.budgets, budget];
      this.store.set('budgets', newBudgets);
    });
  }

  updateBudget(event: Budget) {
    this.http
      .put<Budget>(`${this.budgetsUrl}/${event.id}`, event)
      .subscribe(budget => {
        const newBudgets = this.store.value.budgets.map(bgt => {
          if (bgt.id === budget.id) {
            return { ...bgt, ...budget };
          }
          return bgt;
        });
        this.store.set('budgets', newBudgets);
      });
  }

  removeBudget(event: Budget) {
    this.http.delete<Budget>(`${this.budgetsUrl}/${event.id}`).subscribe(() => {
      const newBudgets = this.store.value.budgets.filter(
        budget => budget.id !== event.id
      );
      this.store.set('budgets', newBudgets);
    });
  }

  getTransactions$ = this.http.get<Transaction[]>(this.transactionsUrl).pipe(
    tap(transactions => {
      transactions = transactions.map(transaction => ({
        ...transaction,
        date: new Date(transaction.date)
      }));
      this.store.set('transactions', transactions);
    })
  );

  addTransaction(event: Transaction) {
    this.http
      .post<Transaction>(this.transactionsUrl, event)
      .subscribe(transaction => {
        const newTransactions = [...this.store.value.transactions, transaction];
        this.store.set('transactions', newTransactions);
      });
  }

  updateTransaction(event: Transaction) {
    this.http
      .put<Transaction>(`${this.transactionsUrl}/${event.id}`, event)
      .subscribe(transaction => {
        const newTransactions = this.store.value.transactions.map(tran => {
          if (tran.id === transaction.id) {
            return {
              ...tran,
              ...transaction,
              date: new Date(transaction.date)
            };
          }
          return tran;
        });
        this.store.set('transactions', newTransactions);
      });
  }

  getIncomes$ = this.http
    .get<Income[]>(this.incomesUrl)
    .pipe(tap(incomes => this.store.set('incomes', incomes)));

  addIncome(event: Income) {
    this.http.post<Income>(this.incomesUrl, event).subscribe(income => {
      const newIncomes = [...this.store.value.incomes, income];
      this.store.set('incomes', newIncomes);
    });
  }

  getUser$(userId: number): Observable<User> {
    return this.http
      .get<User>(`${this.usersUrl}/${userId}`)
      .pipe(tap(user => this.store.set('user', user)));
  }

  updateUser(event: User) {
    this.http
      .put<User>(`${this.usersUrl}/${event.id}`, event)
      .subscribe(user => {
        const newUser = { ...this.store.value.user, ...user };
        this.store.set('user', newUser);
      });
  }

  getNotifications$ = this.http.get<Notification[]>(this.notificationsUrl).pipe(
    tap(notifications => {
      notifications = notifications.map(notification => ({
        ...notification,
        date: new Date(notification.date)
      }));
      this.store.set('notifications', notifications);
    })
  );

  removeNotification(event: Notification) {
    this.http
      .delete<Notification>(`${this.notificationsUrl}/${event.id}`)
      .subscribe(() => {
        const newNotifications = this.store.value.notifications.filter(
          notification => notification.id !== event.id
        );
        this.store.set('notifications', newNotifications);
      });
  }
}
