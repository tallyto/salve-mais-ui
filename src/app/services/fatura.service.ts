import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {Fatura, FaturaManualDTO, FaturaResponseDTO} from "../models/fatura.model";
import { environment } from '../../environments/environment';
import { NotificationEventService } from './notification-event.service';

@Injectable({
  providedIn: 'root'
})
export class FaturaService {

 private apiUrl = environment.apiUrl + '/faturas'

  constructor(
    private http: HttpClient,
    private notificationEventService: NotificationEventService
  ) {

  }

  public listarFaturas(): Observable<Fatura[]> {
    return this.http.get<Fatura[]>(this.apiUrl)
  }

  public listarFaturasNovas(): Observable<FaturaResponseDTO[]> {
    return this.http.get<FaturaResponseDTO[]>(this.apiUrl);
  }

  public buscarFatura(id: number): Observable<FaturaResponseDTO> {
    return this.http.get<FaturaResponseDTO>(`${this.apiUrl}/${id}`);
  }

  public criarFaturaManual(fatura: FaturaManualDTO): Observable<FaturaResponseDTO> {
    return this.http.post<FaturaResponseDTO>(`${this.apiUrl}/manual`, fatura).pipe(
      tap(() => {
        // Notificar atualização das notificações após criar fatura
        this.notificationEventService.notifyAfterFaturaOperation();
      })
    );
  }

  public gerarFaturaAutomatica(cartaoCreditoId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/gerar/${cartaoCreditoId}`, {}).pipe(
      tap(() => {
        // Notificar atualização das notificações após gerar fatura
        this.notificationEventService.notifyAfterFaturaOperation();
      })
    );
  }

  public marcarComoPaga(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/pagar`, {}).pipe(
      tap(() => {
        // Notificar atualização das notificações após marcar como paga
        this.notificationEventService.notifyAfterFaturaOperation();
      })
    );
  }

  public pagarFaturaComConta(faturaId: number, contaId: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${faturaId}/pagar/${contaId}`, {});
  }

  public listarFaturasPendentes(): Observable<FaturaResponseDTO[]> {
    return this.http.get<FaturaResponseDTO[]>(`${this.apiUrl}/pendentes`);
  }

  public listarFaturasPorConta(contaId: number): Observable<FaturaResponseDTO[]> {
    return this.http.get<FaturaResponseDTO[]>(`${this.apiUrl}/conta/${contaId}`);
  }

  public excluirFatura(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Métodos legados mantidos para compatibilidade
  public criarFatura(cardId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${cardId}`, {});
  }

  public pagarFatura(faturaId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/pagar/${faturaId}`, {});
  }
}
