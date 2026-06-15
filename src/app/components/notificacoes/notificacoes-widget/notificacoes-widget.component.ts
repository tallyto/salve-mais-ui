import { Component, OnInit } from '@angular/core';
import { SALVE_COMMON, SALVE_DATA } from '@shared/primeng-shared';

import { NotificacaoService, ResumoNotificacoes } from '@services/notificacao.service';

@Component({
  selector: 'app-notificacoes-widget',
  standalone: true,
  imports: [
    ...SALVE_COMMON,
    ...SALVE_DATA
  ],
  template: `
    <p-card styleClass="dashboard-widget-card h-full">
      <ng-template pTemplate="header">
        <div class="flex align-items-center gap-2 p-3">
          <i [class]="resumo?.temNotificacoes ? 'pi pi-bell' : 'pi pi-bell-off'"></i>
          <span class="font-semibold">Notificações</span>
        </div>
      </ng-template>

      <div *ngIf="loading" class="dashboard-widget-content flex flex-column gap-3">
        <p-skeleton height="3.5rem" borderRadius="8px"></p-skeleton>
        <p-skeleton height="3.5rem" borderRadius="8px"></p-skeleton>
        <p-skeleton height="3.5rem" borderRadius="8px"></p-skeleton>
      </div>

      <div *ngIf="!loading && resumo?.temNotificacoes" class="dashboard-widget-content flex flex-column gap-3">
        <div *ngIf="resumo && resumo.notificacoesCriticas > 0"
             class="flex align-items-center justify-content-between p-3 border-round surface-ground">
          <div class="flex align-items-center gap-2">
            <i class="pi pi-exclamation-triangle text-xl text-red-600"></i>
            <span class="text-color-secondary text-sm">Críticas</span>
          </div>
          <span class="font-bold">{{ resumo.notificacoesCriticas }}</span>
        </div>

        <div *ngIf="resumo && resumo.notificacoesAltas > 0"
             class="flex align-items-center justify-content-between p-3 border-round surface-ground">
          <div class="flex align-items-center gap-2">
            <i class="pi pi-exclamation-circle text-xl text-orange-500"></i>
            <span class="text-color-secondary text-sm">Alta Prioridade</span>
          </div>
          <span class="font-bold">{{ resumo.notificacoesAltas }}</span>
        </div>

        <div *ngIf="resumo && resumo.contasAtrasadas > 0"
             class="flex align-items-center justify-content-between p-3 border-round surface-ground">
          <div class="flex align-items-center gap-2">
            <i class="pi pi-wallet text-xl text-orange-600"></i>
            <span class="text-color-secondary text-sm">Contas Atrasadas</span>
          </div>
          <span class="font-bold">{{ resumo.contasAtrasadas }}</span>
        </div>

        <div *ngIf="resumo && resumo.faturasAtrasadas > 0"
             class="flex align-items-center justify-content-between p-3 border-round surface-ground">
          <div class="flex align-items-center gap-2">
            <i class="pi pi-credit-card text-xl text-orange-600"></i>
            <span class="text-color-secondary text-sm">Faturas Atrasadas</span>
          </div>
          <span class="font-bold">{{ resumo.faturasAtrasadas }}</span>
        </div>

        <div *ngIf="resumo && resumo.contasProximasVencimento > 0"
             class="flex align-items-center justify-content-between p-3 border-round surface-ground">
          <div class="flex align-items-center gap-2">
            <i class="pi pi-calendar text-xl text-color-secondary"></i>
            <span class="text-color-secondary text-sm">Contas a Vencer</span>
          </div>
          <span class="font-bold">{{ resumo.contasProximasVencimento }}</span>
        </div>

        <div *ngIf="resumo && resumo.faturasProximasVencimento > 0"
             class="flex align-items-center justify-content-between p-3 border-round surface-ground">
          <div class="flex align-items-center gap-2">
            <i class="pi pi-calendar text-xl text-color-secondary"></i>
            <span class="text-color-secondary text-sm">Faturas a Vencer</span>
          </div>
          <span class="font-bold">{{ resumo.faturasProximasVencimento }}</span>
        </div>
      </div>

      <div *ngIf="!loading && !resumo?.temNotificacoes" class="dashboard-widget-content flex flex-column align-items-center justify-content-center gap-2 text-center p-5">
        <i class="pi pi-check-circle text-4xl text-color-secondary"></i>
        <p class="m-0">Tudo em dia!</p>
      </div>

      <ng-template pTemplate="footer">
        <div class="flex justify-content-end">
          <p-button label="Ver Todas" [text]="true" icon="pi pi-arrow-right" routerLink="/notificacoes" [disabled]="loading"></p-button>
        </div>
      </ng-template>
    </p-card>
  `,
  styles: []
})
export class NotificacoesWidgetComponent implements OnInit {
  resumo: ResumoNotificacoes | null = null;
  loading = false;

  constructor(private notificacaoService: NotificacaoService) { }

  ngOnInit(): void {
    this.carregarResumo();
  }

  carregarResumo(): void {
    this.loading = true;
    this.notificacaoService.obterResumoNotificacoes().subscribe({
      next: (resumo) => {
        this.resumo = resumo;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      }
    });
  }
}
