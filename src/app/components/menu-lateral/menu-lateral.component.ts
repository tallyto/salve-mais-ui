import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import packageJson from '../../../../package.json';
import { NotificacaoService, ResumoNotificacoes } from '../../services/notificacao.service';
import { NotificationEventService } from '../../services/notification-event.service';
import { UsuarioService } from '../../services/usuario.service';
import { TenantService } from '../../services/tenant.service';
import { getTenantIdFromToken } from '../../utils/jwt.util';

export interface MenuItem {
  route: string;
  icon: string;
  label: string;
}

export interface MenuSection {
  id: string;
  title: string;
  icon: string;
  items: MenuItem[];
}

@Component({
    selector: 'app-menu-lateral',
    templateUrl: './menu-lateral.component.html',
    styleUrls: ['./menu-lateral.component.css'],
    standalone: false
})
export class MenuLateralComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  public username: string = 'Usuário';
  public userEmail: string = 'usuario@email.com';
  public appVersion: string = packageJson.version;
  public appTitle: string = 'Salve Mais';
  public isAuthenticated: boolean = false;
  public isLargeScreen: boolean = false;
  public resumoNotificacoes: ResumoNotificacoes | null = null;

  public expandedSections = new Set<string>();

  public menuSections: MenuSection[] = [
    {
      id: 'financas',
      title: 'Finanças',
      icon: 'account_balance_wallet',
      items: [
        { route: '/account', icon: 'account_balance_wallet', label: 'Contas Bancárias' },
        { route: '/provento-form', icon: 'trending_up', label: 'Receitas' },
        { route: '/reserva-emergencia', icon: 'savings', label: 'Reserva de Emergência' },
        { route: '/transacoes', icon: 'swap_horiz', label: 'Transações' },
        { route: '/categoria-form', icon: 'label', label: 'Categorias' }
      ]
    },
    {
      id: 'cartoes',
      title: 'Cartões de Crédito',
      icon: 'credit_card',
      items: [
        { route: '/cartao/form', icon: 'credit_card', label: 'Meus Cartões' },
        { route: '/cartao/faturas', icon: 'receipt', label: 'Faturas' },
        { route: '/cartao/limites', icon: 'gpp_maybe', label: 'Limites e Alertas' },
        { route: '/comprovantes', icon: 'receipt_long', label: 'Comprovantes' }
      ]
    },
    {
      id: 'despesas',
      title: 'Despesas',
      icon: 'payments',
      items: [
        { route: '/pagamentos-status', icon: 'pending_actions', label: 'Status de Pagamentos' },
        { route: '/despesas-fixas', icon: 'event_repeat', label: 'Despesas Fixas' },
        { route: '/despesas-recorrentes', icon: 'subscriptions', label: 'Assinaturas e Serviços' },
        { route: '/compras-parceladas', icon: 'shopping_cart', label: 'Compras Parceladas' },
        { route: '/compras-debito', icon: 'point_of_sale', label: 'Compras em Débito' }
      ]
    },
    {
      id: 'analises',
      title: 'Análises e Relatórios',
      icon: 'bar_chart',
      items: [
        { route: '/relatorio-mensal', icon: 'bar_chart', label: 'Relatório Mensal' },
        { route: '/comparativo-mensal', icon: 'compare_arrows', label: 'Comparativo Mensal' },
        { route: '/budget-rule', icon: 'pie_chart', label: 'Regra 50/30/20' }
      ]
    },
    {
      id: 'configuracoes',
      title: 'Configurações',
      icon: 'settings',
      items: [
        { route: '/admin-usuarios', icon: 'people', label: 'Gerenciar Usuários' },
        { route: '/notificacoes-email-config', icon: 'notifications', label: 'Notificações por Email' },
        { route: '/tenant-config', icon: 'settings', label: 'Sistema' },
        { route: '/billing', icon: 'credit_card', label: 'Plano & Cobrança' }
      ]
    }
  ];

  private routerSubscription: Subscription | null = null;
  private notificacaoEventSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private notificacaoService: NotificacaoService,
    private notificationEventService: NotificationEventService,
    private tenantService: TenantService
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
        this.expandActiveSection();
      });

    // Tentar obter informações do usuário do localStorage (se disponível)
    this.updateUserInfo();

    // Carregar tenant display name
    this.loadTenantDisplayName();

    // Carregar notificações apenas no login inicial
    this.setupNotificationUpdates();

    // Expandir a seção da rota ativa ao carregar o menu
    this.expandActiveSection();
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

  @HostListener('window:resize')
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
      // Carregar tenant display name quando autenticar
      this.loadTenantDisplayName();
      // Se não estava autenticado antes, carregar notificações
      if (!wasAuthenticated) {
        this.loadNotifications();
      }
    } else {
      // Se não estiver autenticado, limpar notificações e resetar título
      this.resumoNotificacoes = null;
      this.appTitle = 'Salve Mais';
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
          }
        }
      }
    });
  }

  toggleSection(sectionId: string): void {
    if (this.expandedSections.has(sectionId)) {
      this.expandedSections.delete(sectionId);
    } else {
      this.expandedSections.add(sectionId);
    }
  }

  isSectionExpanded(sectionId: string): boolean {
    return this.expandedSections.has(sectionId);
  }

  isSectionActive(section: MenuSection): boolean {
    return section.items.some(item => this.router.url.startsWith(item.route));
  }

  /**
   * Garante que a seção que contém a rota atual esteja sempre expandida
   */
  private expandActiveSection(): void {
    const activeSection = this.menuSections.find(section => this.isSectionActive(section));
    if (activeSection) {
      this.expandedSections.add(activeSection.id);
    }
  }

  toggleSidenav(): void {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    
    // Limpar o tenant atual da sessão, mas manter o tenant lembrado se existir
    this.tenantService.clearCurrentTenant();
    
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

  /**
   * Carrega o display name do tenant a partir do token JWT
   */
  private loadTenantDisplayName(): void {
    const token = localStorage.getItem('token');
    
    if (!token) {
      this.appTitle = 'Salve Mais';
      return;
    }

    const tenantId = getTenantIdFromToken(token);
    
    if (!tenantId) {
      this.appTitle = 'Salve Mais';
      return;
    }

    this.tenantService.getTenantById(tenantId).subscribe({
      next: (tenant) => {
        this.appTitle = tenant.displayName || tenant.nome || 'Salve Mais';
      },
      error: (error) => {
        this.appTitle = 'Salve Mais';
      }
    });
  }
}
