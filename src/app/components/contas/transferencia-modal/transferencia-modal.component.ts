import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { AccountService } from '@services/account.service';
import { Conta, TipoConta } from '@models/conta.model';
import { SALVE_COMMON, SALVE_FORMS } from '@shared/primeng-shared';

interface TransferenciaModalData {
  contaOrigem: Conta;
}

interface TransferenceError {
  error?: { message?: string };
}

@Component({
  selector: 'app-transferencia-modal',
  templateUrl: './transferencia-modal.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProgressSpinnerModule, MessageModule, ...SALVE_COMMON, ...SALVE_FORMS]
})
export class TransferenciaModalComponent implements OnInit {
  transferenciaForm: FormGroup;
  contas: Conta[] = [];
  contaOrigem: Conta | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private messageService: MessageService,
    public dialogRef: DynamicDialogRef,
    @Inject(DynamicDialogConfig) public config: DynamicDialogConfig
  ) {
    this.transferenciaForm = this.fb.group({
      contaDestinoId: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(0.01)]]
    });

    const data = config?.data as TransferenciaModalData | undefined;
    if (data?.contaOrigem) {
      this.contaOrigem = data.contaOrigem;
    }
  }

  ngOnInit(): void {
    this.carregarContas();
  }

  carregarContas(): void {
    this.isLoading = true;
    this.accountService.listarTodasContas().subscribe({
      next: (contas: Conta[]) => {
        if (this.contaOrigem) {
          this.contas = contas.filter(conta => conta.id !== this.contaOrigem?.id);
        } else {
          this.contas = contas;
        }

        if (this.contas.length === 0) {
          this.transferenciaForm.get('valor')?.disable();
          this.transferenciaForm.get('contaDestinoId')?.disable();
        }

        this.isLoading = false;
      },
      error: (err: TransferenceError) => {
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar contas: ' + (err.error?.message || 'Erro desconhecido') });
      }
    });
  }

  transferir(): void {
    if (this.transferenciaForm.invalid || !this.contaOrigem) {
      return;
    }

    this.isLoading = true;
    const { contaDestinoId, valor } = this.transferenciaForm.value as { contaDestinoId: number; valor: number };

    if (this.contaOrigem.saldo < valor) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Saldo insuficiente para realizar a transferência' });
      this.isLoading = false;
      return;
    }

    this.accountService.transferirEntreConta(this.contaOrigem.id, contaDestinoId, valor).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Transferência realizada com sucesso!' });
        this.dialogRef.close(true);
      },
      error: (err: TransferenceError) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao realizar transferência: ' + (err.error?.message || 'Erro desconhecido') });
        this.isLoading = false;
      }
    });
  }

  fechar() {
    this.dialogRef.close();
  }

  getTipoDescricao(tipo: string): string {
    switch (tipo) {
      case 'CORRENTE':
        return 'Conta Corrente';
      case 'POUPANCA':
        return 'Poupança';
      case 'INVESTIMENTO':
        return 'Investimento';
      case 'RESERVA_EMERGENCIA':
        return 'Reserva de Emergência';
      default:
        return tipo;
    }
  }
}
