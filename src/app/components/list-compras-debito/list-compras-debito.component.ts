import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CompraDebito } from "../../models/compra-debito.model";
import { CompraDebitoService } from "../../services/compra-debito.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { catchError, map, merge, of as observableOf, startWith, switchMap } from "rxjs";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

interface MonthOption {
  value: number;
  label: string;
}

@Component({
    selector: 'app-list-compras-debito',
    templateUrl: './list-compras-debito.component.html',
    styleUrls: ['./list-compras-debito.component.css'],
    standalone: false
})
export class ListComprasDebitoComponent implements AfterViewInit {
  displayedColumns: string[] = ['nome', 'categoria', 'dataCompra', 'valor', 'observacoes', 'acoes'];
  comprasDebito: CompraDebito[] = [];

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

  constructor(
    private compraDebitoService: CompraDebitoService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    // Inicializar filtros com mês e ano atuais
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();

    // Gerar lista de anos (últimos 3 anos até próximos 2 anos)
    this.generateYears();
  }

  ngAfterViewInit(): void {
    this.refreshList();
  }

  refreshList(): void {
    this.sort?.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort?.sortChange, this.paginator?.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.compraDebitoService.listarCompras(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.selectedMonth,
            this.selectedYear
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          this.isLoadingResults = false;

          if (data === null) {
            return [];
          }

          this.resultsLength = data.totalElements;
          return data.content;
        })
      )
      .subscribe(data => {
        this.comprasDebito = data;
      });
  }

  generateYears(): void {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 3; year <= currentYear + 2; year++) {
      this.years.push(year);
    }
  }

  onFilterChange(): void {
    this.paginator.pageIndex = 0;
    this.refreshList();
  }

  novaCompra(): void {
    this.router.navigate(['/compras-debito/nova']);
  }

  editarCompra(compra: CompraDebito): void {
    this.router.navigate(['/compras-debito/editar', compra.id]);
  }

  excluirCompra(compra: CompraDebito): void {
    if (confirm(`Deseja realmente excluir a compra "${compra.nome}"?\n\nAtenção: Esta ação não revertirá o débito realizado na conta.`)) {
      this.compraDebitoService.excluirCompraDebito(compra.id).subscribe({
        next: () => {
          this.snackBar.open('Compra excluída com sucesso!', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          this.refreshList();
        },
        error: (error) => {
          this.snackBar.open('Erro ao excluir compra', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        }
      });
    }
  }

  calcularTotal(): number {
    return this.comprasDebito.reduce((total, compra) => total + compra.valor, 0);
  }

  previousMonth(): void {
    if (this.selectedMonth > 1) {
      this.selectedMonth--;
    } else {
      this.selectedMonth = 12;
      this.selectedYear--;
    }
    this.onFilterChange();
  }

  nextMonth(): void {
    if (this.selectedMonth < 12) {
      this.selectedMonth++;
    } else {
      this.selectedMonth = 1;
      this.selectedYear++;
    }
    this.onFilterChange();
  }

  exportarParaExcel(): void {
    // Implementação futura
    this.snackBar.open('Funcionalidade em desenvolvimento', 'Fechar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
