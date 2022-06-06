// Angular
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Ignite UI for Angular
import {
  IgxBadgeModule,
  IgxButtonModule,
  IgxCardModule,
  IgxCheckboxModule,
  IgxDatePickerModule,
  IgxDialogModule,
  IgxGridModule,
  IgxIconModule,
  IgxInputGroupModule,
  IgxLayoutModule,
  IgxListModule,
  IgxNavbarModule,
  IgxNavigationDrawerModule,
  IgxProgressBarModule,
  IgxRippleModule,
  IgxSliderModule,
  IgxToggleModule
} from 'igniteui-angular';

// Ignite UI for Angular Charts
import { IgxCategoryChartModule } from 'igniteui-angular-charts/ES5/igx-category-chart-module';

// Third party libraries
import { TimeAgoPipe } from 'time-ago-pipe';

// App
import { BudgetRoutingModule } from './budget-routing.module';
import { SharedModule } from '../shared/shared.module';

import { HomeComponent } from './home/home.component';
import { AddIncomeComponent } from './add-income/add-income.component';
import { BudgetManagementComponent } from './budget-management/budget-management.component';
import { AboutComponent } from './about/about.component';
import { ProfileComponent } from './profile/profile.component';
import { ReportsComponent } from './reports/reports.component';

import { Store } from './stores/store';
import { BudgetService } from './services/budget.service';

@NgModule({
  imports: [
    // Angular modules
    CommonModule,
    ReactiveFormsModule,

    // Ignite UI for Angular modules
    IgxBadgeModule,
    IgxButtonModule,
    IgxCardModule,
    IgxCheckboxModule,
    IgxDatePickerModule,
    IgxDialogModule,
    IgxGridModule,
    IgxIconModule,
    IgxInputGroupModule,
    IgxLayoutModule,
    IgxListModule,
    IgxNavbarModule,
    IgxNavigationDrawerModule,
    IgxProgressBarModule,
    IgxRippleModule,
    IgxSliderModule,
    IgxToggleModule,

    // Ignite UI for Angular Charts
    IgxCategoryChartModule,

    // My modules
    BudgetRoutingModule,
    SharedModule
  ],
  declarations: [
    TimeAgoPipe,

    HomeComponent,
    AddIncomeComponent,
    BudgetManagementComponent,
    ReportsComponent,
    ProfileComponent,
    AboutComponent
  ],
  providers: [DatePipe, Store, BudgetService]
})
export class BudgetModule {}
