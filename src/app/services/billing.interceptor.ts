import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

let toastAberto = false;

export const billingInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 402 && !toastAberto) {
        toastAberto = true;
        messageService.add({
          severity: 'error',
          summary: 'Assinatura pendente',
          detail: error.error?.detail ?? error.error?.message ?? 'Sua assinatura está com pagamento pendente.',
          life: 6000
        });
        router.navigate(['/billing']).then(() => { toastAberto = false; });
      }

      return throwError(() => error);
    })
  );
};
