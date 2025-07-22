import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FaturaService } from '../../services/fatura.service';
import { AccountService } from '../../services/account.service';
import { Account } from '../../models/account.model';
import { FaturaResponseDTO } from '../../models/fatura.model';

@Component({
  selector: 'app-pagamento-fatura-modal',
  templateUrl: './pagamento-fatura-modal.component.html',
  styleUrls: ['./pagamento-fatura-modal.component.css']
})
export class PagamentoFaturaModalComponent implements OnInit {
  pagamentoForm: FormGroup;
  contas: Account[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private faturaService: FaturaService,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<PagamentoFaturaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { fatura: FaturaResponseDTO }
  ) {
    this.pagamentoForm = this.fb.group({
      contaId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.carregarContas();
  }

  carregarContas(): void {
    this.loading = true;
    this.accountService.listarTodasContas().subscribe({
      next: (contas) => {
        this.contas = contas;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar contas:', error);
        this.snackBar.open('Erro ao carregar contas', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.pagamentoForm.valid) {
      this.loading = true;
      const contaId = this.pagamentoForm.value.contaId;

      this.faturaService.pagarFaturaComConta(this.data.fatura.id, contaId).subscribe({
        next: () => {
          this.snackBar.open('Fatura paga com sucesso!', 'Fechar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Erro ao pagar fatura:', error);
          const mensagem = error.error?.message || 'Erro ao pagar fatura';
          this.snackBar.open(mensagem, 'Fechar', { duration: 5000 });
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  temSaldoSuficiente(conta: Account): boolean {
    return conta.saldo >= this.data.fatura.valorTotal;
  }

  temAlgumaContaComSaldo(): boolean {
    return this.contas.some(conta => this.temSaldoSuficiente(conta));
  }
}
