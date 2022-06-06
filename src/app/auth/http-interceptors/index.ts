import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptor } from './auth-interceptor';

import { environment } from '../../../environments/environment';
import { MockBackendInterceptor } from '../../shared/mocks/mock-backend-interceptor';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  environment.production
    ? []
    : {
        provide: HTTP_INTERCEPTORS,
        useClass: MockBackendInterceptor,
        multi: true
      }
];
