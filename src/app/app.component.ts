import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { ThemeService } from '@services/theme.service';
import { filter } from 'rxjs/operators';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuLateralComponent } from '@components/shell/menu-lateral/menu-lateral.component';
import { AppRoutingModule } from './app-routing.module';

@Component({
    selector: 'app-root',
    template: `<p-toast></p-toast><p-confirmdialog></p-confirmdialog><app-menu-lateral></app-menu-lateral>`,
    standalone: true,
    imports: [ToastModule, ConfirmDialogModule, MenuLateralComponent, AppRoutingModule]
})
export class AppComponent implements OnInit {
  title = 'gestor-financeiro-ui';

  private routeTitles: { [key: string]: string } = {
    'dashboard': 'Dashboard - Salve Mais',
    'cartao/form': 'Gerenciar Cartões - Salve Mais',
    'categoria-form': 'Gerenciar Categorias - Salve Mais',
    'provento-form': 'Gerenciar Proventos - Salve Mais',
    'despesas-fixas': 'Débitos em Conta - Salve Mais',
    'conta-fixa-recorrente': 'Contas Fixas Recorrentes - Salve Mais',
    'despesas-recorrentes': 'Gastos Recorrentes no Cartão - Salve Mais',
    'cartao/faturas': 'Faturas - Salve Mais',
    'cartao/limites': 'Limites e Alertas - Salve Mais',
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
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.themeService.init();
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
}
