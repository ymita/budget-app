// RxJS
import { Observable, BehaviorSubject } from 'rxjs';
import { pluck, distinctUntilChanged } from 'rxjs/operators';

// App
import { State } from './state';

const state: State = {
  totalBudget: undefined,
  budgets: undefined,
  transactions: undefined,
  incomes: undefined,
  user: undefined,
  notifications: undefined
};

export class Store {
  private subject = new BehaviorSubject<State>(state);

  private store = this.subject.asObservable().pipe(distinctUntilChanged());

  get value() {
    return this.subject.value;
  }

  set(name: string, state: any) {
    this.subject.next({ ...this.value, [name]: state });
  }

  select<T>(name: string): Observable<T> {
    return this.store.pipe(pluck(name));
  }
}
