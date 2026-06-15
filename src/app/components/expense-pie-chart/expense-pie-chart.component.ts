import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { Subscription } from 'rxjs';
import { Financa } from '../../models/financa.model';
import { ContasFixasService } from '../../services/financa.service';

@Component({
  selector: 'app-expense-pie-chart',
  standalone: false,
  template: `
    <canvas baseChart
      [data]="pieChartData"
      [options]="pieChartOptions"
      [type]="'pie'">
    </canvas>
  `,
  styles: []
})
export class ExpensePieChartComponent implements OnInit, OnDestroy {
  pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  pieChartData: ChartData = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF'
      ]
    }]
  };

  private subscription: Subscription = new Subscription();

  constructor(private financaService: ContasFixasService) {}

  ngOnInit(): void {
    // Busca as financas e atualiza o gráfico
    this.subscription.add(
      this.financaService.listarFinancas(0, 100, 'categoria').subscribe((response: any) => {
        const financas: Financa[] = response.content || [];
        const categoriaMap: { [key: string]: number } = {};
        financas.forEach(financa => {
          const categoria = financa.categoria?.nome || 'Outros';
          categoriaMap[categoria] = (categoriaMap[categoria] || 0) + financa.valor;
        });
        this.pieChartData = {
          labels: Object.keys(categoriaMap),
          datasets: [{
            data: Object.values(categoriaMap),
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#8BC34A',
              '#FF9800',
              '#9C27B0',
              '#00BCD4',
              '#E91E63',
              '#607D8B'
            ]
          }]
        };
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
