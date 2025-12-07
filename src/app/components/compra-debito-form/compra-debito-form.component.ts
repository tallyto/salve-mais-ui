import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';

import { CompraDebitoService } from '../../services/compra-debito.service';
import { CategoriaService } from '../../services/categoria.service';
import { AccountService } from '../../services/account.service';
import { CompraDebitoInput } from '../../models/compra-debito.model';
import { Categoria } from '../../models/categoria.model';
import { Account } from '../../models/account.model';

@Component({
    selector: 'app-compra-debito-form',
    templateUrl: './compra-debito-form.component.html',
    styleUrls: ['./compra-debito-form.component.css'],
    standalone: false
})
export class CompraDebitoFormComponent implements OnInit {
  
  compraDebitoForm: FormGroup;
  categorias: Categoria[] = [];
  contas: Account[] = [];
  loading = false;
  isEditing = false;
  compraDebitoId?: number;

  constructor(
    private formBuilder: FormBuilder,
    private compraDebitoService: CompraDebitoService,
    private categoriaService: CategoriaService,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
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
        console.error('Erro ao carregar categorias:', error);
        this.mostrarMensagem('Erro ao carregar categorias', 'error');
      }
    });
  }

  carregarContas(): void {
    this.accountService.listarAccounts(0, 50, '').subscribe({
      next: (response) => {
        this.contas = response.content;
      },
      error: (error) => {
        console.error('Erro ao carregar contas:', error);
        this.mostrarMensagem('Erro ao carregar contas', 'error');
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
        console.error('Erro ao carregar compra:', error);
        this.mostrarMensagem('Erro ao carregar compra', 'error');
        this.router.navigate(['/compras-debito']);
      }
    });
  }

  salvarCompraDebito(): void {
    if (this.compraDebitoForm.invalid) {
      this.marcarCamposComoTocados();
      return;
    }

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
          this.mostrarMensagem('Compra atualizada com sucesso!', 'success');
          setTimeout(() => {
            this.router.navigate(['/compras-debito']);
          }, 1500);
        },
        error: (error) => {
          this.loading = false;
          console.error('Erro ao atualizar compra:', error);
          this.tratarErro(error);
        }
      });
    } else {
      // Criação
      this.compraDebitoService.criarCompraDebito(compraDebito).subscribe({
        next: () => {
          this.loading = false;
          this.mostrarMensagem('Compra registrada com sucesso!', 'success');
          this.compraDebitoForm.reset();
          
          // Redirecionar para a listagem
          setTimeout(() => {
            this.router.navigate(['/compras-debito']);
          }, 1500);
        },
        error: (error) => {
          this.loading = false;
          console.error('Erro ao registrar compra:', error);
          this.tratarErro(error);
        }
      });
    }
  }

  private tratarErro(error: any): void {
    let mensagemErro = this.isEditing ? 'Erro ao atualizar compra' : 'Erro ao registrar compra';
    
    if (error.error?.message) {
      mensagemErro = error.error.message;
    } else if (error.status === 400) {
      if (error.error && typeof error.error === 'string' && error.error.includes('Saldo insuficiente')) {
        mensagemErro = 'Saldo insuficiente na conta para realizar esta compra';
      } else {
        mensagemErro = 'Dados inválidos. Verifique os campos preenchidos.';
      }
    }
    
    this.mostrarMensagem(mensagemErro, 'error');
  }

  private marcarCamposComoTocados(): void {
    Object.keys(this.compraDebitoForm.controls).forEach(key => {
      this.compraDebitoForm.get(key)?.markAsTouched();
    });
  }

  private mostrarMensagem(mensagem: string, tipo: 'success' | 'error'): void {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: tipo === 'success' ? 3000 : 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: tipo === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }

  voltarParaListagem(): void {
    this.router.navigate(['/compras-debito']);
  }

  // Getters para facilitar validação no template
  get nome() { return this.compraDebitoForm.get('nome'); }
  get categoriaId() { return this.compraDebitoForm.get('categoriaId'); }
  get contaId() { return this.compraDebitoForm.get('contaId'); }
  get dataCompra() { return this.compraDebitoForm.get('dataCompra'); }
  get valor() { return this.compraDebitoForm.get('valor'); }
  get observacoes() { return this.compraDebitoForm.get('observacoes'); }
}
