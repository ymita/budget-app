import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private counter = 0;

  private _loaderState = new BehaviorSubject<boolean>(false);

  loaderState$ = this._loaderState.asObservable();

  constructor() {}

  show() {
    this.counter++;
    if (this.counter === 1) {
      this._loaderState.next(true);
    }
    console.log('show', this.counter);
  }

  hide(delay = 500) {
    this.counter--;
    if (this.counter <= 0) {
      this.counter = 0;
      setTimeout(() => this._loaderState.next(false), delay);
    }
    console.log('hide', this.counter);
  }
}
