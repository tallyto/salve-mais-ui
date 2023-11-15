import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CartaoService} from "../../services/cartao.service";

@Component({
  selector: 'app-cartao-form',
  templateUrl: './cartao-form.component.html',
  styleUrls: ['./cartao-form.component.css']
})
export class CartaoFormComponent {

  public cartaoForm: FormGroup;


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

  salvarCartao() {
    this.cartoService.salvarCartao(this.cartaoForm.value).subscribe({
      next: value => {
        console.log(value);
        this.cartaoForm.reset();
      },
      error: error => {
        console.log(error);
      }
    })
  }


}
