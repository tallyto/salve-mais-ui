import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CartaoService} from "../../services/cartao.service";
import {Cartao} from "../../models/cartao.model";

@Component({
  selector: 'app-cartao-form',
  templateUrl: './cartao-form.component.html',
  styleUrls: ['./cartao-form.component.css']
})
export class CartaoFormComponent implements OnInit {

  public cartaoForm: FormGroup;
  public displayedColumnsCartao: string[] = ['nome', 'vencimento'];
  public cartoes: Cartao[] = [];


  constructor(
    private formBuilder: FormBuilder,
    private cartoService: CartaoService
  ) {
    this.cartaoForm = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      vencimento: ['', Validators.required],
    })
  }

  ngOnInit() {
    this.listarCartoes()
  }

  salvarCartao() {
    this.cartoService.salvarCartao(this.cartaoForm.value).subscribe({
      next: value => {
        console.log(value);
        this.cartaoForm.reset();
        this.listarCartoes();
      },
      error: error => {
        console.log(error);
      }
    })
  }

  private listarCartoes(): void {
    this.cartoService.listarCartoes().subscribe(
      cartoes => this.cartoes = cartoes
    );
  }


}
