import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { RelatorioMensalService } from '@services/relatorio-mensal.service';
import { ComparativoMensalDTO, ResumoComparativoDTO, ComparativoCategoriaDTO, DestaqueMudancaDTO } from '@models/comparativo-mensal.model';
import { ChartData, ChartOptions } from 'chart.js';
import { MONTHS, generateYears } from '@shared/utils';
import { SALVE_COMMON, SALVE_FORMS, SALVE_DATA } from '@shared/primeng-shared';

@Component({
  selector: 'app-comparativo-mensal',
  templateUrl: './comparativo-mensal.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule, ...SALVE_COMMON, ...SALVE_FORMS, ...SALVE_DATA]
})
export class ComparativoMensalComponent implements OnInit {
  comparativo: ComparativoMensalDTO | null = null;
  isLoading = true;
  errorMessage = '';
  categoriaColumns = ['tendencia', 'categoria', 'valorAnterior', 'valorAtual', 'variacao', 'percentual', 'status'];

  // Filtros
  selectedMesAnterior: number;
  selectedAnoAnterior: number;
  selectedMesAtual: number;
  selectedAnoAtual: number;

  months = MONTHS;
  years: number[] = [];

  // Dados para gráficos
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: R$ ${value.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `R$ ${value}`
        }
      }
    }
  };

  constructor(private relatorioService: RelatorioMensalService) {
    const now = new Date();
    const mesAnterior = new Date(now.getFullYear(), now.getMonth() - 1);
    
    this.selectedMesAtual = now.getMonth() + 1;
    this.selectedAnoAtual = now.getFullYear();
    this.selectedMesAnterior = mesAnterior.getMonth() + 1;
    this.selectedAnoAnterior = mesAnterior.getFullYear();

    // Gerar anos (últimos 5 anos)
    const currentYear = now.getFullYear();
    for (let i = 0; i < 5; i++) {
      this.years.push(currentYear - i);
    }
  }

  ngOnInit(): void {
    this.carregarComparativo();
  }

  carregarComparativo(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.relatorioService.gerarComparativo(
      this.selectedAnoAnterior,
      this.selectedMesAnterior,
      this.selectedAnoAtual,
      this.selectedMesAtual
    ).subscribe({
      next: (data) => {
        this.comparativo = data;
        this.prepararGraficos();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar comparativo mensal';
        this.isLoading = false;
      }
    });
  }

  carregarComparativoAtual(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.relatorioService.gerarComparativoAtual().subscribe({
      next: (data) => {
        this.comparativo = data;
        const now = new Date();
        const mesAnterior = new Date(now.getFullYear(), now.getMonth() - 1);
        
        this.selectedMesAtual = now.getMonth() + 1;
        this.selectedAnoAtual = now.getFullYear();
        this.selectedMesAnterior = mesAnterior.getMonth() + 1;
        this.selectedAnoAnterior = mesAnterior.getFullYear();
        
        this.prepararGraficos();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar comparativo mensal';
        this.isLoading = false;
      }
    });
  }

  prepararGraficos(): void {
    if (!this.comparativo) return;

    const categorias = this.comparativo.categorias
      .sort((a, b) => Math.abs(b.variacao) - Math.abs(a.variacao))
      .slice(0, 10); // Top 10 categorias

    this.barChartData = {
      labels: categorias.map(c => c.categoria),
      datasets: [
        {
          label: this.getPeriodoAnteriorText(),
          data: categorias.map(c => c.valorAnterior),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: this.getPeriodoAtualText(),
          data: categorias.map(c => c.valorAtual),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    };
  }

  getStatusClass(): string {
    if (!this.comparativo) return '';
    
    switch (this.comparativo.resumoComparativo.statusGeral) {
      case 'MELHOROU': return 'status-melhorou';
      case 'PIOROU': return 'status-piorou';
      default: return 'status-estavel';
    }
  }

  getStatusIcon(): string {
    if (!this.comparativo) return '';
    
    switch (this.comparativo.resumoComparativo.statusGeral) {
      case 'MELHOROU': return 'arrow-up';
      case 'PIOROU': return 'arrow-down';
      default: return 'minus';
    }
  }

  getStatusIconClass(): string {
    if (!this.comparativo) return 'text-blue-600';

    switch (this.comparativo.resumoComparativo.statusGeral) {
      case 'MELHOROU': return 'text-green-600';
      case 'PIOROU': return 'text-red-600';
      default: return 'text-orange-600';
    }
  }

  getPeriodoAnteriorText(): string {
    return this.formatPeriodo(this.selectedMesAnterior, this.selectedAnoAnterior);
  }

  getPeriodoAtualText(): string {
    return this.formatPeriodo(this.selectedMesAtual, this.selectedAnoAtual);
  }

  private formatPeriodo(mes: number, ano: number): string {
    const mesNome = this.months.find(m => m.value === mes)?.label || '';
    return `${mesNome} de ${ano}`;
  }

  getTendenciaIcon(tendencia: string): string {
    switch (tendencia) {
      case 'AUMENTO': return 'arrow-up';
      case 'REDUCAO': return 'arrow-down';
      default: return 'minus';
    }
  }

  getTendenciaClass(tendencia: string): string {
    switch (tendencia) {
      case 'AUMENTO': return 'text-red-600';
      case 'REDUCAO': return 'text-green-600';
      default: return 'text-orange-600';
    }
  }

  getImpactoClass(impacto: string): string {
    switch (impacto) {
      case 'POSITIVO': return 'text-green-600';
      case 'NEGATIVO': return 'text-red-600';
      default: return 'text-orange-600';
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  formatPercentual(value: number): string {
    const sinal = value > 0 ? '+' : '';
    return `${sinal}${value.toFixed(2)}%`;
  }
}
