import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Injectable()
export class BillingInterceptor implements HttpInterceptor {

  private toastAberto = false;

  constructor(
    private messageService: MessageService,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 402 && !this.toastAberto) {
          this.toastAberto = true;
          this.messageService.add({
            severity: 'error',
            summary: 'Assinatura pendente',
            detail: error.error?.detail ?? error.error?.message ?? 'Sua assinatura está com pagamento pendente.',
            life: 6000
          });
          this.router.navigate(['/billing']).then(() => { this.toastAberto = false; });
        }

        return throwError(() => error);
      })
    );
  }
}
