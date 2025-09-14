import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transacao, TransacaoFiltro } from '../models/transacao.model';
import { environment } from '../../environments/environment';
import { PageResponse } from '../models/page-response.model';

@Injectable({
  providedIn: 'root'
})
export class TransacaoService {
  private apiUrl = `${environment.apiUrl}/transacoes`;

  constructor(private http: HttpClient) { }

  listarTransacoes(filtro?: TransacaoFiltro, page = 0, size = 10): Observable<PageResponse<Transacao>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'data,desc');

    if (filtro) {
      if (filtro.contaId) {
        params = params.set('contaId', filtro.contaId.toString());
      }
      if (filtro.tipo) {
        params = params.set('tipo', filtro.tipo);
      }
      if (filtro.dataInicio) {
        params = params.set('dataInicio', filtro.dataInicio.toISOString());
      }
      if (filtro.dataFim) {
        params = params.set('dataFim', filtro.dataFim.toISOString());
      }
      if (filtro.categoriaId) {
        params = params.set('categoriaId', filtro.categoriaId.toString());
      }
      if (filtro.transacaoOriginalId) {
        params = params.set('transacaoOriginalId', filtro.transacaoOriginalId.toString());
      }
      if (filtro.faturaId) {
        params = params.set('faturaId', filtro.faturaId.toString());
      }
      if (filtro.contaFixaId) {
        params = params.set('contaFixaId', filtro.contaFixaId.toString());
      }
      if (filtro.proventoId) {
        params = params.set('proventoId', filtro.proventoId.toString());
      }
    }

    return this.http.get<PageResponse<Transacao>>(this.apiUrl, { params });
  }

  obterTransacao(id: number): Observable<Transacao> {
    return this.http.get<Transacao>(`${this.apiUrl}/${id}`);
  }
}