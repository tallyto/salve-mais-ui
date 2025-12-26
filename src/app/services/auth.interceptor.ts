import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TenantService } from './tenant.service';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private tenantService: TenantService,
    private router: Router,
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    const tenant = this.tenantService.getTenant();
    let headers: any = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // IMPORTANTE: Só adicionar o tenant do localStorage se a requisição ainda não tiver o header
    if (tenant && !req.headers.has('X-Private-Tenant')) {
      headers['X-Private-Tenant'] = tenant;
    }
    
    const clonedRequest = Object.keys(headers).length > 0 
      ? req.clone({ setHeaders: headers })
      : req;
    
    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        // Removido tratamento automático de 403 que estava impedindo recuperação de senha
        // O tratamento de erro deve ser feito nos componentes específicos
        return throwError(() => error);
      })
    );
  }
}
