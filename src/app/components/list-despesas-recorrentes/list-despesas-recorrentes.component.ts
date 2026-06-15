import { Component, OnInit } from '@angular/core';
import { catchError, map, of as observableOf } from "rxjs";
import {GastoCartao} from "../../models/gasto-cartao.model";
import {GastoCartaoService} from "../../services/gasto-cartao.service";
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';

interface MonthOption {
  value: number;
  label: string;
}

@Component({
  standalone: false,
  selector: 'app-list-despesas-recorrentes',
  templateUrl: './list-despesas-recorrentes.component.html'
})
export class ListDespesasRecorrentesComponent implements OnInit {

  displayedColumnsGastoRecorrente: string[] = ['descricao', 'categoria', 'cartaoCredito', 'data', 'valor', 'acoes'];
  listGastosRecorrentes: GastoCartao[] = [];
  resultsLength = 0;
  isLoadingResults = true;
  pageSize = 10;
  pageIndex = 0;
  sortField = 'data';
  sortOrder = 'desc';

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

  constructor(
    private despesaRecorrenteService: GastoCartaoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {
    this.despesaRecorrenteService.gastaoCartaoSaved.subscribe({
      next: () => {
        this.refreshGastosRecorrentesList()
      }
    });

    // Inicializar filtros com mês e ano atuais
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1; // getMonth() retorna 0-11
    this.selectedYear = currentDate.getFullYear();

    // Gerar lista de anos (últimos 3 anos até próximos 2 anos)
    this.generateYears();
  }

  ngOnInit(): void {
    this.refreshGastosRecorrentesList()
  }

  refreshGastosRecorrentesList() {
    this.isLoadingResults = true;
    const sort = `${this.sortField},${this.sortOrder}`;

    this.despesaRecorrenteService.listCompras(
      this.pageIndex,
      this.pageSize,
      sort,
      this.selectedMonth,
      this.selectedYear
    ).pipe(
      catchError(() => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar gastos recorrentes.' });
        return observableOf(null);
      }),
      map(data => {
        this.isLoadingResults = false;

        if (!data) {
          this.resultsLength = 0;
          return [];
        }

        this.resultsLength = data.totalElements;
        return data.content;
      }),
    )
    .subscribe(data => (this.listGastosRecorrentes = data));
  }

  editarGasto(gastoRecorrente: GastoCartao): void {
    this.despesaRecorrenteService.editingGasto.emit(gastoRecorrente);
  }

  onFilterChange(): void {
    this.pageIndex = 0;
    this.refreshGastosRecorrentesList();
  }

  onPeriodChange(period: { month: number; year: number }): void {
    this.selectedMonth = period.month;
    this.selectedYear = period.year;
    this.onFilterChange();
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    const rows = event.rows ?? this.pageSize;
    this.pageSize = rows;
    this.pageIndex = Math.floor((event.first ?? 0) / rows);
    this.sortField = this.resolveSortField(event.sortField);
    this.sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';
    this.refreshGastosRecorrentesList();
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

  calcularTotal(): number {
    return this.listGastosRecorrentes.reduce((sum, gasto) => sum + (gasto.valor || 0), 0);
  }

  private generateYears(): void {
    const currentYear = new Date().getFullYear();
    this.years = [];

    // Gerar anos dos últimos 3 anos até os próximos 2 anos
    for (let year = currentYear - 3; year <= currentYear + 2; year++) {
      this.years.push(year);
    }
  }
  
  /**
   * Navega para o mês anterior
   */
  previousMonth(): void {
    if (this.selectedMonth === 1) {
      this.selectedMonth = 12;
      this.selectedYear--;
    } else {
      this.selectedMonth--;
    }
    this.onFilterChange();
  }
  
  /**
   * Navega para o próximo mês
   */
  nextMonth(): void {
    if (this.selectedMonth === 12) {
      this.selectedMonth = 1;
      this.selectedYear++;
    } else {
      this.selectedMonth++;
    }
    this.onFilterChange();
  }
  
  /**
   * Define o filtro para o mês passado
   */
  setLastMonth(): void {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    this.selectedMonth = lastMonth.getMonth() + 1;
    this.selectedYear = lastMonth.getFullYear();
    this.onFilterChange();
  }
  
  /**
   * Define o filtro para o próximo mês
   */
  setNextMonth(): void {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    this.selectedMonth = nextMonth.getMonth() + 1;
    this.selectedYear = nextMonth.getFullYear();
    this.onFilterChange();
  }
  
  /**
   * Verifica se o filtro está no mês atual
   */
  isCurrentMonth(): boolean {
    const currentDate = new Date();
    return this.selectedMonth === currentDate.getMonth() + 1 && 
           this.selectedYear === currentDate.getFullYear();
  }
  
  /**
   * Verifica se o filtro está no mês passado
   */
  isLastMonth(): boolean {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return this.selectedMonth === lastMonth.getMonth() + 1 && 
           this.selectedYear === lastMonth.getFullYear();
  }
  
  /**
   * Verifica se o filtro está no próximo mês
   */
  isNextMonth(): boolean {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return this.selectedMonth === nextMonth.getMonth() + 1 && 
           this.selectedYear === nextMonth.getFullYear();
  }

  excluirGasto(gastoRecorrente: GastoCartao): void {
    this.confirmationService.confirm({
      message: `Deseja realmente excluir o gasto "${gastoRecorrente.descricao}"?`,
      header: 'Excluir gasto',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.despesaRecorrenteService.excluirCompra(gastoRecorrente.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Gasto excluído com sucesso.' });
            this.refreshGastosRecorrentesList();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir gasto.' });
          }
        });
      }
    });
  }

  private resolveSortField(sortField: string | string[] | null | undefined): string {
    if (Array.isArray(sortField)) {
      return sortField[0] ?? 'data';
    }

    return sortField || 'data';
  }
}
