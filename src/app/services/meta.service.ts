import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';
import { Meta, MetaAtualizarProgressoDTO } from '../models/meta.model';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  private apiUrl = environment.apiUrl + '/metas';

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  listarTodas(): Observable<Meta[]> {
    return this.http.get<Meta[]>(this.apiUrl)
      .pipe(this.errorHandler.handleErrorAsObservable());
  }

  listarPorStatus(status: string): Observable<Meta[]> {
    return this.http.get<Meta[]>(`${this.apiUrl}/status/${status}`)
      .pipe(this.errorHandler.handleErrorAsObservable());
  }

  buscarPorId(id: number): Observable<Meta> {
    return this.http.get<Meta>(`${this.apiUrl}/${id}`)
      .pipe(this.errorHandler.handleErrorAsObservable());
  }

  criar(meta: Meta): Observable<Meta> {
    return this.http.post<Meta>(this.apiUrl, meta)
      .pipe(this.errorHandler.handleErrorAsObservable());
  }

  atualizar(id: number, meta: Meta): Observable<Meta> {
    return this.http.put<Meta>(`${this.apiUrl}/${id}`, meta)
      .pipe(this.errorHandler.handleErrorAsObservable());
  }

  atualizarProgresso(id: number, dto: MetaAtualizarProgressoDTO): Observable<Meta> {
    return this.http.patch<Meta>(`${this.apiUrl}/${id}/progresso`, dto)
      .pipe(this.errorHandler.handleErrorAsObservable());
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(this.errorHandler.handleErrorAsObservable());
  }
}
