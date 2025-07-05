import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {catchError, map, merge, of as observableOf, startWith, switchMap} from "rxjs";
import {GastoCartao} from "../../models/gasto-cartao.model";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {GastoCartaoService} from "../../services/gasto-cartao.service";
import {MatSnackBar} from "@angular/material/snack-bar";

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

  constructor(
    private despesaRecorrenteService: GastoCartaoService,
    private snackBar: MatSnackBar
  ) {
    this.despesaRecorrenteService.gastaoCartaoSaved.subscribe({
      next: () => {
        this.refreshGastosRecorrentesList()
      }
    })
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
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;

          // @ts-expect-error
          if (data.content === null) {
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
          console.error('Erro ao excluir gasto:', error);
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
