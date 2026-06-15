import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Conta } from '../models/conta.model';
import { Page } from '../models/page.model';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ContaService {
  private apiUrl = `${environment.apiUrl}/contas`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  getContas(): Observable<Conta[]> {
    return this.http.get<Page<Conta>>(this.apiUrl)
      .pipe(
        map(response => response.content),
        this.errorHandler.handleErrorAsObservable()
      );
  }

  getConta(id: number): Observable<Conta> {
    return this.http.get<Conta>(`${this.apiUrl}/${id}`)
      .pipe(
        this.errorHandler.handleErrorAsObservable()
      );
  }

  createConta(conta: Conta): Observable<Conta> {
    return this.http.post<Conta>(this.apiUrl, conta)
      .pipe(
        this.errorHandler.handleErrorAsObservable()
      );
  }

  updateConta(id: number, conta: Conta): Observable<Conta> {
    return this.http.put<Conta>(`${this.apiUrl}/${id}`, conta)
      .pipe(
        this.errorHandler.handleErrorAsObservable()
      );
  }

  deleteConta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        this.errorHandler.handleErrorAsObservable()
      );
  }
}
