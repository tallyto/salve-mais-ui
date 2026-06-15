import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { Conta, TipoConta } from '../../models/conta.model';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TransferenciaModalComponent } from '../transferencia-modal/transferencia-modal.component';
import { SALVE_COMMON, SALVE_DATA, SALVE_FORMS } from '../../shared/primeng-shared';

@Component({
    selector: 'app-list-accounts',
    templateUrl: './list-accounts.component.html',
    standalone: true,
    imports: [
      ...SALVE_COMMON,
      ...SALVE_DATA,
      ...SALVE_FORMS
    ]
})
export class ListAccountsComponent implements OnInit {
  accounts: Conta[] = [];
  isLoadingResults = true;
  editingAccount: Conta | null = null;
  tempTitular: string = '';
  transferenciaRef?: DynamicDialogRef;

  constructor(
    private accountService: AccountService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) {
    this.accountService.accountsChanged$.subscribe(() => this.loadAccounts());
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

  getTipoDescricao(tipo: string): string {
    const labels: Record<string, string> = {
      CORRENTE: 'Conta Corrente',
      POUPANCA: 'Poupança',
      INVESTIMENTO: 'Investimento',
      RESERVA_EMERGENCIA: 'Reserva de Emergência'
    };
    return labels[tipo] ?? tipo;
  }

  startEdit(account: Conta): void {
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
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Conta atualizada!' });
        this.editingAccount = null;
        this.tempTitular = '';
        this.loadAccounts();
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar: ' + (err.error?.message || 'Erro desconhecido') });
      }
    });
  }

  isEditing(account: Conta): boolean {
    return this.editingAccount?.id === account.id;
  }

  excluirConta(account: Conta): void {
    if (!confirm(`Excluir a conta "${account.titular}"?`)) return;
    this.accountService.excluirAccount(account.id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Conta excluída!' });
        this.loadAccounts();
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir: ' + (err.error?.message || 'Erro desconhecido') });
      }
    });
  }

  abrirTransferencia(account: Conta): void {
    this.transferenciaRef = this.dialogService.open(TransferenciaModalComponent, {
      header: 'Transferência entre Contas',
      modal: true,
      width: '500px',
      data: { contaOrigem: account }
    });

    this.transferenciaRef.onClose.subscribe(result => {
      if (result === true) this.loadAccounts();
    });
  }

  mapPrimeIcon(materialIcon: string): string {
    const iconMap: Record<string, string> = {
      'account_balance': 'pi-building',
      'savings': 'pi-wallet',
      'trending_up': 'pi-arrow-up',
      'shield': 'pi-shield'
    };
    return iconMap[materialIcon] || 'pi-circle';
  }
}
