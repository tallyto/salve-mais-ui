import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

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
    'despesas-fixas': 'Despesas Fixas - Salve Mais',
    'conta-fixa-recorrente': 'Contas Fixas Recorrentes - Salve Mais',
    'despesas-recorrentes': 'Despesas Recorrentes - Salve Mais',
    'faturas': 'Faturas - Salve Mais',
    'cartao-limites': 'Limites do Cartão - Salve Mais',
    'notificacoes': 'Notificações - Salve Mais',
    'account': 'Contas - Salve Mais',
    'minha-conta': 'Minha Conta - Salve Mais',
    'register': 'Cadastro - Salve Mais',
    'login': 'Login - Salve Mais',
    'recuperar-senha': 'Recuperar Senha - Salve Mais',
    'redefinir-senha': 'Redefinir Senha - Salve Mais',
    'criar-usuario': 'Criar Usuário - Salve Mais',
    'relatorio-mensal': 'Relatório Mensal - Salve Mais'
  };

  constructor(
    private titleService: Title,
    private router: Router
  ) { }

  ngOnInit(): void {
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
