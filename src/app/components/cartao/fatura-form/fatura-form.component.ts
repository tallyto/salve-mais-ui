import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { of as observableOf, catchError, map } from 'rxjs';
import { CurrencyInputDirective } from '@directives/currency-input.directive';
import { FaturaService } from '@services/fatura.service';
import { CartaoService } from '@services/cartao.service';
import { FaturaManualDTO, FaturaResponseDTO, FaturaPreviewDTO } from '@models/fatura.model';
import { Cartao } from '@models/cartao.model';
import { MonthYearFilterComponent } from '@components/dashboard/month-year-filter/month-year-filter.component';
import { SALVE_COMMON, SALVE_FORMS, SALVE_DATA } from '@shared/primeng-shared';
import { MONTHS, generateYears as utilGenerateYears, formatarMoeda } from '@shared/utils';
import { LazyTableBase } from '@shared/lazy-table.base';
import { StatCardComponent } from '@components/shared';

@Component({
    selector: 'app-fatura-form',
    templateUrl: './fatura-form.component.html',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CurrencyInputDirective,
        MonthYearFilterComponent,
        StatCardComponent,
        ...SALVE_COMMON,
        ...SALVE_FORMS,
        ...SALVE_DATA
    ]
})
export class FaturaFormComponent extends LazyTableBase implements OnInit, AfterViewInit {
  faturaForm: FormGroup;
  previewForm: FormGroup;
  cartoes: Cartao[] = [];
  faturas: FaturaResponseDTO[] = [];
  loading = false;
  mostrarFormulario = false;
  mostrarPreview = false;
  loadingPreview = false;
  preview: FaturaPreviewDTO | null = null;
  formatarMoeda = formatarMoeda;

  // Filtros de mês e ano
  selectedMonth: number;
  selectedYear: number;
  months = MONTHS;
  years: number[] = [];

  displayedColumns: string[] = ['nomeCartao', 'valorTotal', 'dataVencimento', 'dataPagamento', 'contaPagamento', 'pago', 'totalCompras', 'acoes'];

  constructor(
    private fb: FormBuilder,
    private faturaService: FaturaService,
    private cartaoService: CartaoService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) {
    super();
    this.faturaForm = this.fb.group({
      cartaoCreditoId: ['', Validators.required],
      valorTotal: ['', [Validators.required, Validators.min(0.01)]],
      dataVencimento: ['', Validators.required]
    });

    this.previewForm = this.fb.group({
      cartaoCreditoId: ['', Validators.required],
      dataVencimento: ['', Validators.required]
    });

    // Inicializar filtros com mês e ano atuais
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();

    // Gerar lista de anos
    this.generateYears();
  }

  ngOnInit(): void {
    this.carregarCartoes();
  }

  ngAfterViewInit(): void {
    this.carregarDados();
  }

  protected carregarDados(): void {
    this.refreshFaturasList();
  }

  private generateYears(): void {
    this.years = utilGenerateYears();
  }

  onFilterChange(): void {
    this.refreshFaturasList();
  }

  onPeriodChange(period: { month: number; year: number }): void {
    this.selectedMonth = period.month;
    this.selectedYear = period.year;
    this.onFilterChange();
  }

  resetFilters(): void {
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();
    this.onFilterChange();
  }

  getSelectedPeriodText(): string {
    const monthName = this.months.find(m => m.value === this.selectedMonth)?.label || '';
    return `${monthName} de ${this.selectedYear}`;
  }

  calcularTotalFaturas(): number {
    return this.faturas.reduce((sum, fatura) => sum + (fatura.valorTotal || 0), 0);
  }

  previousMonth(): void {
    if (this.selectedMonth === 1) {
      this.selectedMonth = 12;
      this.selectedYear--;
    } else {
      this.selectedMonth--;
    }
    this.onFilterChange();
  }

  nextMonth(): void {
    if (this.selectedMonth === 12) {
      this.selectedMonth = 1;
      this.selectedYear++;
    } else {
      this.selectedMonth++;
    }
    this.onFilterChange();
  }

  setLastMonth(): void {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    this.selectedMonth = lastMonth.getMonth() + 1;
    this.selectedYear = lastMonth.getFullYear();
    this.onFilterChange();
  }

  setNextMonth(): void {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    this.selectedMonth = nextMonth.getMonth() + 1;
    this.selectedYear = nextMonth.getFullYear();
    this.onFilterChange();
  }

  isCurrentMonth(): boolean {
    const currentDate = new Date();
    return this.selectedMonth === currentDate.getMonth() + 1 && 
           this.selectedYear === currentDate.getFullYear();
  }

  isLastMonth(): boolean {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return this.selectedMonth === lastMonth.getMonth() + 1 && 
           this.selectedYear === lastMonth.getFullYear();
  }

  isNextMonth(): boolean {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return this.selectedMonth === nextMonth.getMonth() + 1 && 
           this.selectedYear === nextMonth.getFullYear();
  }

  private refreshFaturasList(): void {
    this.isLoadingResults = true;
    const pageIndex = 0;
    const pageSize = 10;
    const sort = 'id,desc';

    this.faturaService.listarFaturasNovas(
      pageIndex,
      pageSize,
      sort,
      this.selectedMonth,
      this.selectedYear
    ).pipe(
      catchError(() => observableOf(null)),
      map(data => {
        this.isLoadingResults = false;
        if (data === null) {
          return [];
        }
        this.resultsLength = data.totalElements;
        return data.content;
      })
    ).subscribe(data => (this.faturas = data));
  }

  carregarCartoes(): void {
    this.cartaoService.listarCartoes().subscribe({
      next: (cartoes) => {
        this.cartoes = cartoes;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar cartões', life: 3000 });
      }
    });
  }

  carregarFaturas(): void {
    this.refreshFaturasList();
  }

  onSubmit(): void {
    if (this.faturaForm.valid) {
      this.loading = true;

      const dataVencimento = this.faturaForm.value.dataVencimento;
      const dataFormatada = dataVencimento instanceof Date
        ? dataVencimento.toISOString().split('T')[0]
        : dataVencimento;

      const faturaData: FaturaManualDTO = {
        cartaoCreditoId: this.faturaForm.value.cartaoCreditoId,
        valorTotal: this.faturaForm.value.valorTotal,
        dataVencimento: dataFormatada
      };

      this.faturaService.criarFaturaManual(faturaData).subscribe({
        next: (fatura) => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Fatura criada com sucesso!', life: 3000 });
          this.faturaForm.reset();
          this.mostrarFormulario = false;
          this.carregarFaturas();
          this.loading = false;
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar fatura', life: 3000 });
          this.loading = false;
        }
      });
    }
  }

  marcarComoPaga(fatura: FaturaResponseDTO): void {
    this.marcarComoPageSimples(fatura.id);
  }

  marcarComoPageSimples(id: number): void {
    this.faturaService.marcarComoPaga(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Fatura marcada como paga!', life: 3000 });
        this.carregarFaturas();
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao marcar fatura como paga', life: 3000 });
      }
    });
  }

  excluirFatura(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta fatura?')) {
      this.faturaService.excluirFatura(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Fatura excluída com sucesso!', life: 3000 });
          this.carregarFaturas();
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir fatura', life: 3000 });
        }
      });
    }
  }

  gerarFaturaAutomatica(cartaoId: number): void {
    this.faturaService.gerarFaturaAutomatica(cartaoId).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Fatura automática gerada com sucesso!', life: 3000 });
        this.carregarFaturas();
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao gerar fatura automática', life: 3000 });
      }
    });
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.faturaForm.reset();
    }
  }

  togglePreview(): void {
    this.mostrarPreview = !this.mostrarPreview;
    if (!this.mostrarPreview) {
      this.previewForm.reset();
      this.preview = null;
    }
  }

  onCartaoPreviewChange(cartaoId: number): void {
    const cartaoSelecionado = this.cartoes.find(c => c.id === cartaoId);
    if (cartaoSelecionado && cartaoSelecionado.vencimento) {
      // Extrai apenas o dia do vencimento do cartão e cria data no mês atual
      const diaVencimento = parseInt(this.formatarDiaVencimento(cartaoSelecionado.vencimento));
      const hoje = new Date();
      const dataVencimentoMesAtual = new Date(hoje.getFullYear(), hoje.getMonth(), diaVencimento);
      
      // Formata para YYYY-MM-DD para o input
      const dataFormatada = dataVencimentoMesAtual.toISOString().split('T')[0];
      
      this.previewForm.patchValue({
        dataVencimento: dataFormatada
      });
    }
  }

  buscarPreview(): void {
    if (this.previewForm.valid) {
      this.loadingPreview = true;

      const dataVencimento = this.previewForm.value.dataVencimento;
      const dataFormatada = dataVencimento instanceof Date
        ? dataVencimento.toISOString().split('T')[0]
        : dataVencimento;

      this.faturaService.buscarPreviewFatura(
        this.previewForm.value.cartaoCreditoId,
        dataFormatada
      ).subscribe({
        next: (preview) => {
          this.preview = preview;
          this.loadingPreview = false;
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar preview da fatura', life: 3000 });
          this.loadingPreview = false;
        }
      });
    }
  }

  gerarFaturaDaPreview(): void {
    if (!this.preview) return;

    this.loading = true;
    
    // Usa a data de vencimento do preview para garantir que gera com o mês atual
    const dataVencimento = this.preview.dataVencimento;
    
    this.faturaService.gerarFaturaAutomatica(this.preview.cartaoCreditoId, dataVencimento).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Fatura gerada com sucesso!', life: 3000 });
        this.togglePreview();
        this.carregarFaturas();
        this.loading = false;
      },
      error: (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao gerar fatura', life: 3000 });
        this.loading = false;
      }
    });
  }


  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  formatarDiaVencimento(vencimento: string): string {
    const data = new Date(vencimento);
    return data.getDate().toString().padStart(2, '0');
  }
}
