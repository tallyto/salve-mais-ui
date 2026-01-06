import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';

import { CartaoService } from '../../services/cartao.service';
import { CartaoLimiteStatusDTO } from '../../models/cartao.model';

@Component({
  selector: 'app-limite-alertas-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    RouterModule
  ],
  template: `
    <mat-card class="limite-widget">
      <mat-card-header>
        <mat-card-title>
          <mat-icon class="title-icon">credit_card</mat-icon>
          Limites dos Cartões
        </mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div *ngIf="alertas.length > 0; else noAlertas" class="alertas-content">
          <div class="alerta-item" *ngFor="let alerta of alertas" [class]="getStatusClass(alerta)">
            <div class="alerta-header">
              <mat-icon class="status-icon">{{ getStatusIcon(alerta) }}</mat-icon>
              <span class="cartao-nome">{{ alerta.nomeCartao }}</span>
            </div>
            <div class="limite-info">
              <div class="progress-container">
                <mat-progress-bar
                  [value]="alerta.percentualUtilizado"
                  [color]="getProgressBarColor(alerta)"
                  mode="determinate">
                </mat-progress-bar>
                <span class="percentage">{{ formatarPercentual(alerta.percentualUtilizado) }}</span>
              </div>
              <div class="valores">
                <span class="utilizado">{{ formatarMoeda(alerta.valorUtilizado) }}</span>
                <span class="separador">/</span>
                <span class="limite">{{ formatarMoeda(alerta.limiteTotal) }}</span>
              </div>
            </div>
          </div>
        </div>

        <ng-template #noAlertas>
          <div class="no-alertas">
            <mat-icon class="success-icon">check_circle</mat-icon>
            <p>Todos os cartões dentro do limite</p>
          </div>
        </ng-template>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button color="primary" routerLink="/cartao/limites">
          Ver Detalhes
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .limite-widget {
      height: 100%;
      min-height: 300px;
      display: flex;
      flex-direction: column;
    }

    .title-icon {
      margin-right: 8px;
      color: #1976d2;
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

    .alerta-item.status-normal {
      background-color: #e8f5e8;
      border-color: #4caf50;
    }

    .alerta-item.status-alerta {
      background-color: #fff3e0;
      border-color: #ff9800;
    }

    .alerta-item.status-excedido {
      background-color: #ffebee;
      border-color: #f44336;
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

    .cartao-nome {
      font-weight: 500;
      color: #333;
    }

    .limite-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .progress-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .progress-container mat-progress-bar {
      flex: 1;
      height: 6px;
    }

    .percentage {
      font-size: 12px;
      font-weight: 500;
      min-width: 40px;
      text-align: right;
    }

    .valores {
      font-size: 12px;
      color: #666;
    }

    .utilizado {
      font-weight: 500;
      color: #333;
    }

    .separador {
      margin: 0 4px;
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

    @media (max-width: 768px) {
      .limite-widget {
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

  getStatusClass(status: CartaoLimiteStatusDTO): string {
    if (status.limiteExcedido) return 'status-excedido';
    if (status.alertaAtivado) return 'status-alerta';
    return 'status-normal';
  }

  getStatusIcon(status: CartaoLimiteStatusDTO): string {
    if (status.limiteExcedido) return 'error';
    if (status.alertaAtivado) return 'warning';
    return 'check_circle';
  }

  getProgressBarColor(status: CartaoLimiteStatusDTO): string {
    if (status.limiteExcedido) return 'warn';
    if (status.alertaAtivado) return 'accent';
    return 'primary';
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
