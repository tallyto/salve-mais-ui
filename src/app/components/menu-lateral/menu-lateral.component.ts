import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import packageJson from '../../../../package.json';
import { NotificacaoService, ResumoNotificacoes } from '../../services/notificacao.service';
import { NotificationEventService } from '../../services/notification-event.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css']
})
export class MenuLateralComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  public username: string = 'Usuário';
  public userEmail: string = 'usuario@email.com';
  public appVersion: string = packageJson.version;
  public isAuthenticated: boolean = false;
  public isLargeScreen: boolean = false;
  public resumoNotificacoes: ResumoNotificacoes | null = null;

  private routerSubscription: Subscription | null = null;
  private notificacaoEventSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private notificacaoService: NotificacaoService,
    private notificationEventService: NotificationEventService
  ) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    // Verificar se o usuário está autenticado
    this.checkAuthentication();

    // Verificar autenticação a cada mudança de rota
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkAuthentication();
      });

    // Tentar obter informações do usuário do localStorage (se disponível)
    this.updateUserInfo();

    // Carregar notificações apenas no login inicial
    this.setupNotificationUpdates();
  }

  ngAfterViewInit(): void {
    // Abrir o menu lateral por padrão em telas maiores apenas se autenticado
    // Movido para AfterViewInit para garantir que sidenav está disponível
    setTimeout(() => {
      if (window.innerWidth > 768 && this.isAuthenticated && this.sidenav) {
        this.sidenav.open();
      }
    });
  }

  ngOnDestroy(): void {
    // Limpar a inscrição quando o componente for destruído
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
      this.routerSubscription = null;
    }

    if (this.notificacaoEventSubscription) {
      this.notificacaoEventSubscription.unsubscribe();
      this.notificacaoEventSubscription = null;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isLargeScreen = window.innerWidth > 768;

    // Ajustar o modo do sidenav com base no tamanho da tela
    if (this.sidenav) {
      // Em telas pequenas, usar o modo 'over'
      // Em telas grandes, usar o modo 'side'
      this.sidenav.mode = this.isLargeScreen ? 'side' : 'over';

      // Abrir sidenav por padrão em telas grandes se autenticado
      if (this.isLargeScreen && this.isAuthenticated) {
        this.sidenav.open();
      } else if (!this.isLargeScreen) {
        this.sidenav.close();
      }
    }
  }

  private checkAuthentication(): void {
    const token = localStorage.getItem('token');
    const wasAuthenticated = this.isAuthenticated;
    this.isAuthenticated = !!token;

    // Se o usuário estiver autenticado, atualizar as informações do usuário
    if (this.isAuthenticated) {
      this.updateUserInfo();
      // Se não estava autenticado antes, carregar notificações
      if (!wasAuthenticated) {
        this.loadNotifications();
      }
    } else {
      // Se não estiver autenticado, limpar notificações
      this.resumoNotificacoes = null;
    }
  }

  private updateUserInfo(): void {
    // Busca do backend o nome e email reais do usuário autenticado
    this.usuarioService.getUsuarioLogado().subscribe({
      next: (user) => {
        this.username = user.nome;
        this.userEmail = user.email;
      },
      error: () => {
        // fallback para localStorage se falhar
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
          try {
            const parsedInfo = JSON.parse(userInfo);
            if (parsedInfo.name) this.username = parsedInfo.name;
            if (parsedInfo.email) this.userEmail = parsedInfo.email;
          } catch (e) {
            console.error('Erro ao processar informações do usuário', e);
          }
        }
      }
    });
  }

  toggleSidenav(): void {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    this.isAuthenticated = false;
    this.resumoNotificacoes = null;
    this.router.navigate(['/login']);
  }

  /**
   * Configura o carregamento inicial das notificações e escuta eventos de atualização
   */
  private setupNotificationUpdates(): void {
    // Carregar notificações imediatamente se autenticado
    if (this.isAuthenticated) {
      this.loadNotifications();
    }

    // Escutar eventos de atualização de notificações
    this.notificacaoEventSubscription = this.notificationEventService.notificationUpdate$
      .subscribe(() => {
        if (this.isAuthenticated) {
          this.loadNotifications();
        }
      });
  }

  /**
   * Método público para forçar atualização das notificações
   * Pode ser chamado por outros componentes quando necessário
   */
  public refreshNotifications(): void {
    if (this.isAuthenticated) {
      this.loadNotifications();
    }
  }

  /**
   * Carrega o resumo das notificações
   */
  private loadNotifications(): void {
    this.notificacaoService.obterResumoNotificacoes().subscribe({
      next: (resumo) => {
        this.resumoNotificacoes = resumo;
      },
      error: () => {
        // Em caso de erro, limpar o resumo
        this.resumoNotificacoes = null;
      }
    });
  }

  /**
   * Retorna o texto para exibir no badge de notificações
   */
  getNotificationBadgeText(): string {
    if (!this.resumoNotificacoes || !this.resumoNotificacoes.temNotificacoes) {
      return '';
    }

    if (this.resumoNotificacoes.totalNotificacoes > 99) {
      return '99+';
    }

    return this.resumoNotificacoes.totalNotificacoes.toString();
  }

  /**
   * Verifica se deve exibir o badge de notificações
   */
  shouldShowNotificationBadge(): boolean {
    return !!(this.resumoNotificacoes && this.resumoNotificacoes.temNotificacoes);
  }
}
