import {Component, OnInit} from '@angular/core';
import {ContasFixasService} from "../../services/financa.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Categoria} from "../../models/categoria.model";
import {CategoriaService} from "../../services/categoria.service";
import {Account} from "../../models/account.model";
import {AccountService} from "../../services/account.service";
import {Financa} from "../../models/financa.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {CategoriaFormComponent} from "../categoria-form/categoria-form.component";
import {AccountComponent} from "../account/account.component";

@Component({
    selector: 'app-despesas-fixas',
    templateUrl: './despesas-fixas.component.html',
    styleUrls: ['./despesas-fixas.component.css'],
    standalone: false
})
export class DespesasFixasComponent implements OnInit {
  despesaFixaForm: FormGroup;
  public categorias: Categoria[] = [];
  public accounts: Account[] = [];
  public editingDespesa: Financa | null = null;

  constructor(
    private financaService: ContasFixasService,
    private formBuilder: FormBuilder,
    private categoriaService: CategoriaService,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.despesaFixaForm = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      categoriaId: ['', Validators.required],
      contaId: ['', Validators.required],
      vencimento: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(0)]],
      pago: [false, Validators.required]
    });
  }

  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarContas();

    // Subscribe to edit event
    this.financaService.editingFinanca.subscribe((financa: Financa) => {
      if (financa) {
        this.editingDespesa = financa;
        this.despesaFixaForm.patchValue({
          id: financa.id,
          nome: financa.nome,
          categoriaId: financa.categoria?.id,
          contaId: financa.conta?.id,
          vencimento: financa.vencimento,
          valor: financa.valor,
          pago: financa.pago
        });
      }
    });
  }

  carregarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe(
      categorias => this.categorias = categorias
    );
  }

  salvarDespesaFixa(): void {
    if (this.despesaFixaForm.invalid) {
      return;
    }

    const despesa = this.despesaFixaForm.value;
    const isEditing = !!despesa.id;

    this.financaService.salvarFinanca(despesa).subscribe({
      next: () => {
        this.despesaFixaForm.reset({
          id: null,
          nome: '',
          categoriaId: '',
          contaId: '',
          vencimento: '',
          valor: '',
          pago: false
        });

        this.editingDespesa = null;
        this.financaService.savedFinanca.emit();

        const message = isEditing ? 'Despesa atualizada com sucesso!' : 'Despesa salva com sucesso!';
        this.snackBar.open(message, 'Fechar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
      error: (error: any) => {
        console.error('Erro ao salvar despesa:', error);
        this.snackBar.open('Erro ao salvar despesa', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }
    });
  }

  cancelarEdicao(): void {
    this.despesaFixaForm.reset({
      id: null,
      nome: '',
      categoriaId: '',
      contaId: '',
      vencimento: '',
      valor: '',
      pago: false
    });
    this.editingDespesa = null;
  }

  novaCategoria(): void {
    const dialogRef = this.dialog.open(CategoriaFormComponent, {
      width: '500px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.carregarCategorias();
        this.despesaFixaForm.patchValue({ categoriaId: result.id });
        this.snackBar.open('Categoria criada com sucesso!', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }

  novaConta(): void {
    const dialogRef = this.dialog.open(AccountComponent, {
      width: '600px',
      disableClose: false,
      data: { isDialogMode: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.carregarContas();
        this.despesaFixaForm.patchValue({ contaId: result.id });
        this.snackBar.open('Conta criada com sucesso!', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }

  carregarContas(): void {
    this.accountService.listarAccounts(0, 50, '').subscribe({
      next: accountPage => {
        this.accounts = accountPage.content;
      }
    });
  }
}

