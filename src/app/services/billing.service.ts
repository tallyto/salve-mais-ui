import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BillingStatus } from '../models/billing-status.model';
import { Plano } from '../models/plano.model';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  private apiUrl = environment.apiUrl + '/billing';

  constructor(private http: HttpClient) { }

  getStatus(): Observable<BillingStatus> {
    return this.http.get<BillingStatus>(`${this.apiUrl}/status`);
  }

  getPlanos(): Observable<Plano[]> {
    return this.http.get<Plano[]>(`${this.apiUrl}/planos`);
  }

  assinar(planoId: string): Observable<{ checkoutUrl: string }> {
    return this.http.post<{ checkoutUrl: string }>(`${this.apiUrl}/assinar`, { planoId });
  }

  cancelar(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cancelar`);
  }
}
