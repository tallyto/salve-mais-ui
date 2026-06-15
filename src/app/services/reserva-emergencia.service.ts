import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { HistoricoContribuicao, ReservaEmergencia, ReservaEmergenciaDetalhe, ReservaEmergenciaInput } from '@models/reserva-emergencia.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaEmergenciaService {
  private apiUrl = `${environment.apiUrl}/reserva-emergencia`;

  constructor(private http: HttpClient) { }

  listar(): Observable<ReservaEmergencia[]> {
    return this.http.get<ReservaEmergencia[]>(this.apiUrl);
  }

  obter(id: number): Observable<ReservaEmergenciaDetalhe> {
    return this.http.get<ReservaEmergenciaDetalhe>(`${this.apiUrl}/${id}`);
  }

  salvar(reserva: ReservaEmergenciaInput): Observable<ReservaEmergencia> {
    return this.http.post<ReservaEmergencia>(this.apiUrl, reserva);
  }

  atualizar(id: number, reserva: ReservaEmergenciaInput): Observable<ReservaEmergencia> {
    return this.http.put<ReservaEmergencia>(`${this.apiUrl}/${id}`, reserva);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  atualizarSaldo(id: number, valor: number): Observable<ReservaEmergencia> {
    return this.http.post<ReservaEmergencia>(`${this.apiUrl}/${id}/saldo`, valor);
  }

  calcularObjetivoAutomatico(multiplicadorDespesas: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/calcular-objetivo?multiplicadorDespesas=${multiplicadorDespesas}`);
  }

  simularTempoParaCompletar(objetivo: number, valorContribuicaoMensal: number): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/simulacao?objetivo=${objetivo}&valorContribuicaoMensal=${valorContribuicaoMensal}`
    );
  }

  contribuirParaReserva(reservaId: number, contaOrigemId: number, valor: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${reservaId}/contribuir`, {
      contaOrigemId,
      valor
    });
  }

  obterHistorico(reservaId: number): Observable<HistoricoContribuicao[]> {
    return this.http.get<HistoricoContribuicao[]>(`${this.apiUrl}/${reservaId}/historico`);
  }
}
