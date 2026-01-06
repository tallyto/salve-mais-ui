import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { merge, of as observableOf, startWith, switchMap, catchError, map } from 'rxjs';
import { FaturaService } from '@services/fatura.service';
import { CartaoService } from '@services/cartao.service';
import { FaturaManualDTO, FaturaResponseDTO, FaturaPreviewDTO } from '@models/fatura.model';
import { Cartao } from '@models/cartao.model';
import { PagamentoFaturaModalComponent } from '../pagamento-fatura-modal/pagamento-fatura-modal.component';

interface MonthOption {
  value: number;
  label: string;
}

@Component({
    selector: 'app-fatura-form',
    templateUrl: './fatura-form.component.html',
    styleUrls: ['./fatura-form.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatSnackBarModule,
        MatDialogModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatCardModule,
        MatIconModule,
        MatProgressBarModule,
        MatChipsModule,
        MatTooltipModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatProgressSpinnerModule
    ]
})
export class FaturaFormComponent implements OnInit, AfterViewInit {
  faturaForm: FormGroup;
  previewForm: FormGroup;
  cartoes: Cartao[] = [];
  faturas: FaturaResponseDTO[] = [];
  loading = false;
  mostrarFormulario = false;
  mostrarPreview = false;
  loadingPreview = false;
  preview: FaturaPreviewDTO | null = null;

  resultsLength = 0;
  isLoadingResults = true;

  // Filtros de mês e ano
  selectedMonth: number;
  selectedYear: number;
  months: MonthOption[] = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];
  years: number[] = [];

  // @ts-expect-error
  @ViewChild(MatPaginator) paginator: MatPaginator
  // @ts-expect-error
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['nomeCartao', 'valorTotal', 'dataVencimento', 'dataPagamento', 'contaPagamento', 'pago', 'totalCompras', 'acoes'];

  constructor(
    private fb: FormBuilder,
    private faturaService: FaturaService,
    private cartaoService: CartaoService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
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
    this.refreshFaturasList();
  }

  private generateYears(): void {
    const currentYear = new Date().getFullYear();
    this.years = [];
    for (let year = currentYear - 3; year <= currentYear + 2; year++) {
      this.years.push(year);
    }
  }

  onFilterChange(): void {
    this.paginator.pageIndex = 0;
    this.refreshFaturasList();
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
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          const sort = `${this.sort.active},${this.sort.direction}`;
          return this.faturaService.listarFaturasNovas(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            sort,
            this.selectedMonth,
            this.selectedYear
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;

          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.resultsLength = data.totalElements;
          return data.content;
        }),
      )
      .subscribe(data => (this.faturas = data));
  }

  carregarCartoes(): void {
    this.cartaoService.listarCartoes().subscribe({
      next: (cartoes) => {
        this.cartoes = cartoes;
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar cartões', 'Fechar', { duration: 3000 });
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
          this.snackBar.open('Fatura criada com sucesso!', 'Fechar', { duration: 3000 });
          this.faturaForm.reset();
          this.mostrarFormulario = false;
          this.carregarFaturas();
          this.loading = false;
        },
        error: (error) => {
          this.snackBar.open('Erro ao criar fatura', 'Fechar', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  marcarComoPaga(fatura: FaturaResponseDTO): void {
    const dialogRef = this.dialog.open(PagamentoFaturaModalComponent, {
      width: '800px',
      minWidth: '600px',
      maxWidth: '90vw',
      height: 'auto',
      minHeight: '500px',
      maxHeight: '90vh',
      data: { fatura: fatura },
      disableClose: true,
      panelClass: 'custom-modal-panel'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.carregarFaturas();
      }
    });
  }

  marcarComoPageSimples(id: number): void {
    this.faturaService.marcarComoPaga(id).subscribe({
      next: () => {
        this.snackBar.open('Fatura marcada como paga!', 'Fechar', { duration: 3000 });
        this.carregarFaturas();
      },
      error: (error) => {
        this.snackBar.open('Erro ao marcar fatura como paga', 'Fechar', { duration: 3000 });
      }
    });
  }

  excluirFatura(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta fatura?')) {
      this.faturaService.excluirFatura(id).subscribe({
        next: () => {
          this.snackBar.open('Fatura excluída com sucesso!', 'Fechar', { duration: 3000 });
          this.carregarFaturas();
        },
        error: (error) => {
          this.snackBar.open('Erro ao excluir fatura', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  gerarFaturaAutomatica(cartaoId: number): void {
    this.faturaService.gerarFaturaAutomatica(cartaoId).subscribe({
      next: () => {
        this.snackBar.open('Fatura automática gerada com sucesso!', 'Fechar', { duration: 3000 });
        this.carregarFaturas();
      },
      error: (error) => {
        this.snackBar.open('Erro ao gerar fatura automática', 'Fechar', { duration: 3000 });
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
          this.snackBar.open('Erro ao buscar preview da fatura', 'Fechar', { duration: 3000 });
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
        this.snackBar.open('Fatura gerada com sucesso!', 'Fechar', { duration: 3000 });
        this.togglePreview();
        this.carregarFaturas();
        this.loading = false;
      },
      error: (error: any) => {
        this.snackBar.open('Erro ao gerar fatura', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  formatarDiaVencimento(vencimento: string): string {
    const data = new Date(vencimento);
    return data.getDate().toString().padStart(2, '0');
  }
}
