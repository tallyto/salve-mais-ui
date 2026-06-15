import { Component, OnInit } from '@angular/core';
import { CartaoService } from '../../services/cartao.service';
import { CartaoLimiteStatusDTO } from '../../models/cartao.model';
import { SALVE_COMMON, SALVE_DATA } from '../../shared/primeng-shared';

@Component({
  selector: 'app-limite-alertas-widget',
  standalone: true,
  imports: [
    ...SALVE_COMMON,
    ...SALVE_DATA
  ],
  template: `
    <p-card styleClass="dashboard-widget-card h-full">
      <ng-template pTemplate="header">
        <div class="flex align-items-center gap-2 p-3">
          <i class="pi pi-credit-card"></i>
          <span class="font-semibold">Limites dos Cartões</span>
        </div>
      </ng-template>

      <div *ngIf="alertas.length > 0; else noAlertas" class="dashboard-widget-content flex flex-column gap-3">
        <div *ngFor="let alerta of alertas" class="surface-ground border-round p-3">
          <div class="flex align-items-start justify-content-between">
            <div>
              <div class="font-bold">{{ alerta.nomeCartao }}</div>
              <div class="text-sm text-color-secondary">
                {{ formatarMoeda(alerta.valorUtilizado) }} de {{ formatarMoeda(alerta.limiteTotal) }}
              </div>
            </div>
            <i [class]="'pi ' + getStatusIcon(alerta)"></i>
          </div>
          <div class="flex flex-column gap-2 mt-3">
            <div class="flex justify-content-between gap-3">
              <span>Uso do limite</span>
              <strong>{{ formatarPercentual(alerta.percentualUtilizado) }}</strong>
            </div>
            <p-progressbar [value]="alerta.percentualUtilizado"
                          [showValue]="false"
                          styleClass="w-full"></p-progressbar>
          </div>
        </div>
      </div>

      <ng-template #noAlertas>
        <div class="dashboard-widget-content flex flex-column align-items-center justify-content-center gap-2 text-center p-5">
          <i class="pi pi-check-circle text-4xl text-color-secondary"></i>
          <p class="m-0">Todos os cartões dentro do limite</p>
        </div>
      </ng-template>

      <ng-template pTemplate="footer">
        <div class="flex justify-content-end">
          <p-button label="Ver Detalhes" [text]="true" icon="pi pi-arrow-right" routerLink="/cartao/limites"></p-button>
        </div>
      </ng-template>
    </p-card>
  `,
  styles: []
})
export class LimiteAlertasWidgetComponent implements OnInit {
  alertas: CartaoLimiteStatusDTO[] = [];

  constructor(private cartaoService: CartaoService) {}

  ngOnInit() {
    this.carregarAlertas();
  }

  carregarAlertas() {
    this.cartaoService.verificarAlertas().subscribe({
      next: (alertas) => {
        this.alertas = alertas;
      },
      error: (error) => {
      }
    });
  }

  getStatusIcon(status: CartaoLimiteStatusDTO): string {
    if (status.limiteExcedido) return 'pi-exclamation-circle';
    if (status.alertaAtivado) return 'pi-exclamation-triangle';
    return 'pi-check-circle';
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  formatarPercentual(valor: number): string {
    return valor.toFixed(1) + '%';
  }
}
