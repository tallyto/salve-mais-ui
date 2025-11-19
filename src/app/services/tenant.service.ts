import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  Tenant, 
  TenantCadastroDTO, 
  TenantBasicInfoDTO,
  TenantSubscriptionDTO, 
  TenantSmtpConfigDTO, 
  TenantRegionalSettingsDTO 
} from '../models/tenant.model';@Injectable({ providedIn: 'root' })
export class TenantService {
  private readonly key = 'tenant';
  private apiUrl = environment.apiUrl + '/tenants';

  constructor(private http: HttpClient) {}

  setTenant(tenant: string) {
    localStorage.setItem(this.key, tenant);
  }

  getTenant(): string | null {
    return localStorage.getItem(this.key);
  }

  cadastrarTenant(data: TenantCadastroDTO): Observable<Tenant> {
    console.log('Cadastrando tenant:', data);
    return this.http.post<Tenant>(`${this.apiUrl}/cadastro`, data);
  }

  verificarTenant(token: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/verificar`, {
      params: { token }
    });
  }

  confirmarTenant(token: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/confirmar`, { token });
  }

  verificarDominioDisponivel(dominio: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verificar-dominio`, {
      params: { dominio }
    });
  }

  // Métodos de customização do tenant

  getTenantById(id: string): Observable<Tenant> {
    return this.http.get<Tenant>(`${this.apiUrl}/${id}`);
  }

  getTenantByDomain(domain: string): Observable<Tenant> {
    return this.http.get<Tenant>(`${this.apiUrl}/domain/${domain}`);
  }

  updateBasicInfo(id: string, basicInfo: TenantBasicInfoDTO): Observable<Tenant> {
    return this.http.put<Tenant>(`${this.apiUrl}/${id}/basic-info`, basicInfo);
  }

  updateSubscription(id: string, subscription: TenantSubscriptionDTO): Observable<Tenant> {
    return this.http.put<Tenant>(`${this.apiUrl}/${id}/subscription`, subscription);
  }

  updateSmtpConfig(id: string, smtpConfig: TenantSmtpConfigDTO): Observable<Tenant> {
    return this.http.put<Tenant>(`${this.apiUrl}/${id}/smtp`, smtpConfig);
  }

  updateRegionalSettings(id: string, regionalSettings: TenantRegionalSettingsDTO): Observable<Tenant> {
    return this.http.put<Tenant>(`${this.apiUrl}/${id}/regional-settings`, regionalSettings);
  }
}
