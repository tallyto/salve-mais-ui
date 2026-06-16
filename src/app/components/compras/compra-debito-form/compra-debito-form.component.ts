import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { CompraDebitoService } from '@services/compra-debito.service';
import { CategoriaService } from '@services/categoria.service';
import { AccountService } from '@services/account.service';
import { FormBaseService } from '@services/form-base.service';
import { CompraDebitoInput } from '@models/compra-debito.model';
import { Categoria } from '@models/categoria.model';
import { Conta, TipoConta } from '@models/conta.model';
import { SALVE_COMMON, SALVE_FORMS, SALVE_DATA, SALVE_OVERLAY } from '@shared/primeng-shared';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-compra-debito-form',
    templateUrl: './compra-debito-form.component.html',
    standalone: true,
    imports: [
      CommonModule, ReactiveFormsModule,
      ...SALVE_COMMON, ...SALVE_FORMS, ...SALVE_DATA, ...SALVE_OVERLAY
    ]
})
export class CompraDebitoFormComponent implements OnInit {
  
  compraDebitoForm: FormGroup;
  categorias: Categoria[] = [];
  contas: Conta[] = [];
  loading = false;
  isEditing = false;
  compraDebitoId?: number;

  constructor(
    private formBuilder: FormBuilder,
    private compraDebitoService: CompraDebitoService,
    private categoriaService: CategoriaService,
    private accountService: AccountService,
    private formBaseService: FormBaseService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.compraDebitoForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      categoriaId: [''],
      contaId: ['', Validators.required],
      dataCompra: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(0.01)]],
      observacoes: ['']
    });
  }

  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarContas();
    
    // Verificar se está editando
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditing = true;
        this.compraDebitoId = +params['id'];
        this.carregarCompraDebito(this.compraDebitoId);
      } else {
        // Definir data padrão como hoje
        const hoje = new Date();
        this.compraDebitoForm.patchValue({
          dataCompra: hoje.toISOString().split('T')[0]
        });
      }
    });
  }

  carregarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
      },
      error: (error) => {
        this.formBaseService.showError('Erro ao carregar categorias');
      }
    });
  }

  carregarContas(): void {
    this.accountService.listar(0, 50, '').subscribe({
      next: (response) => {
        this.contas = response.content;
      },
      error: (error) => {
        this.formBaseService.showError('Erro ao carregar contas');
      }
    });
  }

  carregarCompraDebito(id: number): void {
    this.compraDebitoService.buscarCompraPorId(id).subscribe({
      next: (compra) => {
        this.compraDebitoForm.patchValue({
          nome: compra.nome,
          categoriaId: compra.categoria?.id || '',
          dataCompra: compra.dataCompra,
          valor: compra.valor,
          observacoes: compra.observacoes || ''
        });
        
        // No modo de edição, não permite alterar a conta e o valor
        this.compraDebitoForm.get('contaId')?.disable();
        this.compraDebitoForm.get('valor')?.disable();
        this.compraDebitoForm.get('dataCompra')?.disable();
      },
      error: (error) => {
        this.formBaseService.showError('Erro ao carregar compra');
        this.router.navigate(['/compras/debito']);
      }
    });
  }

  salvarCompraDebito(): void {
    if (this.compraDebitoForm.invalid) {
      this.formBaseService.markFormAsTouched(this.compraDebitoForm);
      return;
    }

    this.formBaseService.setLoading(true);
    this.loading = true;
    const dadosForm = this.compraDebitoForm.value;
    
    const compraDebito: CompraDebitoInput = {
      nome: dadosForm.nome,
      categoriaId: dadosForm.categoriaId || undefined,
      contaId: dadosForm.contaId,
      dataCompra: dadosForm.dataCompra,
      valor: dadosForm.valor,
      observacoes: dadosForm.observacoes || undefined
    };

    if (this.isEditing && this.compraDebitoId) {
      // Atualização
      this.compraDebitoService.atualizarCompraDebito(this.compraDebitoId, compraDebito).subscribe({
        next: () => {
          this.loading = false;
          this.formBaseService.setLoading(false);
          this.formBaseService.showSuccess('Compra atualizada com sucesso!');
          setTimeout(() => {
            this.router.navigate(['/compras/debito']);
          }, 1500);
        },
        error: (error) => {
          this.loading = false;
          this.formBaseService.setLoading(false);
          const mensagem = this.formBaseService.handleError(error, 'Erro ao atualizar compra');
          this.formBaseService.showError(mensagem);
        }
      });
    } else {
      // Criação
      this.compraDebitoService.criarCompraDebito(compraDebito).subscribe({
        next: () => {
          this.loading = false;
          this.formBaseService.setLoading(false);
          this.formBaseService.showSuccess('Compra registrada com sucesso!');
          this.compraDebitoForm.reset();

          setTimeout(() => {
            this.router.navigate(['/compras/debito']);
          }, 1500);
        },
        error: (error) => {
          this.loading = false;
          this.formBaseService.setLoading(false);
          const mensagem = this.formBaseService.handleError(error, 'Erro ao registrar compra');
          this.formBaseService.showError(mensagem);
        }
      });
    }
  }


  voltarParaListagem(): void {
    this.router.navigate(['/compras/debito']);
  }

  // Getters para facilitar validação no template
  get nome() { return this.compraDebitoForm.get('nome'); }
  get categoriaId() { return this.compraDebitoForm.get('categoriaId'); }
  get contaId() { return this.compraDebitoForm.get('contaId'); }
  get dataCompra() { return this.compraDebitoForm.get('dataCompra'); }
  get valor() { return this.compraDebitoForm.get('valor'); }
  get observacoes() { return this.compraDebitoForm.get('observacoes'); }
}
