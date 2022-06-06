import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

// RxJS
import { Observable, Subscription } from 'rxjs';

// App
import { Store } from '../stores/store';
import { BudgetService } from '../services/budget.service';
import { Income } from '../models';

@Component({
  selector: 'app-add-income',
  templateUrl: './add-income.component.html',
  styleUrls: ['./add-income.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddIncomeComponent implements OnInit, OnDestroy {
  incomes$: Observable<Income[]>;

  incomesSubscription: Subscription;

  form = this.fb.group({
    date: [new Date(), Validators.required],
    payee: ['', Validators.required],
    amount: [0, Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private store: Store,
    private budgetService: BudgetService
  ) {}

  ngOnInit() {
    this.incomes$ = this.store.select('incomes');
    this.incomesSubscription = this.budgetService.getIncomes$.subscribe();
  }

  ngOnDestroy() {
    this.incomesSubscription.unsubscribe();
  }

  addIncome() {
    // validation
    if (!this.form.valid) {
      for (let key in this.form.controls) {
        this.form.controls[key].markAsTouched();
      }
      return;
    }

    // add income to the list
    this.budgetService.addIncome({
      id: Date.now(),
      ...this.form.value
    });

    // reset form
    this.form.reset({
      date: new Date(),
      payee: '',
      amount: 0
    });
  }
}
