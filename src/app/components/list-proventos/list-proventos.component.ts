import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {Provento} from "../../models/provento.model";
import {ProventoService} from "../../services/provento.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {catchError, map, merge, of as observableOf, startWith, switchMap} from "rxjs";

@Component({
  selector: 'app-list-proventos',
  templateUrl: './list-proventos.component.html',
  styleUrls: ['./list-proventos.component.css']
})
export class ListProventosComponent implements AfterViewInit {
  resultsLength = 0;
  isLoadingResults = true;

  displayedColumnsProventos: string[] = ['descricao', 'conta', 'data', 'valor', 'acoes'];

  proventos: Provento[] = [];
  selectedProvento: Provento | null = null;

  constructor(
    private proventoService: ProventoService,
  ) {
    this.proventoService.proventoSaved.subscribe(
      {
        next: () => {
          this.refreshProventosList()
        }
      }
    )
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
          return this.proventoService.listarProventos(
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
      .subscribe(data => (this.proventos = data));
  }

  onEditProvento(provento: Provento) {
    this.selectedProvento = { ...provento };
    this.proventoService.editingProvento.emit(this.selectedProvento);
  }

  excluirProvento(provento: Provento) {
    if (confirm(`Tem certeza que deseja excluir o provento "${provento.descricao}"?`)) {
      if (provento.id) {
        this.proventoService.excluirProvento(provento.id).subscribe({
          next: () => {
            alert('Provento excluído com sucesso!');
            this.refreshProventosList();
          },
          error: (err: any) => {
            console.error('Erro ao excluir provento:', err);
            alert('Erro ao excluir provento: ' + (err.error?.message || 'Erro desconhecido'));
          }
        });
      } else {
        alert('Não é possível excluir um provento sem ID');
      }
    }
  }
}
