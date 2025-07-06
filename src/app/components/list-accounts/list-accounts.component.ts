import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {catchError, map, merge, of as observableOf, startWith, switchMap} from "rxjs";
import { AccountService } from 'src/app/services/account.service';
import {Account} from "../../models/account.model";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list-accounts',
  templateUrl: './list-accounts.component.html',
  styleUrls: ['./list-accounts.component.css']
})
export class ListAccountsComponent implements AfterViewInit {
  resultsLength = 0;
  isLoadingResults = true;

  displayedColumnsProventos: string[] = ['saldo', 'titular', 'acoes'];

  accounts: Account[] = [];
  editingAccount: Account | null = null;
  tempSaldo: number = 0;

  constructor(
    private accountService: AccountService,
    private snackBar: MatSnackBar
  ) {
    this.accountService.savedAccount.subscribe({
      next: () => {
        this.refreshAccountList()
      }
    })
  }

  // @ts-expect-error
  @ViewChild(MatPaginator) paginator: MatPaginator
  // @ts-expect-error
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit(): void {
    this.refreshAccountList()
  }

  startEdit(account: Account) {
    this.editingAccount = account;
    this.tempSaldo = account.saldo;
  }

  cancelEdit() {
    this.editingAccount = null;
    this.tempSaldo = 0;
  }

  saveEdit() {
    if (this.editingAccount) {
      const updatedAccount = { ...this.editingAccount, saldo: this.tempSaldo };
      this.accountService.atualizarAccount(updatedAccount).subscribe({
        next: () => {
          this.snackBar.open('Saldo atualizado com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: 'snackbar-success'
          });
          this.editingAccount = null;
          this.refreshAccountList();
        },
        error: (err: any) => {
          this.snackBar.open('Erro ao atualizar saldo: ' + (err.error?.message || 'Erro desconhecido'), 'Fechar', {
            duration: 3000,
            panelClass: 'snackbar-error'
          });
        }
      });
    }
  }

  isEditing(account: Account): boolean {
    return this.editingAccount?.id === account.id;
  }

  excluirConta(account: Account) {
    if (confirm(`Tem certeza que deseja excluir a conta ${account.titular}?`)) {
      this.accountService.excluirAccount(account.id).subscribe({
        next: () => {
          this.snackBar.open('Conta excluída com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: 'snackbar-success'
          });
          this.refreshAccountList();
        },
        error: (err: any) => {
          this.snackBar.open('Erro ao excluir conta: ' + (err.error?.message || 'Erro desconhecido'), 'Fechar', {
            duration: 3000,
            panelClass: 'snackbar-error'
          });
        }
      });
    }
  }

  refreshAccountList() {
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
