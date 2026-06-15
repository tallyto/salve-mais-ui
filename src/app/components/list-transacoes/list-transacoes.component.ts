import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TransacaoService } from '../../services/transacao.service';
import { Transacao, TransacaoFiltro } from '../../models/transacao.model';
import { TipoTransacao } from '../../models/tipo-transacao.enum';
import { ContaService } from '../../services/conta.service';
import { CategoriaService } from '../../services/categoria.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SALVE_COMMON, SALVE_FORMS, SALVE_DATA, SALVE_OVERLAY } from '../../shared/primeng-shared';
import { EmptyStateComponent } from '../shared/empty-state.component';

@Component({
  selector: 'app-list-transacoes',
  templateUrl: './list-transacoes.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ...SALVE_COMMON,
    ...SALVE_FORMS,
    ...SALVE_DATA,
    ...SALVE_OVERLAY,
    EmptyStateComponent
  ]
})
export class ListTransacoesComponent implements OnInit {
  transacoes: Transacao[] = [];
  filtroForm: FormGroup;
  tiposTransacao = Object.values(TipoTransacao);
  tipoOptions: any[] = [];
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
  private menuCache = new Map<number, any[]>();

  constructor(
    private transacaoService: TransacaoService,
    private contaService: ContaService,
    private categoriaService: CategoriaService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
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
    this.carregarContas();
    this.carregarCategorias();
    this.setupTipoOptions();
  }

  setupTipoOptions(): void {
    this.tipoOptions = [
      { label: 'Entrada (Crédito)', value: 'CREDITO' },
      { label: 'Saída (Débito)', value: 'DEBITO' },
      { label: 'Transferência Entrada', value: 'TRANSFERENCIA_ENTRADA' },
      { label: 'Transferência Saída', value: 'TRANSFERENCIA_SAIDA' },
      { label: 'Pagamento Fatura', value: 'PAGAMENTO_FATURA' }
    ];
  }

  carregarTransacoes(filtro?: TransacaoFiltro): void {
    this.loading = true;
    this.menuCache.clear();
    this.transacaoService.listarTransacoes(filtro, this.pageIndex, this.pageSize)
      .subscribe(
        response => {
          this.transacoes = response.content;
          this.totalElements = response.totalElements;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error => {
          this.loading = false;
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar transações' });
        }
      );
  }

  carregarContas(): void {
    this.contaService.getContas().subscribe(
      (contas: any[]) => {
        this.contas = contas;
      },
      (error: any) => {
      }
    );
  }

  carregarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe(
      categorias => {
        this.categorias = categorias;
      },
      error => {
      }
    );
  }

  aplicarFiltro(): void {
    const filtro: TransacaoFiltro = {};

    const formValue = this.filtroForm.value;

    if (formValue.contaId && formValue.contaId !== null) {
      filtro.contaId = formValue.contaId;
    }
    if (formValue.tipo && formValue.tipo !== null) {
      filtro.tipo = formValue.tipo;
    }
    if (formValue.categoriaId && formValue.categoriaId !== null) {
      filtro.categoriaId = formValue.categoriaId;
    }
    if (formValue.dataInicio) {
      filtro.dataInicio = formValue.dataInicio;
    }
    if (formValue.dataFim) {
      filtro.dataFim = formValue.dataFim;
    }

    this.pageIndex = 0;
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

  mudarPagina(event: any): void {
    if (event.first !== undefined) {
      this.pageIndex = Math.floor(event.first / (event.rows || this.pageSize));
    }
    if (event.rows) {
      this.pageSize = event.rows;
    }
    this.carregarTransacoes(this.filtroForm.value);
  }

  getSinalValor(tipo: TipoTransacao | string): string {
    const tipoStr = typeof tipo === 'string' ? tipo : tipo;
    switch (tipoStr) {
      case 'CREDITO':
      case 'TRANSFERENCIA_ENTRADA':
        return '+';
      case 'DEBITO':
      case 'TRANSFERENCIA_SAIDA':
      case 'PAGAMENTO_FATURA':
        return '-';
      default:
        return '';
    }
  }

  getTipoTransacaoLabel(tipo: TipoTransacao | string): string {
    const tipoStr = typeof tipo === 'string' ? tipo : tipo;
    switch (tipoStr) {
      case 'CREDITO':
        return 'Crédito';
      case 'DEBITO':
        return 'Débito';
      case 'TRANSFERENCIA_SAIDA':
        return 'Transferência (Saída)';
      case 'TRANSFERENCIA_ENTRADA':
        return 'Transferência (Entrada)';
      case 'PAGAMENTO_FATURA':
        return 'Pagamento de Fatura';
      default:
        return tipo as string;
    }
  }

  getTipoDisplayText(tipo: string | null): string {
    if (!tipo) {
      return 'Todos os tipos';
    }
    switch (tipo) {
      case 'CREDITO':
        return 'Entrada (Crédito)';
      case 'DEBITO':
        return 'Saída (Débito)';
      case 'TRANSFERENCIA_ENTRADA':
        return 'Transferência Entrada';
      case 'TRANSFERENCIA_SAIDA':
        return 'Transferência Saída';
      case 'PAGAMENTO_FATURA':
        return 'Pagamento Fatura';
      default:
        return tipo;
    }
  }

  calcularTotalTransacoes(): number {
    return this.transacoes.reduce((total, transacao) => {
      const valor = transacao.valor || 0;
      return this.isEntrada(transacao.tipo) ? total + valor : total - valor;
    }, 0);
  }

  isEntrada(tipo: TipoTransacao | string): boolean {
    const tipoStr = typeof tipo === 'string' ? tipo : tipo;
    return tipoStr === 'CREDITO' || tipoStr === 'TRANSFERENCIA_ENTRADA';
  }

  isSaida(tipo: TipoTransacao | string): boolean {
    const tipoStr = typeof tipo === 'string' ? tipo : tipo;
    return tipoStr === 'DEBITO' ||
           tipoStr === 'TRANSFERENCIA_SAIDA' ||
           tipoStr === 'PAGAMENTO_FATURA';
  }

  getTipoIcon(tipo: TipoTransacao | string): string {
    const tipoStr = typeof tipo === 'string' ? tipo : tipo;
    switch (tipoStr) {
      case 'CREDITO':
        return 'arrow_upward';
      case 'DEBITO':
        return 'arrow_downward';
      case 'TRANSFERENCIA_ENTRADA':
      case 'TRANSFERENCIA_SAIDA':
        return 'swap_horiz';
      case 'PAGAMENTO_FATURA':
        return 'credit_card';
      default:
        return 'help';
    }
  }

  getTipoIconPrime(tipo: TipoTransacao | string): string {
    const tipoStr = typeof tipo === 'string' ? tipo : tipo;
    switch (tipoStr) {
      case 'CREDITO':
        return 'pi-arrow-up';
      case 'DEBITO':
        return 'pi-arrow-down';
      case 'TRANSFERENCIA_ENTRADA':
      case 'TRANSFERENCIA_SAIDA':
        return 'pi-arrow-right-arrow-left';
      case 'PAGAMENTO_FATURA':
        return 'pi-credit-card';
      default:
        return 'pi-question';
    }
  }

  getMenuItems(transacao: Transacao): any[] {
    if (this.menuCache.has(transacao.id)) {
      return this.menuCache.get(transacao.id)!;
    }

    const items = [
      {
        label: 'Detalhes',
        icon: 'pi pi-eye',
        routerLink: ['/transacao', transacao.id]
      },
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        routerLink: ['/transacoes/editar', transacao.id]
      },
      {
        label: 'Excluir',
        icon: 'pi pi-trash',
        command: () => this.confirmarExclusao(transacao)
      }
    ];

    this.menuCache.set(transacao.id, items);
    return items;
  }

  confirmarExclusao(transacao: Transacao): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir a transação #${transacao.id} (${transacao.descricao})? Essa ação não poderá ser desfeita.`,
      header: 'Excluir transação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.excluirTransacao(transacao.id);
      }
    });
  }

  excluirTransacao(id: number): void {
    this.loading = true;
    this.transacaoService.deletarTransacao(id).subscribe({
      next: () => {
        this.carregarTransacoes(this.filtroForm.value);
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Transação excluída com sucesso' });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir transação' });
        this.loading = false;
      }
    });
  }

}
