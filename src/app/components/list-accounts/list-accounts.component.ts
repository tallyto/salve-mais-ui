import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {Provento} from "../../models/provento.model";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {catchError, map, merge, of as observableOf, startWith, switchMap} from "rxjs";
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-list-accounts',
  templateUrl: './list-accounts.component.html',
  styleUrls: ['./list-accounts.component.css']
})
export class ListAccountsComponent implements AfterViewInit {
  resultsLength = 0;
  isLoadingResults = true;

  displayedColumnsProventos: string[] = ['saldo', 'titular'];

  accounts: Provento[] = [];

  constructor(
    private accountService: AccountService,
  ) {

  }

  // @ts-expect-error
  @ViewChild(MatPaginator) paginator: MatPaginator
  // @ts-expect-error
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit(): void {
    this.refreshProventosList()
  }

  refreshProventosList() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          const sort = `${this.sort.active},${this.sort.direction}`
          return this.accountService.listarAccounts(
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
      .subscribe(data => (this.accounts = data));
  }

}
