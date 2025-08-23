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

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/summary`);
  }

  getExpensesByCategory(): Observable<CategoryExpense[]> {
    return this.http.get<CategoryExpense[]>(`${this.apiUrl}/expenses-by-category`);
  }

  getMonthlyTrendByYear(year: number): Observable<MonthlyExpense[]> {
    return this.http.get<MonthlyExpense[]>(`${this.apiUrl}/monthly-trend/year/${year}`);
  }

  getVariationData(): Observable<VariationData[]> {
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
    return this.http.get<VariationData[]>(`${this.apiUrl}/variations`);
  }
}

