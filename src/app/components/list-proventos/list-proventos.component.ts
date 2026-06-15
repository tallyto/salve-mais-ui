import { Component, OnInit } from '@angular/core';
import {Provento} from "../../models/provento.model";
import {ProventoService} from "../../services/provento.service";
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { catchError, map, of as observableOf } from "rxjs";

@Component({
    selector: 'app-list-proventos',
    templateUrl: './list-proventos.component.html',
    standalone: false
})
export class ListProventosComponent implements OnInit {
  resultsLength = 0;
  isLoadingResults = true;
  pageSize = 10;
  pageIndex = 0;
  sortField = 'data';
  sortOrder = 'desc';

  displayedColumnsProventos: string[] = ['descricao', 'conta', 'data', 'valor', 'acoes'];

  proventos: Provento[] = [];
  selectedProvento: Provento | null = null;

  constructor(
    private proventoService: ProventoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {
    this.proventoService.proventoSaved.subscribe(
      {
        next: () => {
          this.refreshProventosList()
        }
      }
    )
  }

  ngOnInit(): void {
    this.refreshProventosList()
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    const rows = event.rows ?? this.pageSize;
    this.pageSize = rows;
    this.pageIndex = Math.floor((event.first ?? 0) / rows);
    this.sortField = this.resolveSortField(event.sortField);
    this.sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';
    this.refreshProventosList();
  }

  refreshProventosList() {
    this.isLoadingResults = true;
    const sort = `${this.sortField},${this.sortOrder}`;

    this.proventoService.listarProventos(
      this.pageIndex,
      this.pageSize,
      sort,
    ).pipe(
      catchError(() => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar receitas.' });
        return observableOf(null);
      }),
      map(data => {
        this.isLoadingResults = false;

        if (!data) {
          this.resultsLength = 0;
          return [];
        }

        if (Array.isArray(data)) {
          this.resultsLength = data.length;
          return data;
        }

        this.resultsLength = data.totalElements;
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
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o provento "${provento.descricao}"?`,
      header: 'Excluir receita',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
      if (provento.id) {
        this.proventoService.excluirProvento(provento.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Receita excluída com sucesso.' });
            this.refreshProventosList();
          },
          error: (err: any) => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir receita: ' + (err.error?.message || 'Erro desconhecido') });
          }
        });
      } else {
        this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Não é possível excluir uma receita sem ID.' });
      }
      }
    });
  }

  calcularTotal(): number {
    return this.proventos.reduce((sum, provento) => sum + (provento.valor || 0), 0);
  }

  private resolveSortField(sortField: string | string[] | null | undefined): string {
    if (Array.isArray(sortField)) {
      return sortField[0] ?? 'data';
    }

    return sortField || 'data';
  }
}
