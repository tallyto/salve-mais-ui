import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {catchError, map, merge, of as observableOf, startWith, switchMap} from "rxjs";
import {GastoCartao} from "../../models/gasto-cartao.model";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {GastoCartaoService} from "../../services/gasto-cartao.service";

@Component({
  standalone: false,
  selector: 'app-list-despesas-recorrentes',
  templateUrl: './list-despesas-recorrentes.component.html',
  styleUrls: ['./list-despesas-recorrentes.component.css']
})
export class ListDespesasRecorrentesComponent implements AfterViewInit {

  displayedColumnsGastoRecorrente: string[] = ['descricao', 'categoria', 'cartaoCredito', 'data', 'valor'];
  listGastosRecorrentes: GastoCartao[] = [];
  resultsLength = 0;
  isLoadingResults = true;

  constructor(private despesaRecorrenteService: GastoCartaoService) {
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

}
