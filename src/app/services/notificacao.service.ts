import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface NotificacaoDTO {
  tipo: string;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  titulo: string;
  mensagem: string;
  entidadeId: number;
  tipoEntidade: string;
  diasDiferenca: number;
}

export interface ResumoNotificacoes {
  totalNotificacoes: number;
  notificacoesCriticas: number;
  notificacoesAltas: number;
  contasAtrasadas: number;
  faturasAtrasadas: number;
  temNotificacoes: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {
  private apiUrl = environment.apiUrl + '/notificacoes';

  constructor(private http: HttpClient) { }

  /**
   * Obtém todas as notificações
   */
  obterNotificacoes(): Observable<NotificacaoDTO[]> {
    return this.http.get<NotificacaoDTO[]>(this.apiUrl);
  }

  /**
   * Obtém apenas contas atrasadas
   */
  obterContasAtrasadas(): Observable<NotificacaoDTO[]> {
    return this.http.get<NotificacaoDTO[]>(`${this.apiUrl}/contas-atrasadas`);
  }

  /**
   * Obtém contas próximas ao vencimento
   */
  obterContasProximasVencimento(): Observable<NotificacaoDTO[]> {
    return this.http.get<NotificacaoDTO[]>(`${this.apiUrl}/contas-proximas-vencimento`);
  }

  /**
   * Obtém faturas atrasadas
   */
  obterFaturasAtrasadas(): Observable<NotificacaoDTO[]> {
    return this.http.get<NotificacaoDTO[]>(`${this.apiUrl}/faturas-atrasadas`);
  }

  /**
   * Obtém resumo de notificações
   */
  obterResumoNotificacoes(): Observable<ResumoNotificacoes> {
    return this.http.get<ResumoNotificacoes>(`${this.apiUrl}/resumo`);
  }

  /**
   * Retorna a cor correspondente à prioridade
   */
  getCorPrioridade(prioridade: string): string {
    switch (prioridade) {
      case 'CRITICA':
        return '#d32f2f'; // Vermelho escuro
      case 'ALTA':
        return '#f44336'; // Vermelho
      case 'MEDIA':
        return '#ff9800'; // Laranja
      case 'BAIXA':
        return '#4caf50'; // Verde
      default:
        return '#757575'; // Cinza
    }
  }

  /**
   * Retorna o ícone correspondente ao tipo de notificação
   */
  getIconeTipo(tipo: string): string {
    switch (tipo) {
      case 'CONTA_ATRASADA':
        return 'warning';
      case 'CONTA_PROXIMA_VENCIMENTO':
        return 'schedule';
      case 'FATURA_ATRASADA':
        return 'credit_card_off';
      case 'FATURA_PROXIMA_VENCIMENTO':
        return 'credit_card';
      default:
        return 'notifications';
    }
  }
}
