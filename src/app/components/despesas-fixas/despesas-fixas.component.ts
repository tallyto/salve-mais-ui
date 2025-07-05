import {Component, OnInit} from '@angular/core';
import {ContasFixasService} from "../../services/financa.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Categoria} from "../../models/categoria.model";
import {CategoriaService} from "../../services/categoria.service";
import {Account} from "../../models/account.model";
import {AccountService} from "../../services/account.service";
import {Financa} from "../../models/financa.model";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-despesas-fixas',
  templateUrl: './despesas-fixas.component.html',
  styleUrls: ['./despesas-fixas.component.css']
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
    private snackBar: MatSnackBar
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
    this.accountService.listarAccounts(0, 50, '').subscribe({
      next: accountPage => {
        this.accounts = accountPage.content;
      }
    });

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
}
