import { ChangeDetectorRef, Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CategoriaService } from '@services/categoria.service';
import { Categoria, TipoCategoria, TipoOption } from '@models/categoria.model';

@Component({
  selector: 'app-categoria-list',
  templateUrl: './categoria-list.component.html',
  standalone: false
})
export class CategoriaListComponent implements OnChanges {
  @Input() categorias: Categoria[] = [];
  @Output() categoriaEdit = new EventEmitter<Categoria>();
  @Output() categoriaDeleted = new EventEmitter<number>();
  @Output() categoriaUpdated = new EventEmitter<Categoria>();

  public editingCategoria: Categoria | null = null;
  public originalCategoria: Categoria | null = null;
  public tipoOptions: TipoOption[] = [
    { label: 'Necessidade (50%)', value: 'NECESSIDADE' },
    { label: 'Desejo (30%)', value: 'DESEJO' },
    { label: 'Economia (20%)', value: 'ECONOMIA' }
  ];

  constructor(
    private categoriaService: CategoriaService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Trigger change detection on input change
    if (changes['categorias'] && changes['categorias'].currentValue) {
      this.cdr.markForCheck();
    }
  }

  editarCategoria(categoria: Categoria): void {
    this.originalCategoria = { ...categoria };
    this.editingCategoria = { ...categoria };
  }

  excluirCategoria(categoria: Categoria): void {
    if (confirm(`Tem certeza que deseja excluir a categoria "${categoria.nome}"?`)) {
      this.categoriaService.excluirCategoria(categoria.id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Categoria excluída com sucesso!' });
          this.categoriaDeleted.emit(categoria.id);
        },
        error: (errorMessage: string) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: errorMessage });
        }
      });
    }
  }

  salvarEdicao(): void {
    if (!this.editingCategoria || !this.editingCategoria.nome.trim()) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Nome da categoria é obrigatório!' });
      return;
    }

    this.categoriaService.salvarCategoria(this.editingCategoria).subscribe({
      next: (categoriaAtualizada) => {
        // Atualiza a entrada local na lista
        const index = this.categorias.findIndex(c => c.id === categoriaAtualizada.id);
        if (index !== -1) {
          this.categorias[index] = { ...categoriaAtualizada };
        }

        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Categoria atualizada com sucesso!' });
        this.categoriaUpdated.emit(categoriaAtualizada);
        this.cancelarEdicao();
      },
      error: (errorMessage: string) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: errorMessage });
      }
    });
  }

  cancelarEdicao(): void {
    this.editingCategoria = null;
    this.originalCategoria = null;
  }
}