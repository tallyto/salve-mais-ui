import { ChangeDetectorRef, Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CategoriaService } from '@services/categoria.service';
import { Categoria, TipoCategoria, TipoOption } from '@models/categoria.model';
import { CategoriaTypeChipComponent } from '../categoria-type-chip/categoria-type-chip.component';
import { SALVE_COMMON, SALVE_FORMS, SALVE_DATA, SALVE_OVERLAY } from '@shared/primeng-shared';

@Component({
  selector: 'app-list-categorias',
  templateUrl: './list-categorias.component.html',
  standalone: true,
  imports: [
    FormsModule,
    CategoriaTypeChipComponent,
    ...SALVE_COMMON,
    ...SALVE_FORMS,
    ...SALVE_DATA,
    ...SALVE_OVERLAY
  ]
})
export class ListCategoriasComponent implements OnChanges {
  @Input() categorias: Categoria[] = [];
  @Output() categoriaEdit = new EventEmitter<Categoria>();
  @Output() categoriaDeleted = new EventEmitter<number>();
  @Output() categoriaUpdated = new EventEmitter<Categoria>();

  public editingCategoria: Categoria | null = null;
  public originalCategoria: Categoria | null = null;
  public tipoOptions: TipoOption[] = [
    { label: 'Necessidade (50%)', value: TipoCategoria.NECESSIDADE },
    { label: 'Desejo (30%)', value: TipoCategoria.DESEJO },
    { label: 'Economia (20%)', value: TipoCategoria.ECONOMIA }
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