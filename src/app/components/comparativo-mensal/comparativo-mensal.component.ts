import { Component, OnInit } from '@angular/core';
import { RelatorioMensalService } from '../../services/relatorio-mensal.service';
import { ComparativoMensalDTO, ResumoComparativoDTO, ComparativoCategoriaDTO, DestaqueMudancaDTO } from '../../models/comparativo-mensal.model';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-comparativo-mensal',
  templateUrl: './comparativo-mensal.component.html',
  styleUrls: ['./comparativo-mensal.component.css'],
  standalone: false
})
export class ComparativoMensalComponent implements OnInit {
  comparativo: ComparativoMensalDTO | null = null;
  isLoading = true;
  errorMessage = '';

  // Filtros
  selectedMesAnterior: number;
  selectedAnoAnterior: number;
  selectedMesAtual: number;
  selectedAnoAtual: number;

  months = [
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
        console.error('Erro ao carregar comparativo:', error);
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
        console.error('Erro ao carregar comparativo:', error);
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
          label: this.comparativo.mesAnterior,
          data: categorias.map(c => c.valorAnterior),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: this.comparativo.mesAtual,
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
      case 'MELHOROU': return '📈';
      case 'PIOROU': return '📉';
      default: return '➡️';
    }
  }

  getTendenciaIcon(tendencia: string): string {
    switch (tendencia) {
      case 'AUMENTO': return '🔴';
      case 'REDUCAO': return '🟢';
      default: return '⚪';
    }
  }

  getImpactoClass(impacto: string): string {
    switch (impacto) {
      case 'POSITIVO': return 'impacto-positivo';
      case 'NEGATIVO': return 'impacto-negativo';
      default: return 'impacto-neutro';
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
