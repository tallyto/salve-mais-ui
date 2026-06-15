import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: false
})
export class HomeComponent {
  currentYear = new Date().getFullYear();

  features = [
    { icon: 'pi-th-large',    title: 'Dashboard',               description: 'Visão geral das suas finanças com gráficos de receitas, despesas e evolução do saldo.' },
    { icon: 'pi-credit-card', title: 'Cartões de Crédito',      description: 'Acompanhe faturas, limites e alertas de todos os seus cartões em um painel unificado.' },
    { icon: 'pi-refresh',     title: 'Despesas Fixas',          description: 'Cadastre débitos e assinaturas recorrentes e receba alertas de vencimento.' },
    { icon: 'pi-wallet',      title: 'Reserva de Emergência',   description: 'Defina a meta, acompanhe aportes e saiba exatamente quando você chegará lá.' },
    { icon: 'pi-chart-bar',   title: 'Relatórios',              description: 'Relatórios mensais e comparativos para entender para onde vai cada real.' },
    { icon: 'pi-chart-pie',   title: 'Regra 50/30/20',         description: 'Aplique a regra de ouro do orçamento e equilibre necessidades, desejos e investimentos.' },
  ];

  constructor(private router: Router) {}

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
