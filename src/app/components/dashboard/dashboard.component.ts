import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { ProventoService } from '../../services/provento.service';
import { DashboardService, DashboardSummary, CategoryExpense, MonthlyExpense, VariationData } from '../../services/dashboard.service';
import { Account } from '../../models/account.model';
import { Provento } from '../../models/provento.model';
import { forkJoin, of } from 'rxjs';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { GastoCartaoService } from '../../services/gasto-cartao.service';
import { GastoCartao } from '../../models/gasto-cartao.model';
import { catchError } from 'rxjs/operators';
import { Page } from '../../models/page.model';
import { CompraParceladaService } from '../../services/compra-parcelada.service';
import { CompraParcelada } from '../../models/compra-parcelada.model';

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

  // Filtros de mês e ano
  selectedMonth: number;
  selectedYear: number;
  months: { value: number, label: string }[] = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];
  years: number[] = [];

  // Dados do dashboard vindos da API
  summaryData: DashboardSummary | null = null;
  categoryData: CategoryExpense[] = [];
  monthlyTrendData: MonthlyExpense[] = [];
  variationData: VariationData[] = [];

  // Dados para compras de cartão
  comprasCartao: GastoCartao[] = [];

  // Dados para transações recentes
  recentTransactions: Transaction[] = [];

  // Dados para compras parceladas
  comprasParceladas: CompraParcelada[] = [];
  comprasParceladasCarregando: boolean = false;

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
    private dashboardService: DashboardService,
    private gastoCartaoService: GastoCartaoService,
    private compraParceladaService: CompraParceladaService
  ) {
    // Inicializar filtros com mês e ano atuais
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();

    // Gerar lista de anos (últimos 3 anos até próximos 2 anos)
    this.generateYears();
  }

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadComprasParceladas();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Usando forkJoin para fazer todas as chamadas em paralelo
    forkJoin({
      summary: this.dashboardService.getSummary(this.selectedMonth, this.selectedYear),
      categories: this.dashboardService.getExpensesByCategory(this.selectedMonth, this.selectedYear),
      monthlyTrend: this.dashboardService.getMonthlyTrendByYear(this.selectedYear),
      comprasCartao: this.gastoCartaoService.listCompras(0, 5, 'data,desc').pipe(),
      variations: this.dashboardService.getVariationData(this.selectedMonth, this.selectedYear).pipe(catchError(() => of([])))
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
        this.accountService.listarAccounts(0, 100, '').subscribe(
          accountPage => {
            this.accounts = accountPage.content;

            // Gerar dados para os gráficos
            this.preparePieChartData();
            this.prepareBarChartData();
            this.prepareLineChartData();

            // Preparar transações recentes incluindo compras de cartão
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

  // Carrega as compras parceladas ativas (não pagas)
  loadComprasParceladas(): void {
    this.comprasParceladasCarregando = true;
    // Busca as 5 compras parceladas mais recentes com parcelas não pagas
    this.compraParceladaService.listar(0, 5).subscribe({
      next: (result) => {
        // Filtra para mostrar apenas compras com parcelas não pagas
        this.comprasParceladas = result.content.filter(cp =>
          cp.parcelas?.some(p => !p.paga)
        );
        this.comprasParceladasCarregando = false;
      },
      error: (err) => {
        this.comprasParceladas = [];
        this.comprasParceladasCarregando = false;
      }
    });
  }

  calculateTotals(): void {
    this.totalSaldo = this.accounts.reduce((sum, account) => sum + account.saldo, 0);
    this.totalReceitas = this.proventos.reduce((sum, provento) => sum + provento.valor, 0);
  }

  formatarPercentual(valor: number): string {
    return valor.toFixed(1).replace('.', ',') + '%';
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
      return 'health-excellent';
    } else if (ratio >= 50) {
      return 'health-good';
    } else if (ratio >= 25) {
      return 'health-average';
    } else {
      return 'health-poor';
    }
  }

  // Métodos para a reserva de emergência
  getReservaEmergenciaHealthClass(): string {
    if (!this.summaryData || !this.summaryData.reservaEmergencia) {
      return 'health-poor';
    }
    
    const percentual = this.summaryData.reservaEmergencia.percentualConcluido || 0;
    
    if (percentual >= 75) {
      return 'health-excellent';
    } else if (percentual >= 50) {
      return 'health-good';
    } else if (percentual >= 25) {
      return 'health-average';
    } else {
      return 'health-poor';
    }
  }

  getReservaEmergenciaStatus(): string {
    if (!this.summaryData || !this.summaryData.reservaEmergencia) {
      return 'Não configurada';
    }
    
    const percentual = this.summaryData.reservaEmergencia.percentualConcluido || 0;
    
    if (percentual >= 75) {
      return 'Excelente';
    } else if (percentual >= 50) {
      return 'Boa';
    } else if (percentual >= 25) {
      return 'Em progresso';
    } else {
      return 'Inicial';
    }
  }

  getReservaEmergenciaIcon(): string {
    if (!this.summaryData || !this.summaryData.reservaEmergencia) {
      return 'sentiment_very_dissatisfied';
    }
    
    const percentual = this.summaryData.reservaEmergencia.percentualConcluido || 0;
    
    if (percentual >= 75) {
      return 'sentiment_very_satisfied';
    } else if (percentual >= 50) {
      return 'sentiment_satisfied';
    } else if (percentual >= 25) {
      return 'sentiment_dissatisfied';
    } else {
      return 'sentiment_very_dissatisfied';
    }
  }

  getReservaEmergenciaPercentual(): number {
    if (!this.summaryData || !this.summaryData.reservaEmergencia || !this.summaryData.reservaEmergencia.percentualConcluido) {
      return 0;
    }
    return this.summaryData.reservaEmergencia.percentualConcluido;
  }

  getReservaEmergenciaTempoRestante(): string {
    if (!this.summaryData || !this.summaryData.reservaEmergencia || !this.summaryData.reservaEmergencia.tempoRestante) {
      return '';
    }
    return this.summaryData.reservaEmergencia.tempoRestante.toString();
  }

  reservaEmergenciaEstaCompleta(): boolean {
    return this.getReservaEmergenciaPercentual() >= 100;
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

  getVariationTrendClass(trend: string): string {
    switch (trend) {
      case 'up': return 'trend-positive';
      case 'down': return 'trend-negative';
      default: return 'trend-neutral';
    }
  }

  getVariationIcon(trend: string): string {
    switch (trend) {
      case 'up': return 'keyboard_arrow_up';
      case 'down': return 'keyboard_arrow_down';
      default: return 'remove';
    }
  }

  // Métodos auxiliares para compras parceladas
  getProximoVencimento(compra: CompraParcelada): string {
    if (!compra.parcelas || compra.parcelas.length === 0) {
      return '-';
    }
    const parcelaNaoPaga = compra.parcelas.find(p => !p.paga);
    return parcelaNaoPaga ? parcelaNaoPaga.dataVencimento : '-';
  }

  temParcelasPendentes(compra: CompraParcelada): boolean {
    if (!compra.parcelas || compra.parcelas.length === 0) {
      return false;
    }
    return compra.parcelas.some(p => !p.paga);
  }

  getStatusCompra(compra: CompraParcelada): string {
    return this.temParcelasPendentes(compra) ? 'Em aberto' : 'Quitada';
  }

  getStatusClass(compra: CompraParcelada): string {
    return this.temParcelasPendentes(compra) ? 'badge-warning' : 'badge-success';
  }

  // Métodos para filtros de mês e ano
  generateYears(): void {
    const currentYear = new Date().getFullYear();
    this.years = [];
    for (let i = currentYear - 3; i <= currentYear + 2; i++) {
      this.years.push(i);
    }
  }

  previousMonth(): void {
    if (this.selectedMonth === 1) {
      this.selectedMonth = 12;
      this.selectedYear--;
    } else {
      this.selectedMonth--;
    }
    this.onFilterChange();
  }

  nextMonth(): void {
    if (this.selectedMonth === 12) {
      this.selectedMonth = 1;
      this.selectedYear++;
    } else {
      this.selectedMonth++;
    }
    this.onFilterChange();
  }

  resetFilters(): void {
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();
    this.onFilterChange();
  }

  setLastMonth(): void {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    this.selectedMonth = lastMonth.getMonth() + 1;
    this.selectedYear = lastMonth.getFullYear();
    this.onFilterChange();
  }

  setNextMonth(): void {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    this.selectedMonth = nextMonth.getMonth() + 1;
    this.selectedYear = nextMonth.getFullYear();
    this.onFilterChange();
  }

  isCurrentMonth(): boolean {
    const currentDate = new Date();
    return this.selectedMonth === currentDate.getMonth() + 1 && this.selectedYear === currentDate.getFullYear();
  }

  isLastMonth(): boolean {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return this.selectedMonth === lastMonth.getMonth() + 1 && this.selectedYear === lastMonth.getFullYear();
  }

  isNextMonth(): boolean {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return this.selectedMonth === nextMonth.getMonth() + 1 && this.selectedYear === nextMonth.getFullYear();
  }

  getSelectedPeriodText(): string {
    const monthName = this.months.find(m => m.value === this.selectedMonth)?.label || '';
    return `${monthName} de ${this.selectedYear}`;
  }

  onFilterChange(): void {
    this.loadDashboardData();
    this.loadComprasParceladas();
  }
}
