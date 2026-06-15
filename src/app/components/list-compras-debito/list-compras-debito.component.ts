import { Component, OnInit } from '@angular/core';
import { CompraDebito } from "../../models/compra-debito.model";
import { CompraDebitoService } from "../../services/compra-debito.service";
import { catchError, map, of as observableOf } from "rxjs";
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { MONTHS, generateYears } from '../../shared/utils';

@Component({
    selector: 'app-list-compras-debito',
    templateUrl: './list-compras-debito.component.html',
    standalone: false
})
export class ListComprasDebitoComponent implements OnInit {
  displayedColumns: string[] = ['nome', 'categoria', 'dataCompra', 'valor', 'observacoes', 'acoes'];
  comprasDebito: CompraDebito[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  pageSize = 10;
  pageIndex = 0;

  // Filtros de mês e ano
  selectedMonth: number;
  selectedYear: number;
  months = MONTHS;
  years: number[] = [];

  constructor(
    private compraDebitoService: CompraDebitoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    // Inicializar filtros com mês e ano atuais
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();

    // Gerar lista de anos (últimos 3 anos até próximos 2 anos)
    this.generateYears();
  }

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList(): void {
    this.isLoadingResults = true;

    this.compraDebitoService.listarCompras(
      this.pageIndex,
      this.pageSize,
      this.selectedMonth,
      this.selectedYear
    ).pipe(
      catchError(() => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar compras em débito.' });
        return observableOf(null);
      }),
      map(data => {
        this.isLoadingResults = false;

        if (data === null) {
          this.resultsLength = 0;
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
    this.years = generateYears();
  }

  onFilterChange(): void {
    this.pageIndex = 0;
    this.refreshList();
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
    this.refreshList();
  }

  novaCompra(): void {
    this.router.navigate(['/compras-debito/nova']);
  }

  editarCompra(compra: CompraDebito): void {
    this.router.navigate(['/compras-debito/editar', compra.id]);
  }

  excluirCompra(compra: CompraDebito): void {
    this.confirmationService.confirm({
      message: `Deseja realmente excluir a compra "${compra.nome}"? Esta ação não reverterá o débito realizado na conta.`,
      header: 'Excluir compra',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.compraDebitoService.excluirCompraDebito(compra.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Compra excluída com sucesso.' });
            this.refreshList();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir compra.' });
          }
        });
      }
    });
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
    this.messageService.add({ severity: 'info', summary: 'Em desenvolvimento', detail: 'Funcionalidade em desenvolvimento.' });
  }
}
