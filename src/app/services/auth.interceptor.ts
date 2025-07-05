import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TenantService } from './tenant.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tenantService: TenantService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    const tenant = this.tenantService.getTenant();
    let headers: any = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (tenant) {
      headers['X-Private-Tenant'] = tenant;
    }
    if (Object.keys(headers).length > 0) {
      const cloned = req.clone({ setHeaders: headers });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}
