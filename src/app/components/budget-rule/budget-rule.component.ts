import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
  imports: [CommonModule, NgChartsModule, MatIconModule, MatProgressSpinnerModule]
})
export class BudgetRuleComponent implements OnInit {
  budgetData: BudgetRuleData | null = null;
  loading = true;
  error = false;

    // Opções para o gráfico
  chartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    },
    animations: {
      colors: {
        type: 'color',
        duration: 1000,
        easing: 'easeInOutQuart'
      }
    },
    transitions: {
      active: {
        animation: {
          duration: 300
        }
      }
    },
    layout: {
      padding: 10
    },
    plugins: {
      legend: {
        position: 'bottom',
        display: true,
        labels: {
          boxWidth: 12,
          padding: 10,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const dataIndex = context.dataIndex;

            // Extrai a porcentagem se ela estiver incluída no label (formato: "Label (XX%)")
            let percentage = '';
            const matches = label.match(/\((\d+)%\)/);
            if (matches && matches.length > 1) {
              percentage = matches[1];
            } else {
              // Caso não tenha porcentagem no label, calcula com base no total do gráfico
              const total = context.chart.getDatasetMeta(0).total || 0;
              percentage = total > 0 ? Math.round((context.raw / total) * 100).toString() : '0';
            }

            // Se for o gráfico de distribuição real, mostre os valores reais
            if (label.includes('Necessidades') || label.includes('Desejos') || label.includes('Economia')) {
              // Verifica se o label contém alguma indicação de porcentagem, que significa que é o gráfico real
              if (this.realValues[dataIndex] !== undefined && matches) {
                return `${label.split(' (')[0]}: R$ ${this.realValues[dataIndex].toFixed(2)} (${percentage}%)`;
              }
            }

            // Para outros casos ou gráfico ideal, mostre o valor do gráfico
            return `${label.split(' (')[0]}: R$ ${context.raw.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Dados para o gráfico de valores ideais
  idealChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Necessidades (50%)', 'Desejos (30%)', 'Economia (20%)'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#4BC0C0', '#FF9800', '#9966FF']
    }]
  };

  // Dados para o gráfico de valores reais
  realChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Necessidades', 'Desejos', 'Economia'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#4BC0C0', '#FF9800', '#9966FF']
    }]
  };

  // Valores reais para referência nos tooltips
  private realValues = [0, 0, 0];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Inicializa os gráficos com valores padrão para evitar o redimensionamento
    this.initializeChartData();
    this.fetchBudgetRuleData();
  }

  // Inicializa os dados dos gráficos com valores dummy para dimensões consistentes
  initializeChartData(): void {
    // Valores default para manter proporções consistentes durante o carregamento
    const defaultValues = [50, 30, 20];

    // Atualiza dados do gráfico ideal com valores padrão
    this.idealChartData.datasets[0].data = defaultValues;

    // Atualiza dados do gráfico real com os mesmos valores para manter consistência
    this.realChartData.datasets[0].data = defaultValues;
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

      // Usa os percentuais calculados pela API para o gráfico real
      // Esses percentuais já levam em consideração o total da renda
      const necessidadesPercent = Math.round(this.budgetData.necessidadesPercentual);
      const desejosPercent = Math.round(this.budgetData.desejosPercentual);
      const economiaPercent = Math.round(this.budgetData.economiaPercentual);

      // Atualiza os labels com as porcentagens
      this.realChartData.labels = [
        `Necessidades (${necessidadesPercent}%)`,
        `Desejos (${desejosPercent}%)`,
        `Economia (${economiaPercent}%)`
      ];

      // Atualiza dados do gráfico real
      // Usando os percentuais para o tamanho das fatias do gráfico para representação visual correta
      this.realChartData.datasets[0].data = [
        this.budgetData.necessidadesPercentual,
        this.budgetData.desejosPercentual,
        this.budgetData.economiaPercentual
      ];

      // Armazena os valores reais para uso nos tooltips
      this.realValues = [
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
