import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import packageJson from '../../../../package.json';
import { ResumoNotificacoes } from '../../services/notificacao.service';
import { NotificationEventService } from '../../services/notification-event.service';
import { MenuInfoService } from '../../services/menu-info.service';

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

  // Seções abertas por padrão; o usuário pode recolher manualmente via toggleSection
  public expandedSections = new Set<string>(['financas', 'cartoes', 'despesas', 'analises', 'configuracoes']);

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
    private menuInfoService: MenuInfoService,
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
    this.menuInfoService.carregarInfoUsuario().subscribe(info => {
      if (info) {
        this.username = info.nome;
        this.userEmail = info.email;
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
    this.menuInfoService.limparTenantAtual();
    
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
    this.menuInfoService.carregarResumoNotificacoes().subscribe(resumo => {
      this.resumoNotificacoes = resumo;
    });
  }

  /**
   * Retorna o texto para exibir no badge de notificações
   */
  getNotificationBadgeText(): string {
    return this.menuInfoService.getNotificationBadgeText(this.resumoNotificacoes);
  }

  /**
   * Verifica se deve exibir o badge de notificações
   */
  shouldShowNotificationBadge(): boolean {
    return this.menuInfoService.shouldShowNotificationBadge(this.resumoNotificacoes);
  }

  getUserInitials(): string {
    const nameParts = this.username
      .split(' ')
      .map(part => part.trim())
      .filter(Boolean);

    if (nameParts.length === 0) {
      return 'US';
    }

    const initials = nameParts.length === 1
      ? nameParts[0].slice(0, 2)
      : `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;

    return initials.toUpperCase();
  }

  /**
   * Carrega o display name do tenant a partir do token JWT
   */
  private loadTenantDisplayName(): void {
    this.menuInfoService.carregarTituloTenant().subscribe(titulo => {
      this.appTitle = titulo;
    });
  }
}
