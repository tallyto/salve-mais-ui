import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TenantService {
  private readonly key = 'tenant';

  setTenant(tenant: string) {
    localStorage.setItem(this.key, tenant);
  }

  getTenant(): string | null {
    return localStorage.getItem(this.key);
  }
}
