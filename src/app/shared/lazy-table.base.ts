import { TableLazyLoadEvent } from 'primeng/table';

export abstract class LazyTableBase {
  protected isLoadingResults = true;
  protected resultsLength = 0;
  protected pageSize = 10;
  protected pageIndex = 0;
  protected sortField = 'id';
  protected sortOrder: 'asc' | 'desc' = 'desc';

  protected onLazyLoad(event: TableLazyLoadEvent): void {
    const rows = event.rows ?? this.pageSize;
    this.pageSize = rows;
    this.pageIndex = Math.floor((event.first ?? 0) / rows);
    this.sortField = this.resolveSortField(event.sortField);
    this.sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';
    this.carregarDados();
  }

  protected resolveSortField(sortField: string | string[] | null | undefined): string {
    if (Array.isArray(sortField)) {
      return sortField[0] ?? this.sortField;
    }
    return sortField || this.sortField;
  }

  protected abstract carregarDados(): void;
}
