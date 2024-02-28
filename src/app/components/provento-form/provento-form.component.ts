import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {ProventoService} from "../../services/provento.service";

@Component({
  selector: 'app-provento-form',
  templateUrl: './provento-form.component.html',
  styleUrls: ['./provento-form.component.css']
})
export class ProventoFormComponent {

  public proventoForm: FormGroup;
  private horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  private verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private formBuilder: FormBuilder,
    private proventoService: ProventoService,
    private snackBar: MatSnackBar,
  ) {
    this.proventoForm = this.formBuilder.group({
      id: [null],
      descricao: ['', Validators.required],
      valor: ['', [Validators.min(0), Validators.required]],
      data: ['', Validators.required],
    })
  }


  salvarProvento() {
    this.proventoService.criarProvento(this.proventoForm.value).subscribe({
      next: () => {
        this.openSnackBar('Provento salvo com sucesso!');
        this.proventoForm.reset();
        this.proventoService.proventoSaved.emit()
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
