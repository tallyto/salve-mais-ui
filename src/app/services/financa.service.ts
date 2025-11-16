import {EventEmitter, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {Financa} from '../models/financa.model';
import {ContaFixa, ContaFixaRecorrente} from '../models/conta-fixa.model';
import { environment } from '../../environments/environment';
import { NotificationEventService } from './notification-event.service';

@Injectable({
  providedIn: 'root'
})
export class ContasFixasService {

  private apiUrl = environment.apiUrl + '/contas/fixas'; // substitua pela sua URL

  savedFinanca = new EventEmitter<void>();
  editingFinanca = new EventEmitter<Financa>();

  constructor(
    private http: HttpClient,
    private notificationEventService: NotificationEventService
  ) {
  }

  listarFinancas(page: number, size: number, sort: string, mes?: number, ano?: number): Observable<Financa[]> {
    let params: any = {
      page,
      size,
      sort
    };

    if (mes !== undefined) {
      params.mes = mes;
    }

    if (ano !== undefined) {
      params.ano = ano;
    }

    return this.http.get<Financa[]>(this.apiUrl, { params });
  }

  salvarFinanca(financa: Financa): Observable<Financa> {
    if (financa.id) {
      // Se tem ID, é uma atualização (PUT)
      return this.http.put<Financa>(`${this.apiUrl}/${financa.id}`, financa).pipe(
        tap(() => {
          // Notificar atualização das notificações após salvar/atualizar
          this.notificationEventService.notifyAfterContaOperation();
        })
      );
    }
    // Se não tem ID, é uma criação (POST)
    return this.http.post<Financa>(this.apiUrl, financa).pipe(
      tap(() => {
        // Notificar atualização das notificações após criar
        this.notificationEventService.notifyAfterContaOperation();
      })
    );
  }

  excluirFinanca(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        // Notificar atualização das notificações após excluir
        this.notificationEventService.notifyAfterContaOperation();
      })
    );
  }

  getFinancaById(id: number): Observable<Financa> {
    return this.http.get<Financa>(`${this.apiUrl}/${id}`);
  }

  /**
   * Cria múltiplas contas fixas recorrentes
   */
  criarContasFixasRecorrentes(contaRecorrente: ContaFixaRecorrente): Observable<ContaFixa[]> {
    return this.http.post<ContaFixa[]>(`${this.apiUrl}/recorrente`, contaRecorrente).pipe(
      tap(() => {
        // Notificar atualização das notificações após criar contas recorrentes
        this.notificationEventService.notifyAfterContaOperation();
      })
    );
  }
  
  /**
   * Marca uma conta fixa como paga e cria a transação correspondente
   */
  pagarContaFixa(contaFixaId: number, observacoes?: string): Observable<Financa> {
    let params: any = {};
    if (observacoes) {
      params.observacoes = observacoes;
    }
    
    return this.http.post<Financa>(`${this.apiUrl}/${contaFixaId}/pagar`, null, { params }).pipe(
      tap(() => {
        // Notificar atualização das notificações após pagar conta fixa
        this.notificationEventService.notifyAfterContaOperation();
      })
    );
  }
  
  /**
   * Recria uma despesa fixa para o próximo mês como não paga
   */
  recriarDespesaProximoMes(contaFixaId: number): Observable<Financa> {
    return this.http.post<Financa>(`${this.apiUrl}/${contaFixaId}/recriar-proximo-mes`, null).pipe(
      tap(() => {
        // Notificar atualização das notificações após recriar conta fixa
        this.notificationEventService.notifyAfterContaOperation();
      })
    );
  }

  /**
   * Exporta contas fixas para Excel
   */
  exportarParaExcel(mes?: number, ano?: number): Observable<Blob> {
    let params: any = {};

    if (mes !== undefined) {
      params.mes = mes;
    }

    if (ano !== undefined) {
      params.ano = ano;
    }

    return this.http.get(`${this.apiUrl}/exportar`, {
      params,
      responseType: 'blob'
    });
  }
}
