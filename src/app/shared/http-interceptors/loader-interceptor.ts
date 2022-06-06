import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';

// RxJS
import { Observable, throwError } from 'rxjs';

// App
import { LoaderService } from '../services/loader.service';
import { tap, catchError, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoaderInterceptor {
  constructor(private loader: LoaderService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loader.show();

    const handle$ = next.handle(req).pipe(
      catchError(error => {
        this.loader.hide();
        return throwError(error);
      }),
      filter(event => event instanceof HttpResponse),
      tap(event => {
        this.loader.hide();
      })
    );

    return handle$;
  }
}
