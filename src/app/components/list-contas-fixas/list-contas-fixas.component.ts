import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {Financa} from "../../models/financa.model";
import {FinancaService} from "../../services/financa.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {catchError, map, merge, of as observableOf, startWith, switchMap} from "rxjs";

@Component({
  selector: 'app-list-contas-fixas',
  templateUrl: './list-contas-fixas.component.html',
  styleUrls: ['./list-contas-fixas.component.css']
})
export class ListContasFixasComponent implements AfterViewInit {
  displayedColumnsContasFixas: string[] = ['nome', 'categoria', 'conta', 'vencimento', 'valor', 'pago'];
  contasFixas: Financa[] = [];


  resultsLength = 0;
  isLoadingResults = true;

  // @ts-expect-error
  @ViewChild(MatPaginator) paginator: MatPaginator
  // @ts-expect-error
  @ViewChild(MatSort) sort: MatSort;

  constructor(private financaService: FinancaService) {
    this.financaService.savedFinanca.subscribe(
      {
        next: () => {
          this.refreshContasFixasList()
        }
      }
    )
  }

  ngAfterViewInit(): void {
    this.refreshContasFixasList()
  }


  private refreshContasFixasList() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          const sort = `${this.sort.active},${this.sort.direction}`
          return this.financaService.listarFinancas(
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
      .subscribe(data => (this.contasFixas = data));
  }
}
