import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter
} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

// RxJS
import { Observable, of, pipe } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

// Third party libraries
import * as moment from 'moment-timezone';

// App
import { Store } from '../stores/store';
import { BudgetService } from '../services/budget.service';
import { User } from '../models';
import { Currency } from '../enums';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  user: User;

  get currencies(): string[] {
    return Object.values(Currency);
  }

  timezones$: Observable<[{ value: string; text: string }]>;

  form: FormGroup;

  private readonly onDestroy$ = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private store: Store,
    private budgetService: BudgetService
  ) {}

  ngOnInit() {
    this.timezones$ = of(
      moment.tz.names().map<{ value: string; text: string }>(name => ({
        value: name,
        text: `(GMT ${moment.tz(name).format('Z')}) ${name}`
      }))
    );
    this.store
      .select<User>('user')
      .pipe(
        takeUntil(this.onDestroy$),
        filter(Boolean)
      )
      .subscribe(user => {
        this.user = user;
        this.setForm(user);
        this.cdr.markForCheck();
      });
    this.budgetService
      .getUser$(1)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe();
  }

  ngOnDestroy() {
    this.onDestroy$.emit();
  }

  cancelProfile() {
    this.form.reset(this.user);
  }

  saveProfile() {
    // validation
    if (!this.form.valid) {
      for (let key in this.form.controls) {
        this.form.controls[key].markAsTouched();
      }
      return;
    }

    const {
      userName,
      email,

      password = this.form.value.newPassword,

      notifyIncome,
      notifyBudgetAllocation,
      notifyExpense,
      notifyTransfer,

      currency,

      timezone
    } = this.form.value;

    // update profile
    this.budgetService.updateUser({
      ...this.user,
      userName,
      email,

      password,

      notifyIncome,
      notifyBudgetAllocation,
      notifyExpense,
      notifyTransfer,

      currency,

      timezone
    });
  }

  setForm(user: User) {
    this.form = this.fb.group({
      // Account settings
      userName: [user.userName, Validators.required],
      email: [user.email, Validators.required],

      // Change Password
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      repeatNewPassword: ['', Validators.required],

      // Notifications
      notifyIncome: [user.notifyIncome, Validators.required],
      notifyBudgetAllocation: [
        user.notifyBudgetAllocation,
        Validators.required
      ],
      notifyExpense: [user.notifyExpense, Validators.required],
      notifyTransfer: [user.notifyTransfer, Validators.required],

      // Default Currency
      currency: [user.currency, Validators.required],

      // Time Zone
      timezone: [user.timezone, Validators.required]
    });
  }
}
