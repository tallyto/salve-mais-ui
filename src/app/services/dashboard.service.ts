import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl + '/dashboard';

  constructor(private http: HttpClient) { }

  getSummary(mes?: number, ano?: number): Observable<DashboardSummary> {
    const params: any = {};
    if (mes) params.mes = mes.toString();
    if (ano) params.ano = ano.toString();
    return this.http.get<DashboardSummary>(`${this.apiUrl}/summary`, { params });
  }

  getExpensesByCategory(mes?: number, ano?: number): Observable<CategoryExpense[]> {
    const params: any = {};
    if (mes) params.mes = mes.toString();
    if (ano) params.ano = ano.toString();
    return this.http.get<CategoryExpense[]>(`${this.apiUrl}/expenses-by-category`, { params });
  }

  getMonthlyTrendByYear(year: number): Observable<MonthlyExpense[]> {
    return this.http.get<MonthlyExpense[]>(`${this.apiUrl}/monthly-trend/year/${year}`);
  }

  getVariationData(mes?: number, ano?: number): Observable<VariationData[]> {
    // Este endpoint deve retornar dados de variação comparando o mês atual com o anterior
    // Exemplo de resposta esperada:
    // [
    //   {
    //     "metric": "Saldo Total",
    //     "currentValue": 15000.00,
    //     "previousValue": 14000.00,
    //     "variation": 1000.00,
    //     "variationPercent": 7.14,
    //     "trend": "up",
    //     "icon": "account_balance_wallet"
    //   }
    // ]
    const params: any = {};
    if (mes) params.mes = mes.toString();
    if (ano) params.ano = ano.toString();
    return this.http.get<VariationData[]>(`${this.apiUrl}/variations`, { params });
  }

  exportDashboardToExcel(mes?: number, ano?: number): Observable<Blob> {
    const params: any = {};
    if (mes) params.mes = mes.toString();
    if (ano) params.ano = ano.toString();
    
    return this.http.get(`${this.apiUrl}/export/excel`, { 
      params,
      responseType: 'blob'
    });
  }
}

