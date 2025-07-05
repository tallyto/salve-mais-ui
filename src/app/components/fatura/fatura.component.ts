import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {Fatura} from "../../models/fatura.model";
import {FaturaService} from "../../services/fatura.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Cartao} from "../../models/cartao.model";
import {CartaoService} from "../../services/cartao.service";
import {MatDialog} from "@angular/material/dialog";

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
  public displayedColumnsFatura: string[] = ['dataVencimento', 'dataPagamento', 'valorTotal', 'pago', 'cartaoCredito', 'acoes'];
  public faturas: Fatura[] = [];
  public expandedElement: Fatura | undefined;
  public cartoes: Cartao[] = [];
  public isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private faturaService: FaturaService,
    private snackBar: MatSnackBar,
    private cartaoService: CartaoService,
    private dialog: MatDialog
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
    this.isLoading = true;
    this.faturaService.listarFaturas().subscribe(
      faturas => {
        this.faturas = faturas;
        this.isLoading = false;
      },
      error => {
        this.openSnackBar('Erro ao carregar faturas');
        this.isLoading = false;
      }
    );
  }

  public loadCards(): void {
    this.cartaoService.listarCartoes().subscribe(
      value => this.cartoes = value,
      error => this.openSnackBar('Erro ao carregar cartões')
    )
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Ok', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 3000
    });
  }

  handlerFatura() {
    if (this.cardForm.invalid) {
      this.openSnackBar('Selecione um cartão');
      return;
    }

    this.isLoading = true;
    this.faturaService.criarFatura(this.cardForm.get('cardId')?.value).subscribe(
      _ => {
        this.listarFaturas();
        this.openSnackBar('Fatura gerada com sucesso');
        this.isLoading = false;
        this.cardForm.reset();
      },
      error => {
        this.openSnackBar('Erro ao gerar fatura');
        this.isLoading = false;
      }
    )
  }

  pagarFatura(fatura: Fatura, event: Event) {
    event.stopPropagation();

    if (confirm(`Confirmar pagamento da fatura de ${fatura.cartaoCredito?.nome} no valor de ${fatura.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}?`)) {
      this.isLoading = true;

      this.faturaService.pagarFatura(fatura.id).subscribe(
        _ => {
          this.listarFaturas();
          this.openSnackBar('Fatura paga com sucesso');
          this.isLoading = false;
        },
        error => {
          this.openSnackBar('Erro ao pagar fatura');
          this.isLoading = false;
        }
      );
    }
  }
}
