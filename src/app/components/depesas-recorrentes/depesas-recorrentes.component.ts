import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Categoria} from "../../models/categoria.model";
import {CategoriaService} from "../../services/categoria.service";
import {GastoCartaoService} from "../../services/gasto-cartao.service";
import {CartaoService} from "../../services/cartao.service";
import {Cartao} from "../../models/cartao.model";

@Component({
  selector: 'app-depesas-recorrentes',
  templateUrl: './depesas-recorrentes.component.html',
  styleUrls: ['./depesas-recorrentes.component.css']
})
export class DepesasRecorrentesComponent implements OnInit {
  gastosRecorrentes: FormGroup;
  public categorias: Categoria[] = [];
  public cartoes: Cartao[] = [];

  constructor(
    private despesaRecorrenteService: GastoCartaoService,
    private formBuilder: FormBuilder,
    private categoriaService: CategoriaService,
    private cartaoService: CartaoService
  ) {
    this.gastosRecorrentes = this.formBuilder.group({
      id: [null],
      descricao: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(0)]],
      data: ['', Validators.required],
      categoriaId: ['', Validators.required],
      cartaoId: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.carregarCategorias()
    this.carregarCartoes()
  }

  carregarCartoes(): void {
    this.cartaoService.listarCartoes().subscribe(
      cartoes => this.cartoes = cartoes
    )
  }


  carregarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe(
      categorias => this.categorias = categorias
    );
  }

  salvarGastoRecorrente() {
    this.despesaRecorrenteService.salvarCompra(this.gastosRecorrentes.value).subscribe({
      next: () => {
        this.gastosRecorrentes.reset()
        this.despesaRecorrenteService.gastaoCartaoSaved.emit()
      }
    })
  }
}
