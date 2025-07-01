import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-spending-trend-chart',
  standalone: false,
  template: `
    <canvas baseChart
      [data]="lineChartData"
      [options]="lineChartOptions"
      [type]="'line'">
    </canvas>
  `,
  styles: []
})
export class SpendingTrendChartComponent implements OnInit {
  lineChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  lineChartData: ChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
      {
        label: 'Gastos 2024',
        data: [4500, 5200, 4800, 5500, 4900, 5100, 5300, 5000, 5200, 5400, 5600, 5800],
        borderColor: '#4BC0C0',
        tension: 0.3,
        fill: false
      },
      {
        label: 'Gastos 2025',
        data: [5000, 5300, 5100],
        borderColor: '#FF6384',
        tension: 0.3,
        fill: false
      }
    ]
  };

  constructor() {}

  ngOnInit(): void {}
}
