import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { ContasFixasService } from '../../services/financa.service';
import { CategoriaService } from '../../services/categoria.service';
import { AccountService } from '../../services/account.service';
import { ContaFixaRecorrente, TipoRecorrencia, TipoRecorrenciaInfo } from '../../models/conta-fixa.model';
import { Categoria } from '../../models/categoria.model';
import { Account } from '../../models/account.model';

@Component({
    selector: 'app-conta-fixa-recorrente',
    templateUrl: './conta-fixa-recorrente.component.html',
    styleUrls: ['./conta-fixa-recorrente.component.css'],
    standalone: false
})
export class ContaFixaRecorrenteComponent implements OnInit {
  
  contaRecorrenteForm: FormGroup;
  categorias: Categoria[] = [];
  contas: Account[] = [];
  loading = false;

  tiposRecorrencia: TipoRecorrenciaInfo[] = [
    { valor: TipoRecorrencia.MENSAL, descricao: 'Mensal', meses: 1 },
    { valor: TipoRecorrencia.BIMENSAL, descricao: 'Bimensal (2 meses)', meses: 2 },
    { valor: TipoRecorrencia.TRIMESTRAL, descricao: 'Trimestral (3 meses)', meses: 3 },
    { valor: TipoRecorrencia.SEMESTRAL, descricao: 'Semestral (6 meses)', meses: 6 },
    { valor: TipoRecorrencia.ANUAL, descricao: 'Anual (12 meses)', meses: 12 }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private contasFixasService: ContasFixasService,
    private categoriaService: CategoriaService,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.contaRecorrenteForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      categoriaId: ['', Validators.required],
      contaId: ['', Validators.required],
      dataInicio: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(0.01)]],
      numeroParcelas: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      tipoRecorrencia: ['', Validators.required],
      observacoes: ['']
    });
  }

  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarContas();
    
    // Definir data padrão como primeiro dia do próximo mês
    const proximoMes = new Date();
    proximoMes.setMonth(proximoMes.getMonth() + 1);
    proximoMes.setDate(1);
    
    this.contaRecorrenteForm.patchValue({
      dataInicio: proximoMes.toISOString().split('T')[0],
      tipoRecorrencia: TipoRecorrencia.MENSAL,
      numeroParcelas: 12
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

  criarContasRecorrentes(): void {
    if (this.contaRecorrenteForm.invalid) {
      this.marcarCamposComoTocados();
      return;
    }

    this.loading = true;
    const dadosForm = this.contaRecorrenteForm.value;
    
    const contaRecorrente: ContaFixaRecorrente = {
      nome: dadosForm.nome,
      categoriaId: dadosForm.categoriaId,
      contaId: dadosForm.contaId,
      dataInicio: dadosForm.dataInicio,
      valor: dadosForm.valor,
      numeroParcelas: dadosForm.numeroParcelas,
      tipoRecorrencia: dadosForm.tipoRecorrencia,
      observacoes: dadosForm.observacoes || undefined
    };

    this.contasFixasService.criarContasFixasRecorrentes(contaRecorrente).subscribe({
      next: (contasCriadas) => {
        this.loading = false;
        this.mostrarMensagem(
          `${contasCriadas.length} contas fixas criadas com sucesso!`, 
          'success'
        );
        this.contaRecorrenteForm.reset();
        
        // Redirecionar para a listagem de contas fixas
        setTimeout(() => {
          this.router.navigate(['/despesas-fixas']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        console.error('Erro ao criar contas recorrentes:', error);
        
        let mensagemErro = 'Erro ao criar contas recorrentes';
        if (error.error?.message) {
          mensagemErro = error.error.message;
        } else if (error.status === 400) {
          mensagemErro = 'Dados inválidos. Verifique os campos preenchidos.';
        }
        
        this.mostrarMensagem(mensagemErro, 'error');
      }
    });
  }

  private marcarCamposComoTocados(): void {
    Object.keys(this.contaRecorrenteForm.controls).forEach(key => {
      this.contaRecorrenteForm.get(key)?.markAsTouched();
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

  calcularDataFinal(): string {
    const form = this.contaRecorrenteForm.value;
    if (!form.dataInicio || !form.numeroParcelas || !form.tipoRecorrencia) {
      return '';
    }

    const dataInicio = new Date(form.dataInicio + 'T00:00:00');
    const tipoInfo = this.tiposRecorrencia.find(t => t.valor === form.tipoRecorrencia);
    
    if (!tipoInfo) return '';
    
    const mesesTotais = (form.numeroParcelas - 1) * tipoInfo.meses;
    const dataFinal = new Date(dataInicio);
    dataFinal.setMonth(dataFinal.getMonth() + mesesTotais);
    
    return dataFinal.toLocaleDateString('pt-BR');
  }

  calcularValorTotal(): number {
    const form = this.contaRecorrenteForm.value;
    return (form.valor || 0) * (form.numeroParcelas || 0);
  }

  voltarParaListagem(): void {
    this.router.navigate(['/despesas-fixas']);
  }

  // Getters para facilitar validação no template
  get nome() { return this.contaRecorrenteForm.get('nome'); }
  get categoriaId() { return this.contaRecorrenteForm.get('categoriaId'); }
  get contaId() { return this.contaRecorrenteForm.get('contaId'); }
  get dataInicio() { return this.contaRecorrenteForm.get('dataInicio'); }
  get valor() { return this.contaRecorrenteForm.get('valor'); }
  get numeroParcelas() { return this.contaRecorrenteForm.get('numeroParcelas'); }
  get tipoRecorrencia() { return this.contaRecorrenteForm.get('tipoRecorrencia'); }
}
