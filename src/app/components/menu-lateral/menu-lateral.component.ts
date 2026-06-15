import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { MenuItem } from 'primeng/api';
import packageJson from '../../../../package.json';
import { ResumoNotificacoes } from '../../services/notificacao.service';
import { NotificationEventService } from '../../services/notification-event.service';
import { MenuInfoService } from '../../services/menu-info.service';
import { ThemeService } from '../../services/theme.service';

export interface MenuItemLink {
  route: string;
  icon: string;
  label: string;
}

export interface MenuSection {
  id: string;
  title: string;
  icon: string;
  items: MenuItemLink[];
}

@Component({
    selector: 'app-menu-lateral',
    templateUrl: './menu-lateral.component.html',
    standalone: false
})
export class MenuLateralComponent implements OnInit, OnDestroy {
  public sidenavOpen: boolean = false;
  public userMenuItems: MenuItem[] = [];

  public username: string = 'Usuário';
  public userEmail: string = 'usuario@email.com';
  public appVersion: string = packageJson.version;
  public appTitle: string = 'Salve Mais';
  public isAuthenticated: boolean = false;
  public isLargeScreen: boolean = false;
  public resumoNotificacoes: ResumoNotificacoes | null = null;

  public menuSections: MenuSection[] = [
    {
      id: 'financas',
      title: 'Finanças',
      icon: 'wallet',
      items: [
        { route: '/account', icon: 'building', label: 'Contas Bancárias' },
        { route: '/provento-form', icon: 'arrow-up', label: 'Receitas' },
        { route: '/transacoes', icon: 'arrows-h', label: 'Transações' }
      ]
    },
    {
      id: 'despesas',
      title: 'Despesas e Compras',
      icon: 'receipt',
      items: [
        { route: '/despesas-fixas', icon: 'refresh', label: 'Débitos em Conta' },
        { route: '/despesas-recorrentes', icon: 'sync', label: 'Assinaturas e Serviços' },
        { route: '/compras-debito', icon: 'shopping-bag', label: 'Compras em Débito' },
        { route: '/pagamentos-status', icon: 'clock', label: 'Status de Pagamentos' }
      ]
    },
    {
      id: 'cartoes',
      title: 'Cartões',
      icon: 'credit-card',
      items: [
        { route: '/cartao/form', icon: 'credit-card', label: 'Meus Cartões' },
        { route: '/cartao/faturas', icon: 'receipt', label: 'Faturas' },
        { route: '/cartao/limites', icon: 'shield', label: 'Limites e Alertas' },
        { route: '/compras-parceladas', icon: 'shopping-cart', label: 'Compras Parceladas' }
      ]
    },
    {
      id: 'planejamento',
      title: 'Planejamento',
      icon: 'chart-pie',
      items: [
        { route: '/reserva-emergencia', icon: 'wallet', label: 'Reserva de Emergência' },
        { route: '/budget-rule', icon: 'chart-pie', label: 'Regra 50/30/20' }
      ]
    },
    {
      id: 'analises',
      title: 'Relatórios',
      icon: 'chart-bar',
      items: [
        { route: '/relatorio-mensal', icon: 'chart-bar', label: 'Relatório Mensal' },
        { route: '/comparativo-mensal', icon: 'arrows-h', label: 'Comparativo Mensal' }
      ]
    },
    {
      id: 'configuracoes',
      title: 'Administração',
      icon: 'cog',
      items: [
        { route: '/categoria-form', icon: 'tag', label: 'Categorias' },
        { route: '/comprovantes', icon: 'file-check', label: 'Comprovantes' },
        { route: '/admin-usuarios', icon: 'users', label: 'Gerenciar Usuários' },
        { route: '/notificacoes-email-config', icon: 'bell', label: 'Notificações por Email' },
        { route: '/tenant-config', icon: 'cog', label: 'Sistema' },
        { route: '/billing', icon: 'credit-card', label: 'Plano & Cobrança' }
      ]
    }
  ];

  private routerSubscription: Subscription | null = null;
  private notificacaoEventSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private menuInfoService: MenuInfoService,
    private notificationEventService: NotificationEventService,
    public themeService: ThemeService
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

    // Inicializar menu do usuário
    this.initializeUserMenu();

    // Abrir sidebar por padrão em telas grandes se autenticado
    this.checkScreenSize();
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

    // Abrir sidebar por padrão em telas grandes se autenticado
    if (this.isLargeScreen && this.isAuthenticated) {
      this.sidenavOpen = true;
    } else if (!this.isLargeScreen) {
      this.sidenavOpen = false;
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
        // Atualizar o menu do usuário com o nome atualizado
        this.initializeUserMenu();
      }
    });
  }

  isSectionActive(section: MenuSection): boolean {
    return section.items.some(item => this.router.url.startsWith(item['route']));
  }

  /**
   * Garante que a seção que contém a rota atual esteja sempre expandida
   */
  private expandActiveSection(): void {
    // Os grupos ficam sempre visíveis; este método permanece para manter o fluxo de navegação simples.
  }

  toggleSidenav(): void {
    this.sidenavOpen = !this.sidenavOpen;
  }

  private initializeUserMenu(): void {
    this.userMenuItems = [
      {
        label: this.username,
        icon: 'pi pi-user',
        disabled: true
      },
      {
        label: 'Minha Conta',
        icon: 'pi pi-user',
        routerLink: '/minha-conta'
      },
      {
        label: 'Configurações',
        icon: 'pi pi-cog',
        routerLink: '#'
      },
      {
        separator: true
      },
      {
        label: 'Sair',
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      }
    ];
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
