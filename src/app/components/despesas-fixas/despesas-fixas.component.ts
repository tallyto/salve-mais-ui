import {Component, OnInit} from '@angular/core';
import {Financa} from "../../models/financa.model";
import {FinancaService} from "../../services/financa.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Categoria} from "../../models/categoria.model";
import {CategoriaService} from "../../services/categoria.service";

@Component({
  selector: 'app-despesas-fixas',
  templateUrl: './despesas-fixas.component.html',
  styleUrls: ['./despesas-fixas.component.css']
})
export class DespesasFixasComponent implements OnInit {
  displayedColumnsContasFixas: string[] = ['nome', 'categoria', 'vencimento', 'valor', 'pago'];
  contasFixas: Financa[] = [];
  despesaFixaForm: FormGroup;
  public categorias: Categoria[] = [];

  constructor(
    private financaService: FinancaService,
    private formBuilder: FormBuilder,
    private categoriaService: CategoriaService
  ) {
    this.despesaFixaForm = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      categoriaId: ['', Validators.required],
      vencimento: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(0)]],
      pago: [false, Validators.required]
    })
  }


  ngOnInit(): void {
    this.carregarContasFixas()
    this.carregarCategorias()
  }

  carregarContasFixas(): void {
    this.financaService.listarFinancas().subscribe(
      contasFixas => this.contasFixas = contasFixas
    );
  }

  carregarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe(
      categorias => this.categorias = categorias
    );
  }

  salvarDespesaFixa() {
    this.financaService.salvarFinanca(this.despesaFixaForm.value).subscribe({
      next: value => {
        this.despesaFixaForm.reset()
        this.carregarContasFixas()
      }
    })
  }
}
