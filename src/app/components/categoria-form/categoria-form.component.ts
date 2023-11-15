import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CategoriaService} from "../../services/categoria.service";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";

@Component({
  selector: 'app-categoria-form',
  templateUrl: './categoria-form.component.html',
  styleUrls: ['./categoria-form.component.css']
})
export class CategoriaFormComponent {
  public categoriaForm: FormGroup;
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

  salvarCategoria() {
    this.categoriaService.salvarCategoria(this.categoriaForm.value).subscribe({
      next: value => {
        this.openSnackBar('Categoria salva com sucesso!');
        this.categoriaForm.reset();
      },
      error: error => {
        console.log(error);
      }
    })
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Ok', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

}
