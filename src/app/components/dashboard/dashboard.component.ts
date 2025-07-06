import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { ProventoService } from '../../services/provento.service';
import { DashboardService, DashboardSummary, CategoryExpense, MonthlyExpense } from '../../services/dashboard.service';
import { Account } from '../../models/account.model';
import { Provento } from '../../models/provento.model';
import { forkJoin } from 'rxjs';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

interface Transaction {
  descricao: string;
  data: Date;
  valor: number;
  tipo: 'RECEITA' | 'DESPESA';
  categoria?: {
    id: number;
    nome: string;
  };
}

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

  // Dados para transações recentes
  recentTransactions: Transaction[] = [];

  // Configurações para os gráficos
  // Pie Chart (Despesas por Categoria)
  pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: []
  };

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
          }
        }
      }
    }
  };

  // Bar Chart (Receitas vs Despesas)
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
          }
        }
      }
    }
  };

  // Line Chart (Tendência Mensal)
  lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: []
  };

  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
          }
        }
      }
    }
  };

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

            // Gerar dados para os gráficos
            this.preparePieChartData();
            this.prepareBarChartData();
            this.prepareLineChartData();

            // Simular transações recentes para demonstração
            this.prepareRecentTransactions();

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

  // Prepara dados para o gráfico de pizza (Despesas por Categoria)
  preparePieChartData(): void {
    if (this.categoryData.length > 0) {
      const labels = this.categoryData.map(item => item.categoriaNome);
      const data = this.categoryData.map(item => item.valorTotal);

      this.pieChartData = {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(199, 199, 199, 0.8)'
          ]
        }]
      };
    }
  }

  // Prepara dados para o gráfico de barras (Receitas vs Despesas)
  prepareBarChartData(): void {
    if (this.summaryData) {
      this.barChartData = {
        labels: ['Mês Atual'],
        datasets: [
          {
            label: 'Receitas',
            data: [this.summaryData.receitasMes],
            backgroundColor: 'rgba(75, 192, 192, 0.8)',
          },
          {
            label: 'Despesas',
            data: [this.summaryData.despesasMes],
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
          }
        ]
      };
    }
  }

  // Prepara dados para o gráfico de linha (Tendência Mensal)
  prepareLineChartData(): void {
    if (this.monthlyTrendData.length > 0) {
      // Ordenar os dados por data
      const sortedData = [...this.monthlyTrendData].sort((a, b) =>
        new Date(a.data).getTime() - new Date(b.data).getTime()
      );

      const labels = sortedData.map(item => {
        const date = new Date(item.data);
        return `${date.getMonth() + 1}/${date.getFullYear()}`;
      });

      const receitasData = sortedData.map(item => item.valorReceitas);
      const despesasData = sortedData.map(item => item.valorDespesas);

      this.lineChartData = {
        labels: labels,
        datasets: [
          {
            label: 'Receitas',
            data: receitasData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
          },
          {
            label: 'Despesas',
            data: despesasData,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
          }
        ]
      };
    }
  }

  // Método para criar transações recentes simuladas
  prepareRecentTransactions(): void {
    // Em um ambiente real, isso viria de uma API
    this.recentTransactions = [
      {
        descricao: 'Salário',
        data: new Date(2023, 10, 5),
        valor: 5000,
        tipo: 'RECEITA',
        categoria: { id: 1, nome: 'Salário' }
      },
      {
        descricao: 'Aluguel',
        data: new Date(2023, 10, 10),
        valor: 1200,
        tipo: 'DESPESA',
        categoria: { id: 2, nome: 'Moradia' }
      },
      {
        descricao: 'Supermercado',
        data: new Date(2023, 10, 15),
        valor: 450,
        tipo: 'DESPESA',
        categoria: { id: 3, nome: 'Alimentação' }
      },
      {
        descricao: 'Internet',
        data: new Date(2023, 10, 20),
        valor: 120,
        tipo: 'DESPESA',
        categoria: { id: 4, nome: 'Serviços' }
      },
      {
        descricao: 'Bônus',
        data: new Date(2023, 10, 25),
        valor: 1000,
        tipo: 'RECEITA',
        categoria: { id: 1, nome: 'Salário' }
      }
    ];
  }

  // Métodos para indicadores de saúde financeira
  getBalanceRatio(): number {
    if (!this.summaryData || this.summaryData.despesasMes === 0) {
      return 100;
    }

    // Calcula a proporção do saldo em relação às despesas mensais
    // Limitado entre 0 e 100%
    const ratio = (this.summaryData.saldoTotal / this.summaryData.despesasMes) * 100;
    return Math.min(Math.max(ratio, 0), 100);
  }

  getBalanceHealthClass(): string {
    const ratio = this.getBalanceRatio();
    if (ratio >= 75) {
      return 'health-good';
    } else if (ratio >= 50) {
      return 'health-average';
    } else if (ratio >= 25) {
      return 'health-warning';
    } else {
      return 'health-danger';
    }
  }

  getFinancialTip(): string {
    const ratio = this.getBalanceRatio();

    if (ratio >= 75) {
      return 'Sua saúde financeira está excelente! Considere investir o excedente para fazer seu dinheiro render mais.';
    } else if (ratio >= 50) {
      return 'Você está em um bom caminho. Tente aumentar sua reserva de emergência para pelo menos 6 meses de despesas.';
    } else if (ratio >= 25) {
      return 'Atenção às suas despesas. Tente reduzir gastos não essenciais para aumentar seu saldo.';
    } else {
      return 'Sua situação financeira requer atenção imediata. Considere cortar despesas e aumentar sua renda.';
    }
  }
}
