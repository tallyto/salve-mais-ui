import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TransacaoService } from '../../services/transacao.service';
import { Transacao, TransacaoFiltro } from '../../models/transacao.model';
import { TipoTransacao } from '../../models/tipo-transacao.enum';
import { ContaService } from '../../services/conta.service';
import { CategoriaService } from '../../services/categoria.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-list-transacoes',
  templateUrl: './list-transacoes.component.html',
  styleUrls: ['./list-transacoes.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatMenuModule,
    RouterModule
  ]
})
export class ListTransacoesComponent implements OnInit {
  transacoes: Transacao[] = [];
  filtroForm: FormGroup;
  tiposTransacao = Object.values(TipoTransacao);
  contas: any[] = [];
  categorias: any[] = [];
  loading = false;
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  displayedColumns: string[] = [
    'data', 
    'tipo', 
    'descricao', 
    'valor', 
    'conta', 
    'categoria', 
    'acoes'
  ];

  constructor(
    private transacaoService: TransacaoService,
    private contaService: ContaService,
    private categoriaService: CategoriaService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.filtroForm = this.formBuilder.group({
      contaId: [''],
      tipo: [''],
      dataInicio: [''],
      dataFim: [''],
      categoriaId: ['']
    });
  }

  ngOnInit(): void {
    this.carregarTransacoes();
    this.carregarContas();
    this.carregarCategorias();
  }

  carregarTransacoes(filtro?: TransacaoFiltro): void {
    this.loading = true;
    this.transacaoService.listarTransacoes(filtro, this.pageIndex, this.pageSize)
      .subscribe(
        response => {
          this.transacoes = response.content;
          this.totalElements = response.totalElements;
          this.loading = false;
        },
        error => {
          console.error('Erro ao carregar transações', error);
          this.loading = false;
          this.snackBar.open('Erro ao carregar transações', 'Fechar', {
            duration: 3000
          });
        }
      );
  }

  carregarContas(): void {
    this.contaService.getContas().subscribe(
      (contas: any[]) => {
        this.contas = contas;
      },
      (error: any) => {
        console.error('Erro ao carregar contas', error);
      }
    );
  }

  carregarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe(
      categorias => {
        this.categorias = categorias;
      },
      error => {
        console.error('Erro ao carregar categorias', error);
      }
    );
  }

  aplicarFiltro(): void {
    const filtro: TransacaoFiltro = {};
    
    const formValue = this.filtroForm.value;
    
    if (formValue.contaId) {
      filtro.contaId = formValue.contaId;
    }
    if (formValue.tipo) {
      filtro.tipo = formValue.tipo;
    }
    if (formValue.categoriaId) {
      filtro.categoriaId = formValue.categoriaId;
    }
    if (formValue.dataInicio) {
      filtro.dataInicio = formValue.dataInicio;
    }
    if (formValue.dataFim) {
      filtro.dataFim = formValue.dataFim;
    }
    
    this.pageIndex = 0; // Resetar para primeira página ao aplicar filtro
    this.carregarTransacoes(filtro);
  }

  limparFiltro(): void {
    this.filtroForm.reset({
      contaId: null,
      tipo: null,
      categoriaId: null,
      dataInicio: null,
      dataFim: null
    });
    this.pageIndex = 0;
    this.carregarTransacoes();
  }

  mudarPagina(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarTransacoes(this.filtroForm.value);
  }

  getCorValor(tipo: TipoTransacao): string {
    switch (tipo) {
      case TipoTransacao.CREDITO:
      case TipoTransacao.TRANSFERENCIA_ENTRADA:
        return 'texto-positivo';
      case TipoTransacao.DEBITO:
      case TipoTransacao.TRANSFERENCIA_SAIDA:
      case TipoTransacao.PAGAMENTO_FATURA:
        return 'texto-negativo';
      default:
        return '';
    }
  }

  formatarValor(valor: number, tipo: TipoTransacao): string {
    const sinal = this.getSinalValor(tipo);
    return `${sinal} R$ ${valor.toFixed(2)}`;
  }

  private getSinalValor(tipo: TipoTransacao): string {
    switch (tipo) {
      case TipoTransacao.CREDITO:
      case TipoTransacao.TRANSFERENCIA_ENTRADA:
        return '+';
      case TipoTransacao.DEBITO:
      case TipoTransacao.TRANSFERENCIA_SAIDA:
      case TipoTransacao.PAGAMENTO_FATURA:
        return '-';
      default:
        return '';
    }
  }

  getTipoTransacaoLabel(tipo: TipoTransacao): string {
    switch (tipo) {
      case TipoTransacao.CREDITO:
        return 'Crédito';
      case TipoTransacao.DEBITO:
        return 'Débito';
      case TipoTransacao.TRANSFERENCIA_SAIDA:
        return 'Transferência (Saída)';
      case TipoTransacao.TRANSFERENCIA_ENTRADA:
        return 'Transferência (Entrada)';
      case TipoTransacao.PAGAMENTO_FATURA:
        return 'Pagamento de Fatura';
      default:
        return tipo;
    }
  }

  isEntrada(tipo: TipoTransacao): boolean {
    return tipo === TipoTransacao.CREDITO || tipo === TipoTransacao.TRANSFERENCIA_ENTRADA;
  }

  isSaida(tipo: TipoTransacao): boolean {
    return tipo === TipoTransacao.DEBITO || 
           tipo === TipoTransacao.TRANSFERENCIA_SAIDA || 
           tipo === TipoTransacao.PAGAMENTO_FATURA;
  }

  getTipoIcon(tipo: TipoTransacao): string {
    switch (tipo) {
      case TipoTransacao.CREDITO:
        return 'arrow_upward';
      case TipoTransacao.DEBITO:
        return 'arrow_downward';
      case TipoTransacao.TRANSFERENCIA_ENTRADA:
      case TipoTransacao.TRANSFERENCIA_SAIDA:
        return 'swap_horiz';
      case TipoTransacao.PAGAMENTO_FATURA:
        return 'credit_card';
      default:
        return 'help';
    }
  }

  confirmarExclusao(transacao: Transacao): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Excluir transação',
        message: `Tem certeza que deseja excluir a transação <b>#${transacao.id}</b> (<i>${transacao.descricao}</i>)? Essa ação não poderá ser desfeita.`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.excluirTransacao(transacao.id);
      }
    });
  }

  excluirTransacao(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: 'Tem certeza que deseja excluir esta transação?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.transacaoService.deletarTransacao(id).subscribe({
          next: () => {
            this.carregarTransacoes(this.filtroForm.value);
            this.snackBar.open('Transação excluída com sucesso', 'Fechar', { duration: 3000 });
          },
          error: (err) => {
            console.error('Erro ao excluir transação', err);
            this.snackBar.open('Erro ao excluir transação', 'Fechar', { duration: 3000 });
            this.loading = false;
          }
        });
      }
    });
  }

}