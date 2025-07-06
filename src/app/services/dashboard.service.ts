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

  getMonthlyTrend(months: number = 6): Observable<MonthlyExpense[]> {
    return this.http.get<MonthlyExpense[]>(`${this.apiUrl}/monthly-trend`, {
      params: { months: months.toString() }
    });
  }
}
