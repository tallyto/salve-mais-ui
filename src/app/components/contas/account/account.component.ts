import { AfterViewInit, Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AccountService } from '@services/account.service';
import { SALVE_COMMON, SALVE_FORMS } from '@shared/primeng-shared';
import { ListAccountsComponent } from '@components/contas/list-accounts/list-accounts.component';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    standalone: true,
    imports: [
      ...SALVE_COMMON,
      ...SALVE_FORMS,
      ListAccountsComponent
    ]
})
export class AccountComponent implements AfterViewInit {
  public accountForm: FormGroup;
  public isDialogMode: boolean = false;
  public selectedTipo: string = 'CORRENTE';
  public viewReady: boolean = false;

  public tiposConta = [
    {
      value: 'CORRENTE',
      label: 'Conta Corrente',
      icon: 'account_balance',
      description: 'Movimentação e pagamentos do dia a dia'
    },
    {
      value: 'POUPANCA',
      label: 'Poupança',
      icon: 'savings',
      description: 'Rendimento básico com liquidez diária'
    },
    {
      value: 'INVESTIMENTO',
      label: 'Investimento',
      icon: 'trending_up',
      description: 'CDB, tesouro direto, fundos e outros'
    },
    {
      value: 'RESERVA_EMERGENCIA',
      label: 'Reserva de Emergência',
      icon: 'shield',
      description: 'Fundo de segurança para imprevistos'
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private messageService: MessageService,
    @Optional() public dialogRef: DynamicDialogRef,
    @Optional() @Inject(DynamicDialogConfig) public config: DynamicDialogConfig
  ) {
      this.isDialogMode = !!dialogRef || !!config?.data?.isDialogMode;
      this.accountForm = this.formBuilder.group({
        id: [null],
        titular: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        tipo: ['CORRENTE', Validators.required],
        descricao: ['', Validators.maxLength(255)],
        taxaRendimento: [null, [Validators.min(0), Validators.max(100)]],
      })
    }

  ngAfterViewInit(): void {
    window.setTimeout(() => {
      this.viewReady = true;
    }, 500);
  }

  // A taxa de rendimento só faz sentido para contas que rendem juros
  mostrarTaxaRendimento(): boolean {
    return this.accountForm.get('tipo')?.value !== 'CORRENTE';
  }

  createAccount() {
    if (this.accountForm.valid) {
      this.accountService.salvar(this.accountForm.value).subscribe({
        next: value => {
          const message = 'Conta cadastrada com sucesso!';

          if (this.isDialogMode) {
            this.dialogRef.close(value);
          } else {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });
            this.accountForm.reset();
            this.accountService.accountsChanged$.next(undefined);
          }
        },
        error: err => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao cadastrar conta: ' + err.message });
        }
      })
    }
  }

  fecharDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  resetForm() {
    this.accountForm.reset({ tipo: 'CORRENTE' });
    this.selectedTipo = 'CORRENTE';
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
