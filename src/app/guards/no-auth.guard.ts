import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export const noAuthGuard = (): boolean | UrlTree => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  if (token && !isTokenExpired(token)) {
    return router.createUrlTree(['/dashboard']);
  }
  return true;
};

export const NoAuthGuard = noAuthGuard;
