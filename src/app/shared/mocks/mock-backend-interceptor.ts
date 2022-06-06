import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';

// RxJS
import { Observable, of, throwError as _throw } from 'rxjs';
import { mergeMap, materialize, delay, dematerialize } from 'rxjs/operators';

@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const users: any[] = JSON.parse(localStorage.getItem('users')) || [];

    return of(null).pipe(
      mergeMap(() => {
        // authenticate
        if (req.url.endsWith('/api/login') && req.method === 'POST') {
          // find if any user matches login credentials
          const filteredUsers = users.filter(
            user =>
              (user.email === req.body.usernameOrEmail ||
                user.userName === req.body.usernameOrEmail) &&
              user.password === req.body.password
          );

          if (filteredUsers.length !== 1) {
            return _throw('email or password is incorrect');
          }

          // if login details are valid return 200 OK with user details and fake jwt token
          const user = filteredUsers[0];
          const body = {
            profile: {
              id: user.id,
              userName: user.userName,
              email: user.email
            },
            token: 'mock-jwt-token'
          };

          return of(new HttpResponse({ status: 200, body }));
        }

        // create user
        if (req.url.endsWith('/api/register') && req.method === 'POST') {
          // get new user object from post body
          // validation
          const duplicateUser = users.some(
            user => user.email === req.body.email
          );
          if (duplicateUser) {
            return _throw(`email ${req.body.email} is already taken`);
          }

          // save new user
          const newUser = {
            ...req.body,
            id: users.length + 1,
            userName: req.body.email.split('@')[0],
            notifyIncome: true,
            notifyBudgetAllocation: false,
            notifyExpense: true,
            notifyTransfer: false,
            currency: 'USD',
            timezone: 'America/New_York'
          };

          users.push(newUser);
          localStorage.setItem('users', JSON.stringify(users));

          const body = {
            profile: {
              id: newUser.id,
              userName: newUser.userName,
              email: newUser.email
            },
            token: 'mock-jwt-token'
          };

          // respond 200 OK
          return of(new HttpResponse({ status: 200, body }));
        }

        // pass through any reqs not handled above
        return next.handle(req);
      }),
      // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
      materialize(),
      delay(250),
      dematerialize()
    );
  }
}
