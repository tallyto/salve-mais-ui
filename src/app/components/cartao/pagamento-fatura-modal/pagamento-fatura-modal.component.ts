import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { FaturaService } from '@services/fatura.service';
import { AccountService } from '@services/account.service';
import { Conta, TipoConta } from '@models/conta.model';
import { FaturaResponseDTO } from '@models/fatura.model';
import { SALVE_COMMON, SALVE_FORMS, SALVE_DATA } from '@shared/primeng-shared';
import { formatarMoeda } from '@shared/utils';

@Component({
    selector: 'app-pagamento-fatura-modal',
    templateUrl: './pagamento-fatura-modal.component.html',
    standalone: true,
    imports: [
        ...SALVE_COMMON,
        ...SALVE_FORMS,
        ...SALVE_DATA
    ]
})
export class PagamentoFaturaModalComponent implements OnInit {
  pagamentoForm: FormGroup;
  contas: Conta[] = [];
  loading = false;
  formatarMoeda = formatarMoeda;

  constructor(
    private fb: FormBuilder,
    private faturaService: FaturaService,
    private accountService: AccountService,
    private messageService: MessageService,
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.pagamentoForm = this.fb.group({
      contaId: ['', Validators.required]
    });
    this.data = config.data;
  }

  get data(): { fatura: FaturaResponseDTO } {
    return this._data;
  }

  set data(value: { fatura: FaturaResponseDTO }) {
    this._data = value;
  }

  private _data: { fatura: FaturaResponseDTO } = { fatura: {} as FaturaResponseDTO };

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
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar contas', life: 3000 });
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
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Fatura paga com sucesso!', life: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          const mensagem = error.error?.message || 'Erro ao pagar fatura';
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: mensagem, life: 5000 });
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }


  temSaldoSuficiente(conta: Conta): boolean {
    return conta.saldo >= this.data.fatura.valorTotal;
  }

  temAlgumaContaComSaldo(): boolean {
    return this.contas.some(conta => this.temSaldoSuficiente(conta));
  }
}
