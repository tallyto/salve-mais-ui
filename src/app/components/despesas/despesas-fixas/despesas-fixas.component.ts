import {Component, OnInit} from '@angular/core';
import {ContasFixasService} from "@services/contas-fixas.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Categoria} from "@models/categoria.model";
import {CategoriaService} from "@services/categoria.service";
import { Conta, TipoConta } from '@models/conta.model';
import {AccountService} from "@services/account.service";
import {Financa} from "@models/financa.model";
import {MessageService} from "primeng/api";
import { filter } from 'rxjs';
import { SALVE_COMMON, SALVE_FORMS, SALVE_DATA, SALVE_OVERLAY } from '@shared/primeng-shared';
import { ListContasFixasComponent } from '@components/despesas/list-contas-fixas/list-contas-fixas.component';

@Component({
    selector: 'app-despesas-fixas',
    templateUrl: './despesas-fixas.component.html',
    standalone: true,
    imports: [...SALVE_COMMON, ...SALVE_FORMS, ...SALVE_DATA, ...SALVE_OVERLAY, ListContasFixasComponent]
})
export class DespesasFixasComponent implements OnInit {
  despesaFixaForm: FormGroup;
  public categorias: Categoria[] = [];
  public accounts: Conta[] = [];
  public editingDespesa: Financa | null = null;

  constructor(
    private financaService: ContasFixasService,
    private formBuilder: FormBuilder,
    private categoriaService: CategoriaService,
    private accountService: AccountService,
    private messageService: MessageService
  ) {
    this.despesaFixaForm = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      categoriaId: [null, Validators.required],
      contaId: [null, Validators.required],
      vencimento: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(0)]],
      pago: [false, Validators.required]
    });
  }

  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarContas();

    // Subscribe to edit event
    this.financaService.editingFinanca$.pipe(
      filter((financa): financa is Financa => financa !== null)
    ).subscribe((financa: Financa) => {
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
        this.financaService.financasChanged$.next(undefined);

        const message = isEditing ? 'Despesa atualizada com sucesso!' : 'Despesa salva com sucesso!';
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: message,
          life: 3000
        });
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao salvar despesa',
          life: 3000
        });
      }
    });
  }

  cancelarEdicao(): void {
    this.despesaFixaForm.reset({
      id: null,
      nome: '',
      categoriaId: null,
      contaId: null,
      vencimento: '',
      valor: '',
      pago: false
    });
    this.editingDespesa = null;
  }

  novaCategoria(): void {
    // TODO: Implementar dialog PrimeNG para criar categoria
    // Por enquanto, apenas recarrega as categorias
    this.carregarCategorias();
  }

  novaConta(): void {
    // TODO: Implementar dialog PrimeNG para criar conta
    // Por enquanto, apenas recarrega as contas
    this.carregarContas();
  }

  carregarContas(): void {
    this.accountService.listar(0, 50, '').subscribe({
      next: accountPage => {
        this.accounts = accountPage.content;
      }
    });
  }
}

