import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  CompraParcelada,
  CompraParceladaRequest,
  Parcela,
  ComprasParceladasPaginadas
} from '../models/compra-parcelada.model';

@Injectable({
  providedIn: 'root'
})
export class CompraParceladaService {
  private apiUrl = `${environment.apiUrl}/compras-parceladas`;

  constructor(private http: HttpClient) {}

  /**
   * Cria uma nova compra parcelada
   */
  criar(compra: CompraParceladaRequest): Observable<CompraParcelada> {
    return this.http.post<CompraParcelada>(this.apiUrl, compra);
  }

  /**
   * Lista todas as compras parceladas com paginação
   */
  listar(page: number = 0, size: number = 10): Observable<ComprasParceladasPaginadas> {
    console.log('🔧 Service: listar() chamado com page:', page, 'size:', size);
    console.log('🔧 Service: URL:', this.apiUrl);
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    console.log('🔧 Service: Params:', params.toString());
    return this.http.get<ComprasParceladasPaginadas>(this.apiUrl, { params });
  }

  /**
   * Busca uma compra parcelada por ID
   */
  buscarPorId(id: number): Observable<CompraParcelada> {
    return this.http.get<CompraParcelada>(`${this.apiUrl}/${id}`);
  }

  /**
   * Lista compras parceladas de um cartão específico
   */
  listarPorCartao(cartaoId: number, page: number = 0, size: number = 10): Observable<ComprasParceladasPaginadas> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ComprasParceladasPaginadas>(`${this.apiUrl}/cartao/${cartaoId}`, { params });
  }

  /**
   * Lista parcelas de uma compra parcelada
   */
  listarParcelas(compraId: number): Observable<Parcela[]> {
    return this.http.get<Parcela[]>(`${this.apiUrl}/${compraId}/parcelas`);
  }

  /**
   * Busca parcelas por cartão e período
   */
  buscarParcelasPorCartaoEPeriodo(
    cartaoId: number,
    dataInicio: string,
    dataFim: string
  ): Observable<Parcela[]> {
    const params = new HttpParams()
      .set('inicio', dataInicio)
      .set('fim', dataFim);
    return this.http.get<Parcela[]>(`${this.apiUrl}/parcelas/cartao/${cartaoId}`, { params });
  }

  /**
   * Marca uma parcela como paga
   */
  marcarParcelaComoPaga(parcelaId: number): Observable<Parcela> {
    return this.http.patch<Parcela>(`${this.apiUrl}/parcelas/${parcelaId}/pagar`, {});
  }

  /**
   * Desmarca uma parcela como paga
   */
  desmarcarParcelaComoPaga(parcelaId: number): Observable<Parcela> {
    return this.http.patch<Parcela>(`${this.apiUrl}/parcelas/${parcelaId}/despagar`, {});
  }

  /**
   * Lista parcelas não pagas de um cartão
   */
  listarParcelasNaoPagas(cartaoId: number): Observable<Parcela[]> {
    return this.http.get<Parcela[]>(`${this.apiUrl}/parcelas/nao-pagas/cartao/${cartaoId}`);
  }

  /**
   * Lista todas as parcelas vencidas
   */
  listarParcelasVencidas(): Observable<Parcela[]> {
    return this.http.get<Parcela[]>(`${this.apiUrl}/parcelas/vencidas`);
  }

  /**
   * Exclui uma compra parcelada
   */
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Calcula o número de parcelas restantes
   */
  calcularParcelasRestantes(parcelaInicial: number, totalParcelas: number): number {
    return totalParcelas - parcelaInicial + 1;
  }

  /**
   * Calcula o valor de cada parcela
   * Divide o valor total pelo TOTAL de parcelas (não pelas restantes)
   * Exemplo: R$ 1.803,36 em 5x começando da 3ª = R$ 1.803,36 / 5 = R$ 360,67 por parcela
   */
  calcularValorParcela(valorTotal: number, parcelaInicial: number, totalParcelas: number): number {
    return valorTotal / totalParcelas;
  }
}
