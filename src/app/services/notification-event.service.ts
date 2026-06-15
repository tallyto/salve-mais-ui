import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationEventService {
  private notificationUpdateSubject = new Subject<void>();

  /**
   * Observable que outros componentes podem escutar para saber quando atualizar notificações
   */
  public notificationUpdate$ = this.notificationUpdateSubject.asObservable();

  /**
   * Emite um evento para indicar que as notificações devem ser atualizadas
   * Deve ser chamado após ações que podem gerar ou remover notificações
   */
  public triggerNotificationUpdate(): void {
    this.notificationUpdateSubject.next();
  }

  /**
   * Conveniência para ser usado após operações de CRUD
   */
  public notifyAfterContaOperation(): void {
    this.triggerNotificationUpdate();
  }

  /**
   * Conveniência para ser usado após operações de fatura
   */
  public notifyAfterFaturaOperation(): void {
    this.triggerNotificationUpdate();
  }

  /**
   * Conveniência para ser usado após operações de cartão
   */
  public notifyAfterCartaoOperation(): void {
    this.triggerNotificationUpdate();
  }
}
