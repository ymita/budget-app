import { Injectable } from '@angular/core';

import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Recurrence } from '../../budget/enums';

@Injectable()
export class MockBudgetService implements InMemoryDbService {
  createDb() {
    // for register.component
    // for login.component
    // for profile.component
    const users = [
      {
        id: 1,
        userName: 'Tatsushi Kiryu',
        email: 'tkiryu@infragistics.com',
        password: '1234567890',
        notifyIncome: true,
        notifyBudgetAllocation: false,
        notifyExpense: true,
        notifyTransfer: false,
        currency: 'USD',
        timezone: 'America/New_York'
      }
    ];

    // for add-income.component
    const incomes = [
      {
        id: 1,
        date: new Date('07-03-2018'),
        payee: 'Received payment according to contract #14251',
        amount: 150000
      },
      {
        id: 2,
        date: new Date('04-23-2018'),
        payee:
          'Received payment on consultancy work according to contract #231',
        amount: 50000
      },
      {
        id: 3,
        date: new Date('04-12-2018'),
        payee: 'Received payment according to contract #14248',
        amount: 70000
      },
      {
        id: 4,
        date: new Date('01-19-2018'),
        payee:
          'Received payment on consultancy work according to contract #230',
        amount: 20000
      },
      {
        id: 5,
        date: new Date('12-22-2017'),
        payee: 'Received payment according to contract #14247',
        amount: 140000
      },
      {
        id: 6,
        date: new Date('10-05-2017'),
        payee:
          'Received payment on consultancy work according to contract #227',
        amount: 23000
      },
      {
        id: 7,
        date: new Date('09-28-2017'),
        payee: 'Received payment according to contract #14242',
        amount: 100000
      }
    ];

    const totalBudgets = [{ id: 2018, totalAmount: 284470, currency: 'USD' }];

    // for report.component
    // for budget-management.component
    // for home.component
    const budgets = [
      {
        id: 1,
        name: 'Salaries',
        amount: 732240,
        allocated: [
          { id: 1, budgetId: 1, month: 1, amount: 61020 },
          { id: 2, budgetId: 1, month: 2, amount: 61020 },
          { id: 3, budgetId: 1, month: 3, amount: 61020 },
          { id: 4, budgetId: 1, month: 4, amount: 0 }
        ],
        remaining: 61020,
        recurrence: Recurrence.Monthly
      },
      {
        id: 2,
        name: 'Office Materials',
        amount: 72000,
        allocated: [
          { id: 5, budgetId: 2, month: 1, amount: 6000 },
          { id: 6, budgetId: 2, month: 2, amount: 6000 },
          { id: 7, budgetId: 2, month: 3, amount: 6000 },
          { id: 8, budgetId: 2, month: 4, amount: 0 }
        ],
        remaining: 450,
        recurrence: Recurrence.Monthly
      },
      {
        id: 3,
        name: 'Marketing',
        amount: 80000,
        allocated: [
          { id: 9, budgetId: 3, month: 1, amount: 6700 },
          { id: 10, budgetId: 3, month: 2, amount: 6700 },
          { id: 11, budgetId: 3, month: 3, amount: 6700 },
          { id: 12, budgetId: 3, month: 4, amount: 0 }
        ],
        remaining: 4700,
        recurrence: Recurrence.Monthly
      },
      {
        id: 4,
        name: 'Office Food',
        amount: 12000,
        allocated: [
          { id: 13, budgetId: 4, month: 1, amount: 1000 },
          { id: 14, budgetId: 4, month: 2, amount: 1000 },
          { id: 15, budgetId: 4, month: 3, amount: 1000 },
          { id: 16, budgetId: 4, month: 4, amount: 0 }
        ],
        remaining: 690,
        recurrence: Recurrence.Monthly
      },
      {
        id: 5,
        name: 'Electricity',
        amount: 25000,
        allocated: [
          { id: 17, budgetId: 5, month: 1, amount: 2100 },
          { id: 18, budgetId: 5, month: 2, amount: 2100 },
          { id: 19, budgetId: 5, month: 3, amount: 2100 },
          { id: 20, budgetId: 5, month: 4, amount: 0 }
        ],
        remaining: 2080,
        recurrence: Recurrence.Monthly
      },
      {
        id: 6,
        name: 'Internet',
        amount: 3600,
        allocated: [
          { id: 21, budgetId: 6, month: 1, amount: 300 },
          { id: 22, budgetId: 6, month: 2, amount: 300 },
          { id: 23, budgetId: 6, month: 3, amount: 300 },
          { id: 24, budgetId: 6, month: 4, amount: 0 }
        ],
        remaining: 0,
        recurrence: Recurrence.Monthly
      },
      {
        id: 7,
        name: 'Water',
        amount: 7200,
        allocated: [
          { id: 25, budgetId: 7, month: 1, amount: 600 },
          { id: 26, budgetId: 7, month: 2, amount: 600 },
          { id: 27, budgetId: 7, month: 3, amount: 600 },
          { id: 28, budgetId: 7, month: 4, amount: 0 }
        ],
        remaining: 0,
        recurrence: Recurrence.Monthly
      },
      {
        id: 8,
        name: 'Conference',
        amount: 22000,
        allocated: [
          { id: 29, budgetId: 8, month: 1, amount: 2000 },
          { id: 30, budgetId: 8, month: 2, amount: 2000 },
          { id: 31, budgetId: 8, month: 3, amount: 2000 },
          { id: 32, budgetId: 8, month: 4, amount: 0 }
        ],
        remaining: 11000,
        recurrence: Recurrence.EverySixMonths
      },
      {
        id: 9,
        name: 'Coaching',
        amount: 1300,
        allocated: [
          { id: 33, budgetId: 9, month: 1, amount: 110 },
          { id: 34, budgetId: 9, month: 2, amount: 110 },
          { id: 35, budgetId: 9, month: 3, amount: 110 },
          { id: 36, budgetId: 9, month: 4, amount: 0 }
        ],
        remaining: 350,
        recurrence: Recurrence.EverySixMonths
      }
    ];

    // for home.component
    const transactions = [
      {
        id: 1,
        budgetId: 9,
        date: new Date('06-08-2018'),
        type: '',
        payee: 'Coaching Budget Allocated',
        amount: 350,
        verified: false
      },
      {
        id: 2,
        budgetId: 8,
        date: new Date('02-10-2018'),
        type: '',
        payee: 'Issued payment of invoice #358723 by EventManageInc',
        amount: 2000,
        verified: false
      },
      {
        id: 3,
        budgetId: 1,
        date: new Date('09-27-2018'),
        type: '',
        payee: 'Payment to Sun Electric Co.',
        amount: 300,
        verified: true
      },
      {
        id: 4,
        budgetId: 3,
        date: new Date('07-03-2018'),
        type: '',
        payee: 'Received payment according to contract #14251',
        amount: 150000,
        verified: true
      },
      {
        id: 5,
        budgetId: 1,
        date: new Date('04-26-2018'),
        type: '',
        payee: 'Salaries Budget Allocated',
        amount: 61020,
        verified: true
      },
      {
        id: 6,
        budgetId: 9,
        date: new Date('04-25-2018'),
        type: '',
        payee: 'Coaching Budget Increase',
        amount: 150,
        verified: true
      },
      {
        id: 7,
        budgetId: 8,
        date: new Date('02-14-2018'),
        type: '',
        payee: 'Conferences Budget Allocated',
        amount: 11050,
        verified: true
      },
      {
        id: 8,
        budgetId: 1,
        date: new Date('02-05-2018'),
        type: '',
        payee: 'Payment to FruVeg Ltd.',
        amount: 200,
        verified: false
      },
      {
        id: 9,
        budgetId: 4,
        date: new Date('10-14-2018'),
        type: '',
        payee: 'Payment to ChocoCakes Ltd.',
        amount: 110,
        verified: true
      },
      {
        id: 10,
        budgetId: 8,
        date: new Date('04-23-2018'),
        type: '',
        payee:
          'Received payment on consultancy work according to contract #231',
        amount: 50000,
        verified: true
      },
      {
        id: 11,
        budgetId: 4,
        date: new Date('12-23-2018'),
        type: '',
        payee: 'Office Food Budget Created',
        amount: 1000,
        verified: true
      },
      {
        id: 12,
        budgetId: 2,
        date: new Date('04-27-2018'),
        type: '',
        payee: 'Purchase from Office Supplies Ltd.',
        amount: 150,
        verified: true
      },
      {
        id: 13,
        budgetId: 1,
        date: new Date('04-22-2018'),
        type: '',
        payee: 'String',
        amount: 740,
        verified: true
      },
      {
        id: 14,
        budgetId: 2,
        date: new Date('09-10-2018'),
        type: '',
        payee: 'Payment to H20 supplier',
        amount: 600,
        verified: true
      },
      {
        id: 15,
        budgetId: 5,
        date: new Date('10-22-2018'),
        type: '',
        payee: 'Electricity Budget Created',
        amount: 2080,
        verified: true
      },
      {
        id: 16,
        budgetId: 1,
        date: new Date('10-09-2018'),
        type: '',
        payee: 'String',
        amount: 240,
        verified: true
      }
    ];

    const notifications = [
      {
        id: 1,
        date: new Date('04-13-2018'),
        message: 'Unallocated budget is too high'
      },
      { id: 2, date: new Date('04-11-2018'), message: 'Overspent on Water' }
    ];

    return {
      users,
      incomes,
      'total-budgets': totalBudgets,
      budgets,
      transactions,
      notifications
    };
  }
}
