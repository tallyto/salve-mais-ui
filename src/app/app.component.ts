import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ThemeService } from './services/theme.service';
import { TenantService } from './services/tenant.service';
import { getTenantIdFromToken } from './utils/jwt.util';

@Component({
    selector: 'app-root',
    template: `<app-menu-lateral></app-menu-lateral>`,
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements OnInit {
  title = 'gestor-financeiro-ui';

  private routeTitles: { [key: string]: string } = {
    'dashboard': 'Dashboard - Salve Mais',
    'card-form': 'Gerenciar Cartões - Salve Mais',
    'categoria-form': 'Gerenciar Categorias - Salve Mais',
    'provento-form': 'Gerenciar Proventos - Salve Mais',
    'despesas-fixas': 'Débitos em Conta - Salve Mais',
    'conta-fixa-recorrente': 'Contas Fixas Recorrentes - Salve Mais',
    'despesas-recorrentes': 'Gastos Recorrentes no Cartão - Salve Mais',
    'faturas': 'Faturas - Salve Mais',
    'cartao-limites': 'Limites e Alertas - Salve Mais',
    'notificacoes': 'Notificações - Salve Mais',
    'account': 'Contas Bancárias - Salve Mais',
    'minha-conta': 'Minha Conta - Salve Mais',
    'register': 'Cadastro - Salve Mais',
    'login': 'Login - Salve Mais',
    'recuperar-senha': 'Recuperar Senha - Salve Mais',
    'redefinir-senha': 'Redefinir Senha - Salve Mais',
    'criar-usuario': 'Criar Usuário - Salve Mais',
    'relatorio-mensal': 'Relatório Mensal - Salve Mais',
    'compras-parceladas': 'Compras Parceladas - Salve Mais',
    'transacoes': 'Histórico de Transações - Salve Mais',
    'comprovantes': 'Comprovantes - Salve Mais',
    'budget-rule': 'Regra 50/30/20 - Salve Mais',
    'reserva-emergencia': 'Reserva de Emergência - Salve Mais'
  };

  constructor(
    private titleService: Title,
    private router: Router,
    private themeService: ThemeService,
    private tenantService: TenantService
  ) { }

  ngOnInit(): void {
    // Carregar tema do tenant
    this.loadTenantTheme();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navigationEnd = event as NavigationEnd;
        this.updateTitle(navigationEnd.urlAfterRedirects);
      });

    // Define o título inicial
    this.updateTitle(this.router.url);
  }

  private updateTitle(url: string): void {
    const route = url.split('/')[1] || 'dashboard';
    const title = this.routeTitles[route] || 'Salve Mais';
    this.titleService.setTitle(title);
  }

  private loadTenantTheme(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    const tenantId = getTenantIdFromToken(token);
    if (!tenantId) {
      return;
    }

    this.tenantService.getTenantById(tenantId).subscribe({
      next: (tenant) => {
        this.themeService.applyTheme(tenant);
      },
      error: (error) => {
        console.error('Error loading tenant theme:', error);
      }
    });
  }
}
