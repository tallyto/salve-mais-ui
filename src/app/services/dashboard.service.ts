import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface DashboardSummary {
  saldoTotal: number;
  receitasMes: number;
  despesasMes: number;
  totalContas: number;
  totalCategorias: number;
  saldoMesAnterior: number;
  receitasMesAnterior?: number;
  despesasMesAnterior?: number;
  reservaEmergencia?: {
    id?: number;
    objetivo?: number;
    saldoAtual?: number;
    percentualConcluido?: number;
    tempoRestante?: number;
  };
  temReservaEmergencia?: boolean;
  parcelasResumo?: {
    totalParcelasAtivas: number;
    parcelasPagasMes: number;
    parcelasNaoPagasMes: number;
    valorTotalParcelasMes: number;
    valorPagoMes: number;
    valorRestanteMes: number;
  };
}

export interface VariationData {
  metric: string;
  currentValue: number;
  previousValue: number;
  variation: number;
  variationPercent: number;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

export interface CategoryExpense {
  categoriaId: number;
  categoriaNome: string;
  valorTotal: number;
  percentual: number;
}

export interface MonthlyExpense {
  mes: string;
  data: Date;
  valorDespesas: number;
  valorReceitas: number;
}

export interface BudgetRuleData {
  necessidadesIdeal: number;
  desejosIdeal: number;
  economiaIdeal: number;
  necessidadesReal: number;
  desejosReal: number;
  economiaReal: number;
  necessidadesPercentual: number;
  desejosPercentual: number;
  economiaPercentual: number;
  necessidadesDiferenca: number;
  desejosDiferenca: number;
  economiaDiferenca: number;
  necessidadesStatus: string;
  desejosStatus: string;
  economiaStatus: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl + '/dashboard';

  constructor(private http: HttpClient) { }

  obterResumo(mes?: number, ano?: number): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/summary`, {
      params: this.buildMesAnoParams(mes, ano)
    });
  }

  obterDespesasPorCategoria(mes?: number, ano?: number): Observable<CategoryExpense[]> {
    return this.http.get<CategoryExpense[]>(`${this.apiUrl}/expenses-by-category`, {
      params: this.buildMesAnoParams(mes, ano)
    });
  }

  obterTrendMensalPorAno(year: number): Observable<MonthlyExpense[]> {
    return this.http.get<MonthlyExpense[]>(`${this.apiUrl}/monthly-trend/year/${year}`);
  }

  obterDadosVariacao(mes?: number, ano?: number): Observable<VariationData[]> {
    return this.http.get<VariationData[]>(`${this.apiUrl}/variations`, {
      params: this.buildMesAnoParams(mes, ano)
    });
  }

  exportDashboardToExcel(mes?: number, ano?: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/excel`, {
      params: this.buildMesAnoParams(mes, ano),
      responseType: 'blob'
    });
  }

  private buildMesAnoParams(mes?: number, ano?: number): Record<string, string> {
    const params: Record<string, string> = {};
    if (mes) params['mes'] = mes.toString();
    if (ano) params['ano'] = ano.toString();
    return params;
  }

  obterBudgetRule(): Observable<BudgetRuleData> {
    return this.http.get<BudgetRuleData>(`${this.apiUrl}/budget-rule`);
  }
}

