import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ProventoService } from "../../services/provento.service";
import { Conta, TipoConta } from './../../models/conta.model';
import { AccountService } from "../../services/account.service";
import { FormBaseService } from "../../services/form-base.service";
import { Provento } from "../../models/provento.model";
import { Subscription } from 'rxjs';
import { filter } from 'rxjs';

@Component({
    selector: 'app-provento-form',
    templateUrl: './provento-form.component.html',
    standalone: false
})
export class ProventoFormComponent implements OnInit, OnDestroy {
  public proventoForm: FormGroup;
  public accounts: Conta[] = [];
  private editSubscription: Subscription | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private proventoService: ProventoService,
    private accountService: AccountService,
    private formBaseService: FormBaseService
  ) {
    this.proventoForm = this.formBuilder.group({
      id: [null],
      contaId: ['', Validators.required],
      descricao: ['', Validators.required],
      valor: ['', [Validators.min(0), Validators.required]],
      data: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.accountService.listarAccounts(0, 50, '').subscribe({
      next: accountPage => {
        this.accounts = accountPage.content;
      }
    });
    // Escuta evento de edição
    this.editSubscription = this.proventoService.editingProvento$.pipe(
      filter((provento): provento is Provento => provento !== null)
    ).subscribe((provento: Provento) => {
      this.proventoForm.patchValue({
        id: provento.id,
        contaId: provento.conta?.id,
        descricao: provento.descricao,
        valor: provento.valor,
        data: provento.data
      });
    });
  }

  get isEditing(): boolean {
    return !!this.proventoForm.get('id')?.value;
  }

  cancelar(): void {
    this.proventoForm.reset();
  }

  salvarProvento() {
    if (this.proventoForm.value.id) {
      this.proventoService.atualizarProvento(this.proventoForm.value).subscribe({
        next: () => {
          this.formBaseService.showSuccess('Provento atualizado com sucesso!');
          this.proventoForm.reset();
          this.proventoService.proventosChanged$.next(undefined);
        },
        error: error => {
          const mensagem = this.formBaseService.handleError(error, 'Erro ao atualizar provento');
          this.formBaseService.showError(mensagem);
        }
      });
    } else {
      this.proventoService.criarProvento(this.proventoForm.value).subscribe({
        next: () => {
          this.formBaseService.showSuccess('Provento salvo com sucesso!');
          this.proventoForm.reset();
          this.proventoService.proventosChanged$.next(undefined);
        },
        error: error => {
          const mensagem = this.formBaseService.handleError(error, 'Erro ao salvar provento');
          this.formBaseService.showError(mensagem);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.editSubscription?.unsubscribe();
  }
}
