import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

import { NotificacaoService, ResumoNotificacoes } from '../../services/notificacao.service';

@Component({
  selector: 'app-notificacoes-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  template: `
    <mat-card *ngIf="!loading" class="notificacoes-widget"
          [class.tem-notificacoes]="resumo?.temNotificacoes"
          [routerLink]="['/notificacoes']">
      <mat-card-header>
        <mat-card-title>
          <mat-icon class="title-icon">{{ resumo?.temNotificacoes ? 'notifications_active' : 'notifications_none' }}</mat-icon>
          Notificações
        </mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div *ngIf="resumo?.temNotificacoes; else nenhumaNotificacao" class="alertas-content">
          <div class="alerta-item criticas" *ngIf="resumo && resumo.notificacoesCriticas > 0">
            <div class="alerta-header">
              <mat-icon class="status-icon">warning</mat-icon>
              <span class="notificacao-titulo">Críticas</span>
            </div>
            <div class="notificacao-info">
              <span class="count-badge">{{ resumo.notificacoesCriticas }}</span>
              <span class="notificacao-desc">Requerem atenção imediata</span>
            </div>
          </div>

          <div class="alerta-item altas" *ngIf="resumo && resumo.notificacoesAltas > 0">
            <div class="alerta-header">
              <mat-icon class="status-icon">priority_high</mat-icon>
              <span class="notificacao-titulo">Alta Prioridade</span>
            </div>
            <div class="notificacao-info">
              <span class="count-badge">{{ resumo.notificacoesAltas }}</span>
              <span class="notificacao-desc">Atenção necessária</span>
            </div>
          </div>

          <div class="alerta-item atrasadas" *ngIf="resumo && resumo.contasAtrasadas > 0">
            <div class="alerta-header">
              <mat-icon class="status-icon">account_balance_wallet</mat-icon>
              <span class="notificacao-titulo">Contas Atrasadas</span>
            </div>
            <div class="notificacao-info">
              <span class="count-badge">{{ resumo.contasAtrasadas }}</span>
              <span class="notificacao-desc">Pendentes de pagamento</span>
            </div>
          </div>

          <div class="alerta-item atrasadas" *ngIf="resumo && resumo.faturasAtrasadas > 0">
            <div class="alerta-header">
              <mat-icon class="status-icon">credit_card</mat-icon>
              <span class="notificacao-titulo">Faturas Atrasadas</span>
            </div>
            <div class="notificacao-info">
              <span class="count-badge">{{ resumo.faturasAtrasadas }}</span>
              <span class="notificacao-desc">Pendentes de pagamento</span>
            </div>
          </div>
        </div>

        <ng-template #nenhumaNotificacao>
          <div class="no-alertas">
            <mat-icon class="success-icon">check_circle</mat-icon>
            <p>Tudo em dia!</p>
          </div>
        </ng-template>
      </mat-card-content>
      <mat-card-actions *ngIf="resumo?.temNotificacoes">
        <button mat-button color="primary" routerLink="/notificacoes">
          Ver Todas
          <mat-icon>arrow_forward</mat-icon>
        </button>
      </mat-card-actions>
    </mat-card>

    <mat-card *ngIf="loading" class="notificacoes-widget loading">
      <mat-card-content>
        <div class="loading-content">
          <mat-spinner diameter="30"></mat-spinner>
          <span>Carregando...</span>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .notificacoes-widget {
      height: 100%;
      min-height: 300px;
      display: flex;
      flex-direction: column;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .notificacoes-widget:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .title-icon {
      margin-right: 8px;
      color: #1976d2;
    }

    .notificacoes-widget.tem-notificacoes .title-icon {
      color: #f44336;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { opacity: 0.7; }
      50% { opacity: 1; }
      100% { opacity: 0.7; }
    }

    .alertas-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .alerta-item {
      padding: 12px;
      border-radius: 8px;
      border-left: 4px solid;
      transition: all 0.3s ease;
    }

    .alerta-item:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .alerta-item.criticas {
      background-color: #ffebee;
      border-color: #d32f2f;
    }

    .alerta-item.altas {
      background-color: #fff3e0;
      border-color: #f44336;
    }

    .alerta-item.atrasadas {
      background-color: #fff8e1;
      border-color: #ff9800;
    }

    .alerta-header {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }

    .status-icon {
      margin-right: 8px;
      font-size: 18px;
    }

    .notificacao-titulo {
      font-weight: 500;
      color: #333;
    }

    .notificacao-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .count-badge {
      background-color: rgba(0,0,0,0.1);
      color: #333;
      border-radius: 12px;
      padding: 2px 8px;
      font-weight: 500;
      font-size: 14px;
    }

    .notificacao-desc {
      font-size: 12px;
      color: #666;
    }

    .no-alertas {
      text-align: center;
      padding: 40px 20px;
      color: #666;
    }

    .success-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #4caf50;
      margin-bottom: 8px;
    }

    .no-alertas p {
      margin: 0;
      font-size: 14px;
    }

    mat-card-actions {
      margin-top: auto;
      padding: 16px;
    }

    .loading-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      gap: 16px;
    }

    @media (max-width: 768px) {
      .notificacoes-widget {
        min-height: 250px;
      }

      .alerta-item {
        padding: 8px;
      }

      .no-alertas {
        padding: 20px 10px;
      }
    }
  `]
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
