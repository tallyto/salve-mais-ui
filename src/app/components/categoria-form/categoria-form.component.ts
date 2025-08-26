import {Component, OnInit} from '@angular/core';
import {CategoriaService} from "../../services/categoria.service";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {Categoria} from "../../models/categoria.model";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-categoria-form',
    templateUrl: './categoria-form.component.html',
    styleUrls: ['./categoria-form.component.css'],
    standalone: false
})
export class CategoriaFormComponent implements OnInit {
  public categoriaForm: FormGroup;
  public displayedColumnsCategoria: string[] = ['nome', 'acoes'];
  public categorias: Categoria[] = [];
  public editingCategoria: Categoria | null = null;
  private horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  private verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private formBuilder: FormBuilder,
    private categoriaService: CategoriaService,
    private snackBar: MatSnackBar,
  ) {
    this.categoriaForm = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
    })
  }

  ngOnInit() {
    this.listarCategorias()
  }

  salvarCategoria() {
    if (this.categoriaForm.invalid) {
      return;
    }

    const categoria = this.categoriaForm.value;
    const isEditing = !!categoria.id;

    this.categoriaService.salvarCategoria(categoria).subscribe({
      next: value => {
        const message = isEditing ? 'Categoria atualizada com sucesso!' : 'Categoria salva com sucesso!';
        this.openSnackBar(message);
        this.limparFormulario();
        this.listarCategorias();
      },
      error: (errorMessage: string) => {
        this.openSnackBar(errorMessage);
      }
    });
  }

  public listarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe(
      categorias => this.categorias = categorias
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
      nome: categoria.nome
    });
  }

  cancelarEdicao(): void {
    this.limparFormulario();
  }

  limparFormulario(): void {
    this.categoriaForm.reset({
      id: null,
      nome: ''
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


