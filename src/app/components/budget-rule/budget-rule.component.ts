import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

interface BudgetRuleData {
  // Valores ideais
  necessidadesIdeal: number;
  desejosIdeal: number;
  economiaIdeal: number;
  
  // Valores reais
  necessidadesReal: number;
  desejosReal: number;
  economiaReal: number;
  
  // Percentuais
  necessidadesPercentual: number;
  desejosPercentual: number;
  economiaPercentual: number;
  
  // Diferenças
  necessidadesDiferenca: number;
  desejosDiferenca: number;
  economiaDiferenca: number;
  
  // Status
  necessidadesStatus: string;
  desejosStatus: string;
  economiaStatus: string;
}

@Component({
  selector: 'app-budget-rule',
  templateUrl: './budget-rule.component.html',
  styleUrls: ['./budget-rule.component.css'],
  standalone: true,
  imports: [CommonModule, NgChartsModule]
})
export class BudgetRuleComponent implements OnInit {
  budgetData: BudgetRuleData | null = null;
  loading = true;
  error = false;

  // Opções para o gráfico
  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 2,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: R$ ${value.toFixed(2)}`;
          }
        }
      }
    }
  };

  // Dados para o gráfico de valores ideais
  idealChartData = {
    labels: ['Necessidades (50%)', 'Desejos (30%)', 'Economia (20%)'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#4BC0C0', '#FF9800', '#9966FF']
    }]
  };

  // Dados para o gráfico de valores reais
  realChartData = {
    labels: ['Necessidades', 'Desejos', 'Economia'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#4BC0C0', '#FF9800', '#9966FF']
    }]
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchBudgetRuleData();
  }

  fetchBudgetRuleData(): void {
    this.loading = true;
    this.http.get<BudgetRuleData>(`${environment.apiUrl}/dashboard/budget-rule`)
      .subscribe({
        next: (data) => {
          this.budgetData = data;
          this.updateChartData();
          this.loading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar dados da regra 50/30/20:', err);
          this.error = true;
          this.loading = false;
        }
      });
  }

  updateChartData(): void {
    if (this.budgetData) {
      // Atualiza dados do gráfico ideal
      this.idealChartData.datasets[0].data = [
        this.budgetData.necessidadesIdeal,
        this.budgetData.desejosIdeal,
        this.budgetData.economiaIdeal
      ];

      // Atualiza dados do gráfico real
      this.realChartData.datasets[0].data = [
        this.budgetData.necessidadesReal,
        this.budgetData.desejosReal,
        this.budgetData.economiaReal
      ];
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'DENTRO_DO_LIMITE':
      case 'ACIMA_DO_OBJETIVO':
      case 'QUASE_NO_OBJETIVO':
        return 'status-success';
      case 'POUCO_ACIMA':
      case 'ABAIXO':
        return 'status-warning';
      case 'ACIMA':
      case 'MUITO_ABAIXO':
        return 'status-danger';
      case 'MUITO_ACIMA':
        return 'status-critical';
      default:
        return '';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'DENTRO_DO_LIMITE':
        return 'Dentro do limite';
      case 'POUCO_ACIMA':
        return 'Pouco acima do limite';
      case 'ACIMA':
        return 'Acima do limite';
      case 'MUITO_ACIMA':
        return 'Muito acima do limite';
      case 'ACIMA_DO_OBJETIVO':
        return 'Acima do objetivo';
      case 'QUASE_NO_OBJETIVO':
        return 'Quase no objetivo';
      case 'ABAIXO':
        return 'Abaixo do objetivo';
      case 'MUITO_ABAIXO':
        return 'Muito abaixo do objetivo';
      default:
        return status;
    }
  }

  getDiferencaText(categoria: string, diferenca: number): string {
    if (categoria === 'economia') {
      if (diferenca > 0) {
        return `Faltam R$ ${Math.abs(diferenca).toFixed(2)} para atingir o objetivo`;
      } else {
        return `R$ ${Math.abs(diferenca).toFixed(2)} acima do objetivo`;
      }
    } else {
      if (diferenca > 0) {
        return `R$ ${Math.abs(diferenca).toFixed(2)} abaixo do limite`;
      } else {
        return `R$ ${Math.abs(diferenca).toFixed(2)} acima do limite`;
      }
    }
  }

  getDiferencaClass(categoria: string, diferenca: number): string {
    if (categoria === 'economia') {
      return diferenca <= 0 ? 'text-success' : 'text-danger';
    } else {
      return diferenca >= 0 ? 'text-success' : 'text-danger';
    }
  }
}
