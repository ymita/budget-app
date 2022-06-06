import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  OnDestroy,
  EventEmitter
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

// RxJS
import { Observable, combineLatest } from 'rxjs';
import { filter, map, takeUntil, take } from 'rxjs/operators';

// Ignite UI for Angular
import { IgxDialogComponent } from 'igniteui-angular';
import { IgxGridRowComponent } from 'igniteui-angular';
import { IGridCellEventArgs } from 'igniteui-angular';

// App
import { Store } from '../stores/store';
import { BudgetService } from '../services/budget.service';
import { TotalBudget, Budget, Transaction, Notification } from '../models';
import { Recurrence, Currency } from '../enums';

export interface BudgetMap {
  id: number;
  name: string;
  totalSpendable: number;
  monthlySpendable: number;
  allocated: number;
  remaining: number;
  recurrence: Recurrence;
  budget: Budget;
}

@Component({
  selector: 'app-budget-management',
  templateUrl: './budget-management.component.html',
  styleUrls: ['./budget-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BudgetManagementComponent implements OnInit, OnDestroy {
  // Total budget
  totalBudget: TotalBudget;

  totalAmount: number;
  unallocatedAmount: number;

  totalBudgetForm: FormGroup;

  // Budget list
  private budgets: Budget[];
  budgetsMap: BudgetMap[];

  /**
   * Budget allocation
   */
  @ViewChild('allocationDialog') allocationDialog: IgxDialogComponent;

  get allocatingBudgetTitle() {
    return this.editingBudget
      ? `Allocate ${this.editingBudget.name} for ${this.datePipe.transform(
          new Date(),
          'MMMM'
        )}`
      : '';
  }

  allocatonForm: FormGroup;

  /**
   * Budget creating/ediging
   */
  editingBudget: BudgetMap;

  @ViewChild('budgetDialog') budgetDialog: IgxDialogComponent;

  budgetForm: FormGroup;

  get recurrences(): string[] {
    return Object.values(Recurrence);
  }

  get currencies(): string[] {
    return Object.values(Currency);
  }

  private readonly onDestroy$ = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private store: Store,
    private budgetService: BudgetService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    const budgetsMap$ = this.store.select<Budget[]>('budgets').pipe(
      filter(Boolean),
      map((budgets: Budget[]) =>
        budgets.map(
          (budget): BudgetMap => {
            const allocated = budget.allocated.reduce(
              (allocated, allocation) => allocated + allocation.amount,
              0
            );

            return {
              id: budget.id,
              name: budget.name,
              totalSpendable: budget.amount,
              monthlySpendable: Math.floor(budget.amount / 12),
              allocated,
              remaining: budget.amount - allocated,
              recurrence: budget.recurrence,
              budget
            };
          }
        )
      )
    );

    const totalBudget$ = this.store.select<TotalBudget>('totalBudget');

    combineLatest(budgetsMap$, totalBudget$)
      .pipe(
        takeUntil(this.onDestroy$),
        filter(([budgetsMap, totalBudget]) => !!budgetsMap && !!totalBudget)
      )
      .subscribe(([budgetsMap, totalBudget]) => {
        this.budgetsMap = budgetsMap;

        this.totalBudget = totalBudget;

        const allocatedAmount = budgetsMap.reduce(
          (allocated, budgetMap) => allocated + budgetMap.allocated,
          0
        );
        this.unallocatedAmount = totalBudget.totalAmount - allocatedAmount;

        this.totalBudgetForm = this.fb.group({
          totalAmount: [totalBudget.totalAmount, Validators.required],
          currency: [totalBudget.currency, Validators.required]
        });
        this.cdr.markForCheck();
      });

    this.budgetService.getBudgets$.pipe(takeUntil(this.onDestroy$)).subscribe();
    this.budgetService
      .getTotalBudget$(2018)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe();
  }

  ngOnDestroy() {
    this.onDestroy$.emit();
  }

  openAllocationDialog(event: IGridCellEventArgs) {
    if (event.cell.column.field !== 'allocated') {
      return;
    }

    const currentMonth = new Date().getMonth() + 1;
    const row = event.cell.row as IgxGridRowComponent;
    const allocation = row.rowData.budget.allocated.find(
      allocation => allocation.month === currentMonth
    );

    // https://github.com/IgniteUI/igniteui-angular/issues/927
    // Due to the #927, I have to delay set timing using setTimeout.
    setTimeout(() => {
      // reset form
      this.allocatonForm = this.fb.group({
        amount: [allocation ? allocation.amount : 0, Validators.required]
      });
      this.cdr.markForCheck();
    });

    this.allocationDialog.open();

    this.editingBudget = row.rowData;
  }

  allocateBudget() {
    const budget = this.editingBudget.budget;

    const currentMonth = new Date().getMonth() + 1;
    const exists = budget.allocated.some(
      allocation => allocation.month === currentMonth
    );
    let allocated;
    if (exists) {
      allocated = budget.allocated.map(allocation => {
        if (allocation.month === currentMonth) {
          allocation = {
            ...allocation,
            amount: this.allocatonForm.value.amount
          };
        }
        return allocation;
      });
    } else {
      allocated = [
        ...budget.allocated,
        {
          id: Date.now(),
          budgetId: budget.id,
          month: currentMonth,
          amount: this.allocatonForm.value.amount
        }
      ];
    }

    this.budgetService.updateBudget({ ...budget, allocated });

    this.closeAllocationDialog();
  }

  closeAllocationDialog() {
    this.allocationDialog.close();

    this.allocatonForm = null;

    this.editingBudget = null;
  }

  openBudgetDialog(event?: BudgetMap) {
    if (event) {
      const budget = event.budget;
      this.budgetForm = this.fb.group({
        name: [budget.name, Validators.required],
        recurrence: [budget.recurrence, Validators.required],
        amount: [budget.amount, Validators.required],
        currency: [Currency.USD, Validators.required]
      });
      this.editingBudget = event;
    } else {
      this.budgetForm = this.fb.group({
        name: ['', Validators.required],
        recurrence: ['', Validators.required],
        amount: [null, Validators.required],
        currency: [Currency.USD, Validators.required]
      });
    }

    this.budgetDialog.open();
  }

  createBudget() {
    // validation
    if (!this.budgetForm.valid) {
      for (let key in this.budgetForm.controls) {
        this.budgetForm.controls[key].markAsTouched();
      }
      return;
    }

    // add budget to the list
    const budgetId = Date.now();
    this.budgetService.addBudget({
      id: budgetId,
      ...this.budgetForm.value,
      allocated: [
        {
          id: Date.now(),
          budgetId: budgetId,
          month: new Date().getMonth() + 1,
          amount: 0
        }
      ]
    });

    this.closeBudgetDialog();
  }

  editBudget() {
    // validation
    if (!this.budgetForm.valid) {
      for (let key in this.budgetForm.controls) {
        this.budgetForm.controls[key].markAsTouched();
      }
      return;
    }

    this.budgetService.updateBudget({
      ...this.editingBudget.budget,
      ...this.budgetForm.value
    });

    this.closeBudgetDialog();
  }

  removeBudget() {
    this.budgetService.removeBudget(this.editingBudget.budget);

    this.closeBudgetDialog();
  }

  closeBudgetDialog() {
    this.budgetDialog.close();

    this.budgetForm = null;

    this.editingBudget = null;
  }

  setTotalBudget() {
    // validation
    if (!this.totalBudgetForm.valid) {
      for (let key in this.totalBudgetForm.controls) {
        this.totalBudgetForm.controls[key].markAsTouched();
      }
      return;
    }

    if (this.totalBudget) {
      // update total budget
      this.budgetService.updateTotalBudget({
        ...this.totalBudget,
        ...this.totalBudgetForm.value
      });
    } else {
      this.budgetService.addTotalBudget({
        id: new Date().getFullYear(),
        ...this.totalBudgetForm.value
      });
    }
  }
}
