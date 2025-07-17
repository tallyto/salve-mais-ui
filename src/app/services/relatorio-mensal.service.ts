import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RelatorioMensalDTO, ItemGastoFixoDTO } from '../models/relatorio-mensal.model';

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
}
