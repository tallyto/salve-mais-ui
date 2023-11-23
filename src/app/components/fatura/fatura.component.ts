import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {Fatura} from "../../models/fatura.model";
import {FaturaService} from "../../services/fatura.service";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-fatura',
  templateUrl: './fatura.component.html',
  styleUrls: ['./fatura.component.css'],
   animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class FaturaComponent implements OnInit {
  private horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  private verticalPosition: MatSnackBarVerticalPosition = 'top';

  public faturaForm: FormGroup;
  public displayedColumnsFatura: string[] = ['dataVencimento', 'dataPagamento', 'valorTotal', 'pago', 'cartaoCredito'];
  public faturas: Fatura[] = [];
  public expandedElement: Fatura | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private faturaService: FaturaService,
    private snackBar: MatSnackBar,
  ) {
    this.faturaForm = this.formBuilder.group({
      id: [null],
    })
  }

  ngOnInit() {
    this.listarFaturas()
  }


  public listarFaturas(): void {
    this.faturaService.listarFaturas().subscribe(
      faturas => this.faturas = faturas
    );
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Ok', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

}
