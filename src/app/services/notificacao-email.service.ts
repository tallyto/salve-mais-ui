import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface NotificacaoEmailConfig {
  id?: string;
  domain: string;
  horario: string;
  ativo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificacaoEmailRequest {
  domain: string;
  horario: string;
  ativo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificacaoEmailService {
  private apiUrl = environment.apiUrl + '/notificacoes-email';

  constructor(private http: HttpClient) { }

  /**
   * Obtém a configuração de notificação por email do tenant atual
   */
  obterConfiguracao(): Observable<NotificacaoEmailConfig> {
    return this.http.get<NotificacaoEmailConfig>(this.apiUrl);
  }

  /**
   * Salva ou atualiza a configuração de notificação por email
   */
  salvarConfiguracao(config: NotificacaoEmailRequest): Observable<NotificacaoEmailConfig> {
    return this.http.post<NotificacaoEmailConfig>(this.apiUrl, config);
  }

  /**
   * Desabilita as notificações por email do tenant atual
   */
  desabilitarNotificacao(): Observable<void> {
    return this.http.delete<void>(this.apiUrl);
  }

  /**
   * Envia uma notificação de teste imediatamente
   */
  enviarNotificacaoTeste(): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/testar`, {});
  }
}
