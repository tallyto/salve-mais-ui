import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NotificacaoService, ResumoNotificacoes } from './notificacao.service';
import { TenantService } from './tenant.service';
import { UsuarioService } from './usuario.service';
import { getTenantIdFromToken } from '../utils/jwt.util';

export interface UsuarioInfo {
  nome: string;
  email: string;
}

const TITULO_PADRAO = 'Salve Mais';

/**
 * Centraliza a busca de dados exibidos no menu lateral (usuário, tenant e
 * notificações), incluindo fallbacks, para manter o componente focado na UI.
 */
@Injectable({
  providedIn: 'root'
})
export class MenuInfoService {

  constructor(
    private usuarioService: UsuarioService,
    private notificacaoService: NotificacaoService,
    private tenantService: TenantService
  ) { }

  carregarInfoUsuario(): Observable<UsuarioInfo | null> {
    return this.usuarioService.getUsuarioLogado().pipe(
      map(user => ({ nome: user.nome, email: user.email })),
      catchError(() => of(this.obterInfoUsuarioDoCache()))
    );
  }

  private obterInfoUsuarioDoCache(): UsuarioInfo | null {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      return null;
    }

    try {
      const parsedInfo = JSON.parse(userInfo);
      return { nome: parsedInfo.name, email: parsedInfo.email };
    } catch (e) {
      return null;
    }
  }

  limparTenantAtual(): void {
    this.tenantService.clearCurrentTenant();
  }

  carregarTituloTenant(): Observable<string> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of(TITULO_PADRAO);
    }

    const tenantId = getTenantIdFromToken(token);
    if (!tenantId) {
      return of(TITULO_PADRAO);
    }

    return this.tenantService.getTenantById(tenantId).pipe(
      map(tenant => tenant.displayName || tenant.nome || TITULO_PADRAO),
      catchError(() => of(TITULO_PADRAO))
    );
  }

  carregarResumoNotificacoes(): Observable<ResumoNotificacoes | null> {
    return this.notificacaoService.obterResumoNotificacoes().pipe(
      catchError(() => of(null))
    );
  }

  getNotificationBadgeText(resumo: ResumoNotificacoes | null): string {
    if (!resumo || !resumo.temNotificacoes) {
      return '';
    }

    if (resumo.totalNotificacoes > 99) {
      return '99+';
    }

    return resumo.totalNotificacoes.toString();
  }

  shouldShowNotificationBadge(resumo: ResumoNotificacoes | null): boolean {
    return !!(resumo && resumo.temNotificacoes);
  }
}
