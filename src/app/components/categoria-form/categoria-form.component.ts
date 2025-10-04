import { Component, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CategoriaService } from "../../services/categoria.service";
import { Categoria, TipoCategoria } from "../../models/categoria.model";

@Component({
  selector: 'app-categoria-form',
  templateUrl: './categoria-form.component.html',
  styleUrls: ['./categoria-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule
  ]
})
export class CategoriaFormComponent implements OnInit {
  public categoriaForm: FormGroup;
  public displayedColumnsCategoria: string[] = ['nome', 'tipo', 'acoes'];
  public categorias: Categoria[] = [];
  public editingCategoria: Categoria | null = null;
  public isDialogMode: boolean = false;
  private horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  private verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private formBuilder: FormBuilder,
    private categoriaService: CategoriaService,
    private snackBar: MatSnackBar,
    @Optional() public dialogRef: MatDialogRef<CategoriaFormComponent>
  ) {
    this.isDialogMode = !!dialogRef;
    this.categoriaForm = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      tipo: [TipoCategoria.NECESSIDADE, Validators.required]
    })
  }

  ngOnInit() {
    this.listarCategorias()
  }

  /**
   * Retorna a classe CSS para o tipo de categoria
   */
  getTipoClass(tipo: TipoCategoria): string {
    switch(tipo) {
      case TipoCategoria.NECESSIDADE:
        return 'tipo-necessidade';
      case TipoCategoria.DESEJO:
        return 'tipo-desejo';
      case TipoCategoria.ECONOMIA:
        return 'tipo-economia';
      default:
        return '';
    }
  }

  /**
   * Retorna o label para o tipo de categoria
   */
  getTipoLabel(tipo: TipoCategoria): string {
    switch(tipo) {
      case TipoCategoria.NECESSIDADE:
        return 'Necessidade (50%)';
      case TipoCategoria.DESEJO:
        return 'Desejo (30%)';
      case TipoCategoria.ECONOMIA:
        return 'Economia (20%)';
      default:
        return tipo;
    }
  }

  salvarCategoria() {
    if (this.categoriaForm.invalid) {
      return;
    }

    const categoria = this.categoriaForm.value;
    const isEditing = !!categoria.id;

    this.categoriaService.salvarCategoria(categoria).subscribe({
      next: (value: Categoria) => {
        const message = isEditing ? 'Categoria atualizada com sucesso!' : 'Categoria salva com sucesso!';
        this.openSnackBar(message);
        this.limparFormulario();

        // Se estiver em modo dialog, fecha o dialog retornando a categoria criada
        if (this.isDialogMode && this.dialogRef) {
          this.dialogRef.close(value);
        } else {
          this.listarCategorias();
        }
      },
      error: (errorMessage: string) => {
        this.openSnackBar(errorMessage);
      }
    });
  }

  fecharDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  public listarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe(
      (categorias: Categoria[]) => this.categorias = categorias
    );
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 3000
    });
  }

  editarCategoria(categoria: Categoria): void {
    this.editingCategoria = categoria;
    this.categoriaForm.patchValue({
      id: categoria.id,
      nome: categoria.nome,
      tipo: categoria.tipo || TipoCategoria.NECESSIDADE
    });
  }

  cancelarEdicao(): void {
    this.limparFormulario();
  }

  limparFormulario(): void {
    this.categoriaForm.reset({
      id: null,
      nome: '',
      tipo: TipoCategoria.NECESSIDADE
    });
    this.editingCategoria = null;
  }

  excluirCategoria(categoria: Categoria): void {
    if (confirm(`Tem certeza que deseja excluir a categoria "${categoria.nome}"?`)) {
      this.categoriaService.excluirCategoria(categoria.id).subscribe({
        next: () => {
          this.openSnackBar('Categoria excluída com sucesso!');
          this.listarCategorias();
        },
        error: (errorMessage: string) => {
          this.openSnackBar(errorMessage);
        }
      });
    }
  }
}
