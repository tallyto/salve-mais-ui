import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {catchError, map, merge, of as observableOf, startWith, switchMap} from "rxjs";
import {GastoCartao} from "../../models/gasto-cartao.model";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {GastoCartaoService} from "../../services/gasto-cartao.service";
import {MatSnackBar} from "@angular/material/snack-bar";

interface MonthOption {
  value: number;
  label: string;
}

@Component({
  standalone: false,
  selector: 'app-list-despesas-recorrentes',
  templateUrl: './list-despesas-recorrentes.component.html',
  styleUrls: ['./list-despesas-recorrentes.component.css']
})
export class ListDespesasRecorrentesComponent implements AfterViewInit {

  displayedColumnsGastoRecorrente: string[] = ['descricao', 'categoria', 'cartaoCredito', 'data', 'valor', 'acoes'];
  listGastosRecorrentes: GastoCartao[] = [];
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

  constructor(
    private despesaRecorrenteService: GastoCartaoService,
    private snackBar: MatSnackBar
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

  // @ts-expect-error
  @ViewChild(MatPaginator) paginator: MatPaginator
  // @ts-expect-error
  @ViewChild(MatSort) sort: MatSort;

  refreshGastosRecorrentesList() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          const sort = `${this.sort.active},${this.sort.direction}`
          return this.despesaRecorrenteService.listCompras(
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

          if (data?.content === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          // @ts-ignore
          this.resultsLength = data.totalElements;
          // @ts-ignore
          return data.content;
        }),
      )
      .subscribe(data => (this.listGastosRecorrentes = data));
  }

  ngAfterViewInit(): void {
    this.refreshGastosRecorrentesList()
  }

  editarGasto(gastoRecorrente: GastoCartao): void {
    this.despesaRecorrenteService.editingGasto.emit(gastoRecorrente);
  }

  onFilterChange(): void {
    this.paginator.pageIndex = 0; // Reset para primeira página
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
    if (confirm(`Deseja realmente excluir o gasto "${gastoRecorrente.descricao}"?`)) {
      this.despesaRecorrenteService.excluirCompra(gastoRecorrente.id).subscribe({
        next: () => {
          this.snackBar.open('Gasto excluído com sucesso!', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          this.refreshGastosRecorrentesList();
        },
        error: (error: any) => {
          this.snackBar.open('Erro ao excluir gasto', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        }
      });
    }
  }
}
