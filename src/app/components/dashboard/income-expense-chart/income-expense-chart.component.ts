import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { Subscription } from 'rxjs';

import { Financa } from '@models/financa.model';
import { Provento } from '@models/provento.model';
import { ContasFixasService } from '@services/contas-fixas.service';
import { ProventoService } from '@services/provento.service';

interface ProventoResponse {
  content?: Provento[];
}

interface FinancaResponse {
  content?: Financa[];
}

@Component({
  selector: 'app-income-expense-chart',
  standalone: true,
  imports: [NgChartsModule],
  template: `
    <canvas baseChart
      [data]="barChartData"
      [options]="barChartOptions"
      [type]="'bar'">
    </canvas>
  `,
  styles: []
})
export class IncomeExpenseChartComponent implements OnInit, OnDestroy {
  barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  barChartData: ChartData = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
    datasets: [
      {
        label: 'Receitas',
        data: [6000, 6000, 6000, 6500, 6500, 7000],
        backgroundColor: '#36A2EB'
      },
      {
        label: 'Despesas',
        data: [4500, 5200, 4800, 5500, 4900, 5100],
        backgroundColor: '#FF6384'
      }
    ]
  };

  private subscription: Subscription = new Subscription();

  constructor(
    private proventoService: ProventoService,
    private financaService: ContasFixasService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.proventoService.listarProventos(0, 100, 'data').subscribe((proventosResponse: ProventoResponse) => {
        const proventos: Provento[] = proventosResponse.content || [];
        this.subscription.add(
          this.financaService.listarFinancas(0, 100, 'vencimento').subscribe((financasResponse: FinancaResponse) => {
            const financas: Financa[] = financasResponse.content || [];
            const meses = [
              'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
              'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ];
            const receitasPorMes: number[] = Array(12).fill(0);
            const despesasPorMes: number[] = Array(12).fill(0);
            proventos.forEach(provento => {
              const data = new Date(provento.data);
              receitasPorMes[data.getMonth()] += provento.valor;
            });
            financas.forEach(financa => {
              const data = new Date(financa.vencimento);
              despesasPorMes[data.getMonth()] += financa.valor;
            });
            this.barChartData = {
              labels: meses,
              datasets: [
                {
                  label: 'Receitas',
                  data: receitasPorMes,
                  backgroundColor: '#36A2EB'
                },
                {
                  label: 'Despesas',
                  data: despesasPorMes,
                  backgroundColor: '#FF6384'
                }
              ]
            };
          })
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
