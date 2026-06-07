import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class BillingInterceptor implements HttpInterceptor {

  private toastAberto = false;

  constructor(
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 402 && !this.toastAberto) {
          this.toastAberto = true;
          const ref = this.snackBar.open(
            error.error?.detail ?? error.error?.message ?? 'Sua assinatura está com pagamento pendente.',
            'Regularizar',
            { panelClass: ['error-snackbar'], horizontalPosition: 'right', verticalPosition: 'top' }
          );

          ref.onAction().subscribe(() => this.router.navigate(['/billing']));
          ref.afterDismissed().subscribe(() => this.toastAberto = false);
        }

        return throwError(() => error);
      })
    );
  }
}
