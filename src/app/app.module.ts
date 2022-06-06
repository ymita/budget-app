// Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

// Ignite UI for Angular
import {
  IgxIconModule,
  IgxNavbarModule,
  IgxNavigationDrawerModule
} from 'igniteui-angular';

// My modules
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { httpInterceptorProviders } from './shared/http-interceptors';

// Environment
import { environment } from '../environments/environment';

// Mock
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { MockBudgetService } from './shared/mocks/mock-budget.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    // Angular modules
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    // Ignite UI for Angular modules
    IgxIconModule,
    IgxNavbarModule,
    IgxNavigationDrawerModule,

    // My modules
    AppRoutingModule,
    AuthModule,
    SharedModule,

    // Mock mdules
    environment.production
      ? []
      : HttpClientInMemoryWebApiModule.forRoot(MockBudgetService, {
          delay: 250,
          // https://github.com/angular/in-memory-web-api/blob/master/src/in-mem/interfaces.ts#L85
          put204: false
        })
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule {}
