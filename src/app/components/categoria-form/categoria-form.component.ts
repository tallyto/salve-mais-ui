import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CategoriaService} from "../../services/categoria.service";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {Categoria} from "../../models/categoria.model";

@Component({
  selector: 'app-categoria-form',
  templateUrl: './categoria-form.component.html',
  styleUrls: ['./categoria-form.component.css']
})
export class CategoriaFormComponent implements OnInit {
  public categoriaForm: FormGroup;
  public displayedColumnsCategoria: string[] = ['nome'];
  public categorias: Categoria[] = [];
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
    this.categoriaService.salvarCategoria(this.categoriaForm.value).subscribe({
      next: value => {
        this.openSnackBar('Categoria salva com sucesso!');
        this.categoriaForm.reset();
        this.listarCategorias();
      },
      error: error => {
        console.log(error);
      }
    })
  }

  public listarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe(
      categorias => this.categorias = categorias
    );
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Ok', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

}


