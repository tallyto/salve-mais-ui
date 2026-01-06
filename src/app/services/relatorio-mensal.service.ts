import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RelatorioMensalDTO, ItemGastoFixoDTO } from '../models/relatorio-mensal.model';
import { ComparativoMensalDTO } from '../models/comparativo-mensal.model';

@Injectable({
  providedIn: 'root'
})
export class RelatorioMensalService {
  private apiUrl = environment.apiUrl + '/relatorio-mensal';

  constructor(private http: HttpClient) {}

  /**
   * Gera um relatório mensal para um ano e mês específicos
   * @param ano Ano do relatório
   * @param mes Mês do relatório (1-12)
   * @returns Observable com o relatório mensal
   */
  gerarRelatorio(ano: number, mes: number): Observable<RelatorioMensalDTO> {
    return this.http.get<RelatorioMensalDTO>(`${this.apiUrl}/${ano}/${mes}`);
  }

  /**
   * Gera um relatório mensal para o mês atual
   * @returns Observable com o relatório mensal atual
   */
  gerarRelatorioAtual(): Observable<RelatorioMensalDTO> {
    return this.http.get<RelatorioMensalDTO>(`${this.apiUrl}/atual`);
  }

  /**
   * Obtém contas fixas vencidas até uma data específica
   * @param dataReferencia Data de referência (opcional, padrão: hoje)
   * @returns Observable com lista de contas vencidas
   */
  obterContasVencidas(dataReferencia?: Date): Observable<ItemGastoFixoDTO[]> {
    let url = `${this.apiUrl}/contas-vencidas`;
    if (dataReferencia) {
      url += `?dataReferencia=${dataReferencia.toISOString().split('T')[0]}`;
    }
    return this.http.get<ItemGastoFixoDTO[]>(url);
  }

  /**
   * Gera comparativo entre dois meses
   * @param anoAnterior Ano do mês anterior
   * @param mesAnterior Mês anterior (1-12)
   * @param anoAtual Ano do mês atual
   * @param mesAtual Mês atual (1-12)
   * @returns Observable com o comparativo mensal
   */
  gerarComparativo(anoAnterior: number, mesAnterior: number, anoAtual: number, mesAtual: number): Observable<ComparativoMensalDTO> {
    return this.http.get<ComparativoMensalDTO>(`${this.apiUrl}/comparativo/${anoAnterior}/${mesAnterior}/${anoAtual}/${mesAtual}`);
  }

  /**
   * Gera comparativo entre o mês atual e o anterior
   * @returns Observable com o comparativo mensal
   */
  gerarComparativoAtual(): Observable<ComparativoMensalDTO> {
    return this.http.get<ComparativoMensalDTO>(`${this.apiUrl}/comparativo/atual`);
  }

  /**
   * Exporta o relatório mensal para Excel
   * @param ano Ano do relatório
   * @param mes Mês do relatório (1-12)
   * @returns Observable com o blob do arquivo Excel
   */
  exportarRelatorioParaExcel(ano: number, mes: number): Observable<Blob> {
    const url = `${this.apiUrl}/export/excel/${ano}/${mes}`;
    return this.http.get(url, { responseType: 'blob' });
  }
}
