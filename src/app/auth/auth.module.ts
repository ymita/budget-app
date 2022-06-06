// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// Ignite UI for Angular
import {
  IgxButtonModule,
  IgxCardModule,
  IgxCheckboxModule,
  IgxInputGroupModule,
  IgxIconModule
} from 'igniteui-angular';

import { AuthRoutingModule } from './auth-routing.module';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

// providers
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { httpInterceptorProviders } from './http-interceptors';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,

    // Ignite UI for Angular
    IgxButtonModule,
    IgxCardModule,
    IgxCheckboxModule,
    IgxInputGroupModule,
    IgxIconModule,

    AuthRoutingModule
  ],
  declarations: [RegisterComponent, LoginComponent],
  providers: [httpInterceptorProviders]
})
export class AuthModule {}
