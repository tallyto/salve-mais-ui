import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { Account } from '../../models/account.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TransferenciaModalComponent } from '../transferencia-modal/transferencia-modal.component';

@Component({
    selector: 'app-list-accounts',
    templateUrl: './list-accounts.component.html',
    styleUrls: ['./list-accounts.component.css'],
    standalone: false
})
export class ListAccountsComponent implements OnInit {
  accounts: Account[] = [];
  isLoadingResults = true;
  editingAccount: Account | null = null;
  tempTitular: string = '';

  constructor(
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.accountService.savedAccount.subscribe(() => this.loadAccounts());
  }

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.isLoadingResults = true;
    this.accountService.listarTodasContas().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.isLoadingResults = false;
      },
      error: () => {
        this.isLoadingResults = false;
      }
    });
  }

  getSaldoTotal(): number {
    return this.accounts.reduce((sum, a) => sum + (a.saldo || 0), 0);
  }

  getTipoIcon(tipo: string): string {
    const icons: Record<string, string> = {
      CORRENTE: 'account_balance',
      POUPANCA: 'savings',
      INVESTIMENTO: 'trending_up',
      RESERVA_EMERGENCIA: 'shield'
    };
    return icons[tipo] ?? 'account_balance_wallet';
  }

  getCardAccentClass(tipo: string): string {
    const map: Record<string, string> = {
      CORRENTE: 'accent-blue',
      POUPANCA: 'accent-green',
      INVESTIMENTO: 'accent-orange',
      RESERVA_EMERGENCIA: 'accent-purple'
    };
    return map[tipo] ?? 'accent-blue';
  }

  getIconClass(tipo: string): string {
    const map: Record<string, string> = {
      CORRENTE: 'icon-blue',
      POUPANCA: 'icon-green',
      INVESTIMENTO: 'icon-orange',
      RESERVA_EMERGENCIA: 'icon-purple'
    };
    return map[tipo] ?? 'icon-blue';
  }

  getTipoDescricao(tipo: string): string {
    const labels: Record<string, string> = {
      CORRENTE: 'Conta Corrente',
      POUPANCA: 'Poupança',
      INVESTIMENTO: 'Investimento',
      RESERVA_EMERGENCIA: 'Reserva de Emergência'
    };
    return labels[tipo] ?? tipo;
  }

  startEdit(account: Account): void {
    this.editingAccount = account;
    this.tempTitular = account.titular;
  }

  cancelEdit(): void {
    this.editingAccount = null;
    this.tempTitular = '';
  }

  saveEdit(): void {
    if (!this.editingAccount) return;
    const updated = { ...this.editingAccount, titular: this.tempTitular };
    this.accountService.atualizarAccount(updated).subscribe({
      next: () => {
        this.snackBar.open('Conta atualizada!', 'Fechar', { duration: 3000, panelClass: 'snackbar-success' });
        this.editingAccount = null;
        this.tempTitular = '';
        this.loadAccounts();
      },
      error: (err: any) => {
        this.snackBar.open('Erro ao atualizar: ' + (err.error?.message || 'Erro desconhecido'), 'Fechar', { duration: 3000, panelClass: 'snackbar-error' });
      }
    });
  }

  isEditing(account: Account): boolean {
    return this.editingAccount?.id === account.id;
  }

  excluirConta(account: Account): void {
    if (!confirm(`Excluir a conta "${account.titular}"?`)) return;
    this.accountService.excluirAccount(account.id).subscribe({
      next: () => {
        this.snackBar.open('Conta excluída!', 'Fechar', { duration: 3000, panelClass: 'snackbar-success' });
        this.loadAccounts();
      },
      error: (err: any) => {
        this.snackBar.open('Erro ao excluir: ' + (err.error?.message || 'Erro desconhecido'), 'Fechar', { duration: 3000, panelClass: 'snackbar-error' });
      }
    });
  }

  abrirTransferencia(account: Account): void {
    const dialogRef = this.dialog.open(TransferenciaModalComponent, {
      width: '500px',
      data: { contaOrigem: account }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) this.loadAccounts();
    });
  }
}
