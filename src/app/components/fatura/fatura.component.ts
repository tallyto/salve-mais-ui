import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {Fatura} from "../../models/fatura.model";
import {FaturaService} from "../../services/fatura.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Cartao} from "../../models/cartao.model";
import {CartaoService} from "../../services/cartao.service";

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
  public cardForm: FormGroup;
  public displayedColumnsFatura: string[] = ['dataVencimento', 'dataPagamento', 'valorTotal', 'pago', 'cartaoCredito'];
  public faturas: Fatura[] = [];
  public expandedElement: Fatura | undefined;
  public cartoes: Cartao[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private faturaService: FaturaService,
    private snackBar: MatSnackBar,
    private cartaoService: CartaoService
  ) {
    this.faturaForm = this.formBuilder.group({
      id: [null],
    })
    this.cardForm = this.formBuilder.group({
      cardId: [null]
    })
  }

  ngOnInit() {
    this.listarFaturas()
    this.loadCards()
  }


  public listarFaturas(): void {
    this.faturaService.listarFaturas().subscribe(
      faturas => this.faturas = faturas
    );
  }

  public loadCards(): void {
    this.cartaoService.listarCartoes().subscribe(
      value => this.cartoes = value
    )
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Ok', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  handlerFatura() {
    this.faturaService.criarFatura(this.cardForm.get('cardId')?.value).subscribe(
      _ => {
        this.listarFaturas()
      }
    )
  }
}
