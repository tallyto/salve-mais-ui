import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { ProventoService } from '../../services/provento.service';
import { DashboardService, DashboardSummary, CategoryExpense, MonthlyExpense } from '../../services/dashboard.service';
import { Account } from '../../models/account.model';
import { Provento } from '../../models/provento.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  accounts: Account[] = [];
  proventos: Provento[] = [];
  totalSaldo: number = 0;
  totalReceitas: number = 0;
  totalDespesas: number = 0;
  isLoading: boolean = true;
  today: Date = new Date();
  
  // Dados do dashboard vindos da API
  summaryData: DashboardSummary | null = null;
  categoryData: CategoryExpense[] = [];
  monthlyTrendData: MonthlyExpense[] = [];

  constructor(
    private accountService: AccountService,
    private proventoService: ProventoService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    
    // Usando forkJoin para fazer todas as chamadas em paralelo
    forkJoin({
      summary: this.dashboardService.getSummary(),
      categories: this.dashboardService.getExpensesByCategory(),
      monthlyTrend: this.dashboardService.getMonthlyTrend(6)
    }).subscribe({
      next: (results) => {
        this.summaryData = results.summary;
        this.categoryData = results.categories;
        this.monthlyTrendData = results.monthlyTrend;
        
        // Definindo os valores para exibição
        this.totalSaldo = this.summaryData.saldoTotal;
        this.totalReceitas = this.summaryData.receitasMes;
        this.totalDespesas = this.summaryData.despesasMes;
        
        // Também carrega dados de contas para exibição no dashboard
        this.accountService.listarAccounts(0, 100, '').subscribe(
          accountPage => {
            this.accounts = accountPage.content;
            this.isLoading = false;
          }
        );
      },
      error: (error) => {
        console.error('Erro ao carregar dados do dashboard:', error);
        this.isLoading = false;
        
        // Em caso de erro, tenta carregar pelo menos os dados básicos
        this.loadBasicData();
      }
    });
  }
  
  // Método de fallback para quando a API do dashboard falha
  loadBasicData(): void {
    forkJoin({
      accounts: this.accountService.listarAccounts(0, 100, ''),
      proventos: this.proventoService.listarProventos(0, 100, '')
    }).subscribe({
      next: (results) => {
        this.accounts = results.accounts.content;
        // @ts-ignore
        this.proventos = results.proventos.content;
        
        this.calculateTotals();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar dados básicos:', error);
        this.isLoading = false;
      }
    });
  }

  calculateTotals(): void {
    this.totalSaldo = this.accounts.reduce((sum, account) => sum + account.saldo, 0);
    this.totalReceitas = this.proventos.reduce((sum, provento) => sum + provento.valor, 0);
  }
}
