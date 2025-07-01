import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { Subscription } from 'rxjs';

import { Financa } from '../../models/financa.model';
import { Provento } from '../../models/provento.model';
import { ContasFixasService } from '../../services/financa.service';
import { ProventoService } from '../../services/provento.service';

@Component({
  selector: 'app-income-expense-chart',
  standalone: false,
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
    // Busca receitas e despesas e atualiza o gráfico
    this.subscription.add(
      this.proventoService.listarProventos(0, 100, 'data').subscribe((proventosResponse: any) => {
        const proventos: Provento[] = proventosResponse.content || proventosResponse || [];
        this.subscription.add(
          this.financaService.listarFinancas(0, 100, 'vencimento').subscribe((financasResponse: any) => {
            const financas: Financa[] = financasResponse.content || financasResponse || [];
            const meses = [
              'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
              'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ];
            const receitasPorMes = Array(12).fill(0);
            const despesasPorMes = Array(12).fill(0);
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
