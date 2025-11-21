import { ChangeDetectorRef, Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria, TipoCategoria } from '../../../models/categoria.model';

@Component({
  selector: 'app-categoria-list',
  templateUrl: './categoria-list.component.html',
  styleUrls: ['./categoria-list.component.css'],
  standalone: false
})
export class CategoriaListComponent implements OnChanges {
  @Input() categorias: Categoria[] = [];
  @Output() categoriaEdit = new EventEmitter<Categoria>();
  @Output() categoriaDeleted = new EventEmitter<number>();
  @Output() categoriaUpdated = new EventEmitter<Categoria>();

  public displayedColumns: string[] = ['nome', 'tipo', 'acoes'];
  public dataSource = new MatTableDataSource<Categoria>([]);
  public editingCategoria: Categoria | null = null;
  public originalCategoria: Categoria | null = null;
  private horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  private verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private categoriaService: CategoriaService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categorias'] && changes['categorias'].currentValue) {
      this.dataSource.data = [...this.categorias];
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
          this.openSnackBar('Categoria excluída com sucesso!');
          this.categoriaDeleted.emit(categoria.id);
        },
        error: (errorMessage: string) => {
          this.openSnackBar(errorMessage);
        }
      });
    }
  }

  salvarEdicao(): void {
    if (!this.editingCategoria || !this.editingCategoria.nome.trim()) {
      this.openSnackBar('Nome da categoria é obrigatório!');
      return;
    }

    this.categoriaService.salvarCategoria(this.editingCategoria).subscribe({
      next: (categoriaAtualizada) => {
        // Atualiza a entrada local na lista e no dataSource
        const index = this.categorias.findIndex(c => c.id === categoriaAtualizada.id);
        if (index !== -1) {
          this.categorias[index] = { ...categoriaAtualizada };
          this.dataSource.data = [...this.categorias];
        }
        
        this.openSnackBar('Categoria atualizada com sucesso!');
        this.categoriaUpdated.emit(categoriaAtualizada);
        this.cancelarEdicao();
      },
      error: (errorMessage: string) => {
        this.openSnackBar(errorMessage);
      }
    });
  }

  cancelarEdicao(): void {
    this.editingCategoria = null;
    this.originalCategoria = null;
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 3000
    });
  }
}