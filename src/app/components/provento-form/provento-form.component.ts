import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import { ProventoService } from "../../services/provento.service";
import { Account } from "../../models/account.model";
import { AccountService } from "../../services/account.service";
import { Provento } from "../../models/provento.model";
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-provento-form',
    templateUrl: './provento-form.component.html',
    styleUrls: ['./provento-form.component.css'],
    standalone: false
})
export class ProventoFormComponent implements OnInit, OnDestroy {
  public proventoForm: FormGroup;
  private horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  private verticalPosition: MatSnackBarVerticalPosition = 'top';
  public accounts: Account[] = [];
  private editSubscription: Subscription | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private proventoService: ProventoService,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
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
    this.editSubscription = this.proventoService.editingProvento.subscribe((provento: Provento) => {
      this.proventoForm.patchValue({
        id: provento.id,
        contaId: provento.conta?.id,
        descricao: provento.descricao,
        valor: provento.valor,
        data: provento.data
      });
    });
  }

  salvarProvento() {
    if (this.proventoForm.value.id) {
      this.proventoService.atualizarProvento(this.proventoForm.value).subscribe({
        next: () => {
          this.openSnackBar('Provento atualizado com sucesso!');
          this.proventoForm.reset();
          this.proventoService.proventoSaved.emit();
        },
        error: error => {
          this.openSnackBar('Erro ao atualizar provento!');
        }
      });
    } else {
      this.proventoService.criarProvento(this.proventoForm.value).subscribe({
        next: () => {
          this.openSnackBar('Provento salvo com sucesso!');
          this.proventoForm.reset();
          this.proventoService.proventoSaved.emit();
        },
        error: error => {
          this.openSnackBar('Erro ao salvar provento!');
        }
      });
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Ok', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  ngOnDestroy(): void {
    this.editSubscription?.unsubscribe();
  }
}
