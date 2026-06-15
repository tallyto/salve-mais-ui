import { Component, OnInit } from '@angular/core';
import { catchError, map, of as observableOf } from "rxjs";
import {GastoCartao} from "../../models/gasto-cartao.model";
import {GastoCartaoService} from "../../services/gasto-cartao.service";
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { MONTHS, generateYears } from '../../shared/utils';
import { LazyTableBase } from '../../shared/lazy-table.base';

@Component({
  standalone: false,
  selector: 'app-list-despesas-recorrentes',
  templateUrl: './list-despesas-recorrentes.component.html'
})
export class ListDespesasRecorrentesComponent extends LazyTableBase implements OnInit {

  displayedColumnsGastoRecorrente: string[] = ['descricao', 'categoria', 'cartaoCredito', 'data', 'valor', 'acoes'];
  listGastosRecorrentes: GastoCartao[] = [];
  override sortField = 'data';

  // Filtros de mês e ano
  selectedMonth: number;
  selectedYear: number;
  months = MONTHS;
  years: number[] = [];

  constructor(
    private despesaRecorrenteService: GastoCartaoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {
    super();
    this.despesaRecorrenteService.gastaoCartaoSaved.subscribe({
      next: () => {
        this.carregarDados()
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
    this.carregarDados()
  }

  protected carregarDados(): void {
    this.refreshGastosRecorrentesList();
  }

  private refreshGastosRecorrentesList() {
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

  override onLazyLoad(event: TableLazyLoadEvent): void {
    super.onLazyLoad(event);
    this.carregarDados();
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
    this.years = generateYears();
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

}
