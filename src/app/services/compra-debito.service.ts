import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CompraDebito, CompraDebitoInput } from '../models/compra-debito.model';

@Injectable({
  providedIn: 'root'
})
export class CompraDebitoService {
  private apiUrl = `${environment.apiUrl}/compras/debito`;

  constructor(private http: HttpClient) { }

  criarCompraDebito(compraDebito: CompraDebitoInput): Observable<CompraDebito> {
    return this.http.post<CompraDebito>(this.apiUrl, compraDebito);
  }

  listarCompras(page: number, size: number, mes?: number, ano?: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (mes !== undefined && ano !== undefined) {
      params = params.set('mes', mes.toString()).set('ano', ano.toString());
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  buscarCompraPorId(id: number): Observable<CompraDebito> {
    return this.http.get<CompraDebito>(`${this.apiUrl}/${id}`);
  }

  atualizarCompraDebito(id: number, compraDebito: CompraDebitoInput): Observable<CompraDebito> {
    return this.http.put<CompraDebito>(`${this.apiUrl}/${id}`, compraDebito);
  }

  excluirCompraDebito(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  listarComprasPorCategoria(categoriaId: number): Observable<CompraDebito[]> {
    return this.http.get<CompraDebito[]>(`${this.apiUrl}/categoria/${categoriaId}`);
  }

  calcularTotalPorPeriodo(dataInicio: string, dataFim: string): Observable<number> {
    const params = new HttpParams()
      .set('dataInicio', dataInicio)
      .set('dataFim', dataFim);
    
    return this.http.get<number>(`${this.apiUrl}/total`, { params });
  }
}
