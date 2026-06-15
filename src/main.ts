import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { providePrimeNG } from 'primeng/config';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';
import { authInterceptor } from './app/services/auth.interceptor';
import { billingInterceptor } from './app/services/billing.interceptor';
import { SalveMaisTheme } from './app/primeng-theme';

registerLocaleData(localePt, 'pt-BR');
Chart.register(...registerables);

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(APP_ROUTES),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor, billingInterceptor])),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
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
