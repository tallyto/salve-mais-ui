import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Conta } from '../models/conta.model';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class ContaService {
  private apiUrl = `${environment.apiUrl}/contas`;

  constructor(private http: HttpClient) { }

  getContas(): Observable<Conta[]> {
    return this.http.get<Page<Conta>>(this.apiUrl)
      .pipe(
        map(response => response.content)
      );
  }

  getConta(id: number): Observable<Conta> {
    return this.http.get<Conta>(`${this.apiUrl}/${id}`);
  }

  createConta(conta: Conta): Observable<Conta> {
    return this.http.post<Conta>(this.apiUrl, conta);
  }

  updateConta(id: number, conta: Conta): Observable<Conta> {
    return this.http.put<Conta>(`${this.apiUrl}/${id}`, conta);
  }

  deleteConta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
