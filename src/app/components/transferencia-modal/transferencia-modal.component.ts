import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountService } from 'src/app/services/account.service';
import { Account } from '../../models/account.model';

@Component({
  selector: 'app-transferencia-modal',
  templateUrl: './transferencia-modal.component.html',
  styleUrls: ['./transferencia-modal.component.css'],
  standalone: false
})
export class TransferenciaModalComponent implements OnInit {
  transferenciaForm: FormGroup;
  contas: Account[] = [];
  contaOrigem: Account | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<TransferenciaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { contaOrigem: Account }
  ) {
    this.transferenciaForm = this.fb.group({
      contaDestinoId: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(0.01)]]
    });

    if (data && data.contaOrigem) {
      this.contaOrigem = data.contaOrigem;
    }
  }

  ngOnInit(): void {
    this.carregarContas();
  }

  carregarContas() {
    this.isLoading = true;
    this.accountService.listarTodasContas().subscribe({
      next: (contas) => {
        // Filtrar a conta de origem da lista de destinos possíveis
        if (this.contaOrigem) {
          this.contas = contas.filter(conta => conta.id !== this.contaOrigem?.id);
        } else {
          this.contas = contas;
        }

        // Se não houver contas para transferir, desabilita o campo de valor
        if (this.contas.length === 0) {
          this.transferenciaForm.get('valor')?.disable();
          this.transferenciaForm.get('contaDestinoId')?.disable();
        }

        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open('Erro ao carregar contas: ' + (err.error?.message || 'Erro desconhecido'), 'Fechar', {
          duration: 3000,
          panelClass: 'snackbar-error'
        });
      }
    });
  }

  transferir() {
    if (this.transferenciaForm.invalid || !this.contaOrigem) {
      return;
    }

    this.isLoading = true;
    const { contaDestinoId, valor } = this.transferenciaForm.value;

    // Verifica se há saldo suficiente
    if (this.contaOrigem.saldo < valor) {
      this.snackBar.open('Saldo insuficiente para realizar a transferência', 'Fechar', {
        duration: 3000,
        panelClass: 'snackbar-error'
      });
      this.isLoading = false;
      return;
    }

    this.accountService.transferirEntreConta(this.contaOrigem.id, contaDestinoId, valor).subscribe({
      next: () => {
        this.snackBar.open('Transferência realizada com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: 'snackbar-success'
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.snackBar.open('Erro ao realizar transferência: ' + (err.error?.message || 'Erro desconhecido'), 'Fechar', {
          duration: 3000,
          panelClass: 'snackbar-error'
        });
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
