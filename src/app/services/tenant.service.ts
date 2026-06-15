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
  private readonly tenantKey = 'current_tenant';
  private readonly rememberedTenantKey = 'remembered_tenant';
  private apiUrl = environment.apiUrl + '/tenants';

  constructor(private http: HttpClient) {}

  /**
   * Define o tenant atual na sessão (será perdido ao fechar o navegador)
   */
  setTenant(tenant: string) {
    sessionStorage.setItem(this.tenantKey, tenant);
  }

  /**
   * Obtém o tenant atual da sessão
   */
  getTenant(): string | null {
    return sessionStorage.getItem(this.tenantKey);
  }

  /**
   * Salva o tenant para ser lembrado posteriormente (persistente)
   */
  rememberTenant(tenant: string) {
    localStorage.setItem(this.rememberedTenantKey, tenant);
  }

  /**
   * Obtém o tenant lembrado (persistente)
   */
  getRememberedTenant(): string | null {
    return localStorage.getItem(this.rememberedTenantKey);
  }

  /**
   * Remove o tenant lembrado
   */
  forgetTenant() {
    localStorage.removeItem(this.rememberedTenantKey);
  }

  /**
   * Limpa o tenant atual da sessão
   */
  clearCurrentTenant() {
    sessionStorage.removeItem(this.tenantKey);
  }

  /**
   * Limpa todos os dados de tenant (atual e lembrado)
   */
  clearAllTenantData() {
    this.clearCurrentTenant();
    this.forgetTenant();
  }

  /**
   * Verifica se existe um tenant ativo (atual ou lembrado)
   */
  hasTenant(): boolean {
    return !!(this.getTenant() || this.getRememberedTenant());
  }

  cadastrarTenant(data: TenantCadastroDTO): Observable<Tenant> {
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
