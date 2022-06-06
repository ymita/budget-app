import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  EventEmitter
} from '@angular/core';

// RxJS
import { Observable } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

// App
import { Store } from '../stores/store';
import { BudgetService } from '../services/budget.service';
import { Budget } from '../models';

export interface BudgetReport {
  name: string;
  amount: number;
  percentage: number;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsComponent implements OnInit, OnDestroy {
  budgets$: Observable<Budget[]>;
  budgetReports$: Observable<BudgetReport[]>;

  private readonly onDestroy$ = new EventEmitter();

  constructor(
    private cdr: ChangeDetectorRef,
    private store: Store,
    private budgetService: BudgetService
  ) {}

  ngOnInit() {
    this.budgets$ = this.store.select<Budget[]>('budgets');
    this.budgetReports$ = this.budgets$.pipe(
      filter<Budget[]>(Boolean),
      map(budgets => {
        const totalAmount = budgets.reduce(
          (total, budget) => total + budget.amount,
          0
        );

        const budgetReports = budgets.map<BudgetReport>(budget => ({
          name: budget.name,
          amount: budget.amount,
          percentage: budget.amount / totalAmount
        }));

        budgetReports.push({
          name: 'Total',
          amount: totalAmount,
          percentage: 1
        });

        return budgetReports;
      })
    );

    this.budgetService.getBudgets$.pipe(takeUntil(this.onDestroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.emit();
  }
}
