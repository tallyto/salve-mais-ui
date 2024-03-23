import {Component, OnInit} from '@angular/core';
import {FinancaService} from "../../services/financa.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Categoria} from "../../models/categoria.model";
import {CategoriaService} from "../../services/categoria.service";
import {Account} from "../../models/account.model";
import {AccountService} from "../../services/account.service";

@Component({
  selector: 'app-despesas-fixas',
  templateUrl: './despesas-fixas.component.html',
  styleUrls: ['./despesas-fixas.component.css']
})
export class DespesasFixasComponent implements OnInit {
  despesaFixaForm: FormGroup;
  public categorias: Categoria[] = [];
  public accounts: Account[] = []
  constructor(
    private financaService: FinancaService,
    private formBuilder: FormBuilder,
    private categoriaService: CategoriaService,
    private accountService: AccountService,
  ) {
    this.despesaFixaForm = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      categoriaId: ['', Validators.required],
      contaId: ['', Validators.required],
      vencimento: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(0)]],
      pago: [false, Validators.required]
    })
  }


  ngOnInit(): void {
    this.carregarCategorias()
    this.accountService.listarAccounts(0,50, '').subscribe({
      next: accountPage => {
        this.accounts = accountPage.content
      }
    })
  }

  carregarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe(
      categorias => this.categorias = categorias
    );
  }

  salvarDespesaFixa() {
    this.financaService.salvarFinanca(this.despesaFixaForm.value).subscribe({
      next: () => {
        this.despesaFixaForm.reset()
        this.financaService.savedFinanca.emit()
      }
    })
  }
}
