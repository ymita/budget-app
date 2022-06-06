import { TestBed, inject } from '@angular/core/testing';

import { MockBudgetService } from './mock-budget.service';

describe('MockBudgetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockBudgetService]
    });
  });

  it('should be created', inject([MockBudgetService], (service: MockBudgetService) => {
    expect(service).toBeTruthy();
  }));
});
