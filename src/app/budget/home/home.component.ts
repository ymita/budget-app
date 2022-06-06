import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  OnDestroy,
  EventEmitter
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

// RxJS
import { Observable, BehaviorSubject, combineLatest, zip } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  takeUntil,
  tap
} from 'rxjs/operators';

// App
import { Store } from '../stores/store';
import { LoaderService } from '../../shared/services/loader.service';
import { BudgetService } from '../services/budget.service';
import { TotalBudget, Budget, Transaction, Notification } from '../models';
import { Recurrence, Currency } from '../enums';

export interface BudgetMap extends Budget {
  spentAmount: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  today = new Date();

  /**
   * Budget things
   */

  budgets$: Observable<Budget[]>;

  totalAmount$: Observable<number>;
  unallocatedAmount$: Observable<number>;

  subtotalAmountForMonthly$: Observable<number>;
  budgetsForMonthly$: Observable<BudgetMap[]>;

  subtotalAmountForEverySixMonths$: Observable<number>;
  budgetsForEverySixMonths$: Observable<BudgetMap[]>;

  private selectedBudget = new BehaviorSubject<BudgetMap>(undefined);
  selectedBudget$ = this.selectedBudget
    .asObservable()
    .pipe(distinctUntilChanged());

  /**
   * Notification things
   */
  notifications: Notification[];

  /**
   * Transaction things
   */
  spentAmountForThisMonth: number;
  spentAmountFromLastMonth: number;
  spentAmountFromLastYear: number;

  transactions$: Observable<Transaction[]>;

  /**
   * Transaction form
   */
  isCreating = false;

  form = this.fb.group({
    date: [new Date(), Validators.required],
    payee: ['', Validators.required],
    amount: [null, Validators.required],
    currency: [Currency.USD, Validators.required],
    budgetId: [null, Validators.required]
  });

  get currencies(): string[] {
    return Object.values(Currency);
  }

  private readonly onDestroy$ = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private store: Store,
    private budgetService: BudgetService,
    private loader: LoaderService
  ) {}

  ngOnInit() {
    this.budgets$ = this.store.select<Budget[]>('budgets');
    const transactions$ = this.store.select<Transaction[]>('transactions');

    const budgetsMap$ = zip(this.budgets$, transactions$).pipe(
      filter(([budgets, transactions]) => !!budgets && !!transactions),
      map(([budgets, transactions]) =>
        budgets.map(budget => {
          const spentAmount = transactions
            .filter(
              transaction =>
                transaction.budgetId === budget.id && transaction.verified
            )
            .reduce((spentAmount, tran) => spentAmount + tran.amount, 0);
          return {
            ...budget,
            spentAmount: spentAmount
          };
        })
      )
    );

    /**
     * About Budgets
     */
    this.totalAmount$ = this.store.select<TotalBudget>('totalBudget').pipe(
      filter<TotalBudget>(Boolean),
      map<TotalBudget, number>(totalBudget => totalBudget.totalAmount)
    );

    this.unallocatedAmount$ = zip(this.totalAmount$, this.budgets$).pipe(
      filter(([totalAmount, budgets]) => !!totalAmount && !!budgets),
      map(
        ([totalAmount, budgets]): number => {
          const allocatedAmount = budgets.reduce(
            (allocated, budget) =>
              allocated +
              budget.allocated.reduce((sum, bgt) => sum + bgt.amount, 0),
            0
          );
          return totalAmount - allocatedAmount;
        }
      )
    );

    this.budgetsForMonthly$ = budgetsMap$.pipe(
      filter(Boolean),
      map(budgets =>
        budgets.filter(budgetMap => budgetMap.recurrence === Recurrence.Monthly)
      )
    );

    this.subtotalAmountForMonthly$ = this.budgetsForMonthly$.pipe(
      map(budgets =>
        budgets.reduce((subtotal, budget) => subtotal + budget.amount, 0)
      )
    );

    this.budgetsForEverySixMonths$ = budgetsMap$.pipe(
      filter(Boolean),
      map(budgets =>
        budgets.filter(
          budgetMap => budgetMap.recurrence === Recurrence.EverySixMonths
        )
      )
    );

    this.subtotalAmountForEverySixMonths$ = this.budgetsForEverySixMonths$.pipe(
      map(budgets =>
        budgets.reduce((subtotal, budget) => subtotal + budget.amount, 0)
      )
    );

    /**
     * About Notifications
     */
    this.store
      .select<Notification[]>('notifications')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(notifications => (this.notifications = notifications));

    /**
     * About Transactions
     */

    transactions$
      .pipe<Transaction[]>(
        takeUntil(this.onDestroy$),
        filter(Boolean)
      )
      .subscribe(transactions => {
        const thisYear = this.today.getFullYear();
        const lastYear = thisYear - 1;
        const thisMonth = this.today.getMonth();
        const lastMonth = thisMonth - 1;

        this.spentAmountForThisMonth = transactions
          .filter(
            transaction =>
              transaction.verified &&
              transaction.date.getFullYear() === thisYear &&
              transaction.date.getMonth() === thisMonth
          )
          .reduce((sum, transaction) => sum + transaction.amount, 0);

        this.spentAmountFromLastMonth =
          this.spentAmountForThisMonth -
          transactions
            .filter(
              transaction =>
                transaction.verified &&
                transaction.date.getFullYear() === thisYear &&
                transaction.date.getMonth() === lastMonth
            )
            .reduce((sum, transaction) => sum + transaction.amount, 0);

        this.spentAmountFromLastYear =
          this.spentAmountForThisMonth -
          transactions
            .filter(
              transaction =>
                transaction.verified &&
                transaction.date.getFullYear() === lastMonth &&
                transaction.date.getMonth() === thisMonth
            )
            .reduce((sum, transaction) => sum + transaction.amount, 0);
      });

    this.transactions$ = combineLatest(
      this.selectedBudget$,
      transactions$
    ).pipe(
      filter(([selectedBudget, transactions]) => !!transactions),
      map(([selectedBudget, transactions]) => {
        return selectedBudget
          ? transactions.filter(
              transaction => transaction.budgetId === selectedBudget.id
            )
          : transactions.filter(transaction => !transaction.verified);
      })
    );

    this.budgetService
      .getTotalBudget$(new Date().getFullYear())
      .pipe(takeUntil(this.onDestroy$))
      .subscribe();
    this.budgetService.getBudgets$.pipe(takeUntil(this.onDestroy$)).subscribe();
    this.budgetService.getTransactions$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe();
    this.budgetService.getNotifications$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe();
  }

  ngOnDestroy() {
    this.onDestroy$.emit();
  }

  clearNotification(event: Notification) {
    this.budgetService.removeNotification(event);
  }

  clearAllNotifications(notifications: Notification[]) {
    for (let notification of notifications) {
      this.budgetService.removeNotification(notification);
    }
  }

  filterTransactions(event: BudgetMap) {
    this.loader.show();
    this.selectedBudget.next(event);
    this.loader.hide(200);
  }

  clearFilterTransactions() {
    this.loader.show();
    this.selectedBudget.next(undefined);
    this.loader.hide(200);
  }

  verifyTransaction(event: Transaction) {
    this.budgetService.updateTransaction({ ...event, verified: true });
  }

  addExpense() {
    if (this.selectedBudget.value) {
      this.form.patchValue({ budgetId: this.selectedBudget.value.id });
    }
    this.isCreating = true;
  }

  createTransaction() {
    // validation
    if (!this.form.valid) {
      for (let key in this.form.controls) {
        this.form.controls[key].markAsTouched();
      }
      return;
    }

    // add transaction to the list
    this.budgetService.addTransaction({
      id: Date.now(),
      ...this.form.value,
      type: '',
      verified: false
    });

    this.isCreating = false;

    this.form.reset({
      date: new Date(),
      payee: '',
      amount: null,
      currency: this.form.value.currency,
      budgetId: null
    });
  }
}
