import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { providePrimeNG } from 'primeng/config';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

import { AppComponent } from './app/app.component';
import { AuthInterceptor } from './app/services/auth.interceptor';
import { BillingInterceptor } from './app/services/billing.interceptor';
import { SalveMaisTheme } from './app/primeng-theme';

registerLocaleData(localePt, 'pt-BR');
Chart.register(...registerables);

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: BillingInterceptor, multi: true },
    providePrimeNG({
      theme: {
        preset: SalveMaisTheme,
        options: {
          darkModeSelector: 'html.dark-mode',
          cssLayer: false
        }
      }
    }),
    MessageService,
    ConfirmationService,
    DialogService
  ]
}).catch(() => {});
