import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Cartao, CartaoLimiteDTO, CartaoLimiteStatusDTO} from "../models/cartao.model";
import {Observable, tap} from "rxjs";
import { environment } from '../../environments/environment';
import { NotificationEventService } from './notification-event.service';

@Injectable({
  providedIn: 'root'
})
export class CartaoService {

  private apiUrl = environment.apiUrl + '/cartao-credito'

  constructor(
    private http: HttpClient,
    private notificationEventService: NotificationEventService
  ) {

  }

  salvarCartao(cartao: Cartao): Observable<Cartao> {
    return this.http.post<Cartao>(this.apiUrl, cartao).pipe(
      tap(() => {
        // Notificar atualização das notificações após salvar cartão
        this.notificationEventService.notifyAfterCartaoOperation();
      })
    );
  }

  listarCartoes(): Observable<Cartao[]> {
    return this.http.get<Cartao[]>(this.apiUrl)
  }

  excluirCartao(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        // Notificar atualização das notificações após excluir cartão
        this.notificationEventService.notifyAfterCartaoOperation();
      })
    );
  }

  // ===== MÉTODOS PARA SISTEMA DE LIMITES =====

  configurarLimite(cartaoId: number, limite: CartaoLimiteDTO): Observable<Cartao> {
    return this.http.put<Cartao>(`${this.apiUrl}/${cartaoId}/limite`, limite);
  }

  verificarStatusLimite(cartaoId: number): Observable<CartaoLimiteStatusDTO> {
    return this.http.get<CartaoLimiteStatusDTO>(`${this.apiUrl}/${cartaoId}/limite/status`);
  }

  listarStatusLimiteTodos(): Observable<CartaoLimiteStatusDTO[]> {
    return this.http.get<CartaoLimiteStatusDTO[]>(`${this.apiUrl}/limite/status`);
  }

  verificarAlertas(): Observable<CartaoLimiteStatusDTO[]> {
    return this.http.get<CartaoLimiteStatusDTO[]>(`${this.apiUrl}/limite/alertas`);
  }

  calcularLimiteDisponivel(cartaoId: number): Observable<{limiteDisponivel: number}> {
    return this.http.get<{limiteDisponivel: number}>(`${this.apiUrl}/${cartaoId}/limite/disponivel`);
  }

  verificarCompra(cartaoId: number, valor: number): Observable<{podeRealizar: boolean, valorCompra: number, limiteDisponivel: number}> {
    return this.http.post<{podeRealizar: boolean, valorCompra: number, limiteDisponivel: number}>(`${this.apiUrl}/${cartaoId}/limite/verificar-compra`, {valor});
  }
}
