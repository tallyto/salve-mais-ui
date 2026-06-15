import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Provento} from "@models/provento.model";
import {ProventoService} from "@services/provento.service";
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { catchError, map, of as observableOf } from "rxjs";
import { LazyTableBase } from '@shared/lazy-table.base';
import { SALVE_COMMON, SALVE_DATA, SALVE_OVERLAY } from '@shared/primeng-shared';
import { StatCardComponent, ActionButtonsComponent } from '@components/shared';

@Component({
    selector: 'app-list-proventos',
    templateUrl: './list-proventos.component.html',
    standalone: true,
    imports: [CommonModule, ...SALVE_COMMON, ...SALVE_DATA, ...SALVE_OVERLAY, StatCardComponent, ActionButtonsComponent]
})
export class ListProventosComponent extends LazyTableBase implements OnInit {
  override sortField = 'data';

  displayedColumnsProventos: string[] = ['descricao', 'conta', 'data', 'valor', 'acoes'];

  proventos: Provento[] = [];
  selectedProvento: Provento | null = null;

  constructor(
    private proventoService: ProventoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {
    super();
    this.proventoService.proventosChanged$.subscribe(
      {
        next: () => {
          this.carregarDados()
        }
      }
    )
  }

  ngOnInit(): void {
    this.carregarDados()
  }

  protected carregarDados(): void {
    this.refreshProventosList();
  }

  private refreshProventosList() {
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
    this.proventoService.editingProvento$.next(this.selectedProvento);
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
}
