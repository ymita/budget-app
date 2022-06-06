import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AddIncomeComponent } from './add-income/add-income.component';
import { BudgetManagementComponent } from './budget-management/budget-management.component';
import { ReportsComponent } from './reports/reports.component';
import { ProfileComponent } from './profile/profile.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: HomeComponent, data: { title: 'Home' } },
      {
        path: 'add-income',
        component: AddIncomeComponent,
        data: { title: 'Add Income' }
      },
      {
        path: 'budget-management',
        component: BudgetManagementComponent,
        data: { title: 'Budget Management' }
      },
      {
        path: 'reports',
        component: ReportsComponent,
        data: { title: 'Reports' }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: { title: 'Profile' }
      },
      {
        path: 'about',
        component: AboutComponent,
        data: { title: 'About Budget' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetRoutingModule {}
