import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';
import { PlanoCompra } from '../models/plano-compra.model';

@Injectable({
  providedIn: 'root'
})
export class PlanoCompraService {
  private apiUrl = environment.apiUrl + '/planos-compra';

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  listarTodos(): Observable<PlanoCompra[]> {
    return this.http.get<PlanoCompra[]>(this.apiUrl)
      .pipe(this.errorHandler.handleErrorAsObservable());
  }

  listarPorStatus(status: string): Observable<PlanoCompra[]> {
    return this.http.get<PlanoCompra[]>(`${this.apiUrl}/status/${status}`)
      .pipe(this.errorHandler.handleErrorAsObservable());
  }

  buscarPorId(id: number): Observable<PlanoCompra> {
    return this.http.get<PlanoCompra>(`${this.apiUrl}/${id}`)
      .pipe(this.errorHandler.handleErrorAsObservable());
  }

  criar(plano: PlanoCompra): Observable<PlanoCompra> {
    return this.http.post<PlanoCompra>(this.apiUrl, plano)
      .pipe(this.errorHandler.handleErrorAsObservable());
  }

  atualizar(id: number, plano: PlanoCompra): Observable<PlanoCompra> {
    return this.http.put<PlanoCompra>(`${this.apiUrl}/${id}`, plano)
      .pipe(this.errorHandler.handleErrorAsObservable());
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(this.errorHandler.handleErrorAsObservable());
  }
}
