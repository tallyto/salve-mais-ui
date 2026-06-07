import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BillingService } from '../../services/billing.service';
import { BillingStatus } from '../../models/billing-status.model';
import { Plano } from '../../models/plano.model';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css'],
  standalone: false
})
export class BillingComponent implements OnInit {

  planos: Plano[] = [];
  billingStatus: BillingStatus | null = null;
  loading = false;
  assinando = false;
  cancelando = false;

  constructor(
    private billingService: BillingService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;

    this.billingService.getPlanos().subscribe({
      next: (planos) => { this.planos = planos; this.loading = false; },
      error: () => { this.loading = false; }
    });

    this.billingService.getStatus().subscribe({
      next: (status) => { this.billingStatus = status; }
    });
  }

  assinar(planoId: string): void {
    this.assinando = true;
    this.billingService.assinar(planoId).subscribe({
      next: (res) => { window.location.href = res.checkoutUrl; },
      error: (err) => {
        this.assinando = false;
        this.showError(err?.error?.message ?? err?.error?.detail ?? 'Erro ao iniciar assinatura. Tente novamente.');
      }
    });
  }

  confirmarCancelamento(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Cancelar assinatura',
        message: 'Deseja cancelar sua assinatura? Você continuará com acesso até o fim do período já pago. Não haverá reembolso.',
        confirmText: 'Sim, cancelar',
        cancelText: 'Não'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cancelar();
      }
    });
  }

  private cancelar(): void {
    this.cancelando = true;
    this.billingService.cancelar().subscribe({
      next: () => {
        this.cancelando = false;
        this.showSuccess('Assinatura cancelada com sucesso.');
        this.loadData();
      },
      error: (err) => {
        this.cancelando = false;
        this.showError(err?.error?.message ?? err?.error?.detail ?? 'Erro ao cancelar assinatura.');
      }
    });
  }

  isCurrentPlan(plano: Plano): boolean {
    return this.billingStatus?.nomePlano === plano.nome && this.billingStatus?.subscriptionStatus === 'ATIVO';
  }

  quotaPercent(used: number | null, max: number | null): number {
    if (!max || max === 0) return 0;
    return Math.min(100, Math.round(((used ?? 0) / max) * 100));
  }

  quotaColor(percent: number): 'primary' | 'accent' | 'warn' {
    if (percent >= 90) return 'warn';
    if (percent >= 70) return 'accent';
    return 'primary';
  }

  get isTrial(): boolean { return this.billingStatus?.subscriptionStatus === 'TRIAL'; }
  get isInadimplente(): boolean { return this.billingStatus?.subscriptionStatus === 'INADIMPLENTE'; }
  get isAtivo(): boolean { return this.billingStatus?.subscriptionStatus === 'ATIVO'; }
  get diasRestantes(): number { return this.billingStatus?.diasRestantesTrial ?? 0; }
  get hasSubscription(): boolean { return this.isAtivo; }
  get cancelamentoAgendado(): string | null { return this.billingStatus?.cancelarEm ?? null; }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}
