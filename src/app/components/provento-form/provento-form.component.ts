import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {ProventoService} from "../../services/provento.service";
import {Provento} from "../../models/provento.model";

@Component({
  selector: 'app-provento-form',
  templateUrl: './provento-form.component.html',
  styleUrls: ['./provento-form.component.css']
})
export class ProventoFormComponent implements OnInit {

  public proventoForm: FormGroup;
  public displayedColumnsProventos: string[] = ['nome', 'data', 'valor'];
  public proventos: Provento[] = [];
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

  ngOnInit(): void {
    this.carregarProventos()
  }


  salvarProvento() {
    this.proventoService.criarProvento(this.proventoForm.value).subscribe({
      next: value => {
        this.openSnackBar('Provento salvo com sucesso!');
        this.proventoForm.reset();
        this.carregarProventos();
      },
      error: error => {
        console.log(error);
      }
    })
  }

  carregarProventos(): void {
    this.proventoService.listarProventos().subscribe(
      proventos => this.proventos = proventos
    );
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Ok', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }


}
