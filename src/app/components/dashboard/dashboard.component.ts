import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '@services/account.service';
import { ProventoService } from '@services/provento.service';
import { DashboardService, DashboardSummary, CategoryExpense, MonthlyExpense, VariationData } from '@services/dashboard.service';
import { Conta, TipoConta } from '@models/conta.model';
import { Provento } from '@models/provento.model';
import { forkJoin, of } from 'rxjs';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { GastoCartaoService } from '@services/gasto-cartao.service';
import { GastoCartao } from '@models/gasto-cartao.model';
import { catchError } from 'rxjs/operators';
import { Page } from '@models/page.model';
import { Period } from './month-year-filter/month-year-filter.component';
import { NgChartsModule } from 'ng2-charts';
import { SALVE_COMMON, SALVE_DATA, SALVE_OVERLAY } from '@shared/primeng-shared';
import { MonthYearFilterComponent } from './month-year-filter/month-year-filter.component';
import { FinancialHealthCardComponent } from './financial-health-card/financial-health-card.component';
import { ReservaEmergenciaCardComponent } from './reserva-emergencia-card/reserva-emergencia-card.component';
import { VariationTableComponent } from './variation-table/variation-table.component';
import { LimiteAlertasWidgetComponent } from '@components/shared/limite-alertas-widget.component';
import { NotificacoesWidgetComponent } from '@components/notificacoes/notificacoes-widget/notificacoes-widget.component';
import { SkeletonKpiComponent, SkeletonChartComponent } from '@components/shared';

interface Transaction {
  descricao: string;
  data: Date | string;
  valor: number;
  tipo: 'RECEITA' | 'DESPESA' | 'CARTAO';
  categoria?: {
    id: number;
    nome: string;
  };
  cartao?: {
    id: number;
    nome: string;
  };
}

interface QuickAction {
  route: string;
  icon: string;
  label: string;
  colorClass: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [
    CommonModule,
    NgChartsModule,
    ...SALVE_COMMON,
    ...SALVE_DATA,
    ...SALVE_OVERLAY,
    MonthYearFilterComponent,
    FinancialHealthCardComponent,
    ReservaEmergenciaCardComponent,
    VariationTableComponent,
    LimiteAlertasWidgetComponent,
    NotificacoesWidgetComponent,
    SkeletonKpiComponent,
    SkeletonChartComponent
  ]
})
export class DashboardComponent implements OnInit {
  accounts: Conta[] = [];
  proventos: Provento[] = [];
  totalSaldo: number = 0;
  totalReceitas: number = 0;
  totalDespesas: number = 0;
  isLoading: boolean = true;
  today: Date = new Date();

  quickActions: QuickAction[] = [
    { route: '/provento-form', icon: 'arrow-up', label: 'Nova Receita', colorClass: 'income-color' },
    { route: '/despesas/fixas', icon: 'refresh', label: 'Despesa Fixa', colorClass: 'expense-color' },
    { route: '/compras/debito', icon: 'shopping-bag', label: 'Compra Débito', colorClass: 'expense-color' },
    { route: '/compras/parceladas', icon: 'shopping-cart', label: 'Compra Parcelada', colorClass: 'expense-color' },
    { route: '/cartao/faturas', icon: 'receipt', label: 'Pagar Fatura', colorClass: 'card-color' },
    { route: '/transacoes', icon: 'arrows-h', label: 'Transações', colorClass: 'neutral-color' },
    { route: '/relatorios/mensal', icon: 'chart-bar', label: 'Relatório', colorClass: 'neutral-color' },
    { route: '/budget-rule', icon: 'chart-pie', label: 'Regra 50/30/20', colorClass: 'neutral-color' }
  ];

  // Filtros de mês e ano
  selectedMonth: number;
  selectedYear: number;

  // Dados do dashboard vindos da API
  summaryData: DashboardSummary | null = null;
  categoryData: CategoryExpense[] = [];
  monthlyTrendData: MonthlyExpense[] = [];
  variationData: VariationData[] = [];

  // Dados para compras de cartão
  comprasCartao: GastoCartao[] = [];

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
    maintainAspectRatio: true,
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
    private dashboardService: DashboardService,
    private gastoCartaoService: GastoCartaoService
  ) {
    // Inicializar filtros com mês e ano atuais
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  getSaudacao(): string {
    const hora = new Date().getHours();
    if (hora < 12) {
      return 'Bom dia';
    } else if (hora < 18) {
      return 'Boa tarde';
    }
    return 'Boa noite';
  }

  getResultadoMensal(): number {
    return this.totalReceitas - this.totalDespesas;
  }

  getExpenseRatio(): number {
    if (!this.totalReceitas) {
      return this.totalDespesas > 0 ? 100 : 0;
    }

    return (this.totalDespesas / this.totalReceitas) * 100;
  }

  getIncomeExpenseRatio(): number {
    if (!this.totalDespesas) {
      return this.totalReceitas > 0 ? this.totalReceitas : 0;
    }

    return this.totalReceitas / this.totalDespesas;
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Usando forkJoin para fazer todas as chamadas em paralelo
    forkJoin({
      summary: this.dashboardService.obterResumo(this.selectedMonth, this.selectedYear),
      categories: this.dashboardService.obterDespesasPorCategoria(this.selectedMonth, this.selectedYear),
      monthlyTrend: this.dashboardService.obterTrendMensalPorAno(this.selectedYear),
      comprasCartao: this.gastoCartaoService.listar(0, 5, 'data,desc').pipe(
        catchError(() => of({ content: [] } as unknown as Page<GastoCartao>))
      ),
      variations: this.dashboardService.obterDadosVariacao(this.selectedMonth, this.selectedYear).pipe(catchError(() => of([])))
    }).subscribe({
      next: (results) => {
        this.summaryData = results.summary;
        this.categoryData = results.categories;
        this.monthlyTrendData = results.monthlyTrend;
        this.comprasCartao = results.comprasCartao.content;
        this.variationData = results.variations || this.generateMockVariationData();

        // Definindo os valores para exibição
        this.totalSaldo = this.summaryData.saldoTotal;
        this.totalReceitas = this.summaryData.receitasMes;
        this.totalDespesas = this.summaryData.despesasMes;

        // Também carrega dados de contas para exibição no dashboard
        this.accountService.listar(0, 100, '').pipe(
          catchError(() => of({ content: [] } as unknown as Page<Conta>))
        ).subscribe({
          next: (accountPage) => {
            this.accounts = accountPage.content;

            // Gerar dados para os gráficos
            this.preparePieChartData();
            this.prepareBarChartData();
            this.prepareLineChartData();

            // Preparar transações recentes incluindo compras de cartão
            this.prepareRecentTransactions();

            this.isLoading = false;
          },
          error: () => {
            this.preparePieChartData();
            this.prepareBarChartData();
            this.prepareLineChartData();
            this.prepareRecentTransactions();
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        this.isLoading = false;

        // Em caso de erro, tenta carregar pelo menos os dados básicos
        this.loadBasicData();
      }
    });
  }

  // Método de fallback para quando a API do dashboard falha
  loadBasicData(): void {
    forkJoin({
      accounts: this.accountService.listar(0, 100, ''),
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
        this.isLoading = false;
      }
    });
  }

  calculateTotals(): void {
    this.totalSaldo = this.accounts.reduce((sum, account) => sum + account.saldo, 0);
    this.totalReceitas = this.proventos.reduce((sum, provento) => sum + provento.valor, 0);
  }

  hasCategoryData(): boolean {
    return this.categoryData.length > 0;
  }

  hasIncomeExpenseData(): boolean {
    return !!this.summaryData && (this.summaryData.receitasMes > 0 || this.summaryData.despesasMes > 0);
  }

  hasMonthlyTrendData(): boolean {
    return this.monthlyTrendData.length > 0;
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
            'rgba(37, 99, 235, 0.86)',
            'rgba(239, 68, 68, 0.86)',
            'rgba(245, 158, 11, 0.86)',
            'rgba(16, 185, 129, 0.86)',
            'rgba(124, 58, 237, 0.86)',
            'rgba(14, 165, 233, 0.86)',
            'rgba(100, 116, 139, 0.72)'
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
            backgroundColor: 'rgba(16, 185, 129, 0.82)',
          },
          {
            label: 'Despesas',
            data: [this.summaryData.despesasMes],
            backgroundColor: 'rgba(239, 68, 68, 0.82)',
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
            borderColor: 'rgba(16, 185, 129, 1)',
            backgroundColor: 'rgba(16, 185, 129, 0.16)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
          },
          {
            label: 'Despesas',
            data: despesasData,
            borderColor: 'rgba(239, 68, 68, 1)',
            backgroundColor: 'rgba(239, 68, 68, 0.14)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
          }
        ]
      };
    }
  }

  // Método para preparar as compras de cartão recentes
  prepareRecentTransactions(): void {
    // Limpar array atual
    this.recentTransactions = [];

    // Adicionar apenas compras de cartão ao array de transações recentes
    if (this.comprasCartao && this.comprasCartao.length > 0) {
      this.comprasCartao.forEach(compra => {
        this.recentTransactions.push({
          descricao: compra.descricao,
          data: compra.data,
          valor: compra.valor,
          tipo: 'CARTAO',
          categoria: compra.categoria,
          cartao: compra.cartaoCredito
        });
      });
    }

    // Ordenar por data (mais recentes primeiro)
    this.recentTransactions = this.recentTransactions
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }

  // Gera dados mock de variação se não houver dados da API
  generateMockVariationData(): VariationData[] {
    if (!this.summaryData) return [];

    const variations: VariationData[] = [];

    // Saldo Total
    const saldoVariation = this.summaryData.saldoTotal - (this.summaryData.saldoMesAnterior || 0);
    const saldoPercent = this.summaryData.saldoMesAnterior ? (saldoVariation / this.summaryData.saldoMesAnterior) * 100 : 0;
    variations.push({
      metric: 'Saldo Total',
      currentValue: this.summaryData.saldoTotal,
      previousValue: this.summaryData.saldoMesAnterior || 0,
      variation: saldoVariation,
      variationPercent: saldoPercent,
      trend: saldoVariation > 0 ? 'up' : saldoVariation < 0 ? 'down' : 'neutral',
      icon: 'account_balance_wallet'
    });

    // Receitas do Mês
    const receitasPrev = this.summaryData.receitasMesAnterior || this.summaryData.receitasMes * 0.9;
    const receitasVariation = this.summaryData.receitasMes - receitasPrev;
    const receitasPercent = receitasPrev ? (receitasVariation / receitasPrev) * 100 : 0;
    variations.push({
      metric: 'Receitas',
      currentValue: this.summaryData.receitasMes,
      previousValue: receitasPrev,
      variation: receitasVariation,
      variationPercent: receitasPercent,
      trend: receitasVariation > 0 ? 'up' : receitasVariation < 0 ? 'down' : 'neutral',
      icon: 'trending_up'
    });

    // Despesas do Mês
    const despesasPrev = this.summaryData.despesasMesAnterior || this.summaryData.despesasMes * 1.1;
    const despesasVariation = this.summaryData.despesasMes - despesasPrev;
    const despesasPercent = despesasPrev ? (despesasVariation / despesasPrev) * 100 : 0;
    variations.push({
      metric: 'Despesas',
      currentValue: this.summaryData.despesasMes,
      previousValue: despesasPrev,
      variation: despesasVariation,
      variationPercent: despesasPercent,
      trend: despesasVariation < 0 ? 'up' : despesasVariation > 0 ? 'down' : 'neutral', // Inversed because less expense is good
      icon: 'trending_down'
    });

    // Resultado Mensal (Receitas - Despesas)
    const resultadoAtual = this.summaryData.receitasMes - this.summaryData.despesasMes;
    const resultadoPrev = receitasPrev - despesasPrev;
    const resultadoVariation = resultadoAtual - resultadoPrev;
    const resultadoPercent = resultadoPrev !== 0 ? (resultadoVariation / Math.abs(resultadoPrev)) * 100 : 0;
    variations.push({
      metric: 'Resultado Mensal',
      currentValue: resultadoAtual,
      previousValue: resultadoPrev,
      variation: resultadoVariation,
      variationPercent: resultadoPercent,
      trend: resultadoVariation > 0 ? 'up' : resultadoVariation < 0 ? 'down' : 'neutral',
      icon: 'assessment'
    });

    return variations;
  }

  onPeriodChange(period: Period): void {
    this.selectedMonth = period.month;
    this.selectedYear = period.year;
    this.onFilterChange();
  }

  onFilterChange(): void {
    this.loadDashboardData();
  }

  // Método para exportar dados do dashboard para Excel
  exportToExcel(): void {
    if (!this.summaryData) {
      alert('Não há dados para exportar. Aguarde o carregamento dos dados.');
      return;
    }

    // Chama o endpoint do backend para gerar o arquivo Excel
    this.dashboardService.exportDashboardToExcel(this.selectedMonth, this.selectedYear).subscribe({
      next: (data: Blob) => {
        // Criar um link temporário para download do arquivo
        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        
        // Definir nome do arquivo baseado no período selecionado
        const monthName = new Date(this.selectedYear, this.selectedMonth - 1).toLocaleString('pt-BR', { month: 'long' });
        const fileName = `dashboard-financeiro-${monthName}-${this.selectedYear}.xlsx`;
        link.download = fileName;
        
        // Executar o download
        link.click();
        
        // Limpar o URL temporário
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        alert('Erro ao exportar dados. Tente novamente.');
      }
    });
  }
}
