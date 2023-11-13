import { Component, OnInit } from '@angular/core';
import { FinancaService } from '../../services/financa.service';
import { Financa } from '../../models/financa.model';

@Component({
  selector: 'app-lista-financas',
  templateUrl: './lista-financas.component.html',
  styleUrls: ['./lista-financas.component.css']
})
export class ListaFinancasComponent implements OnInit {

  financas: Financa[] = [];

  displayedColumns: string[] = ['nome', 'categoria', 'vencimento', 'valor', 'pago'];

  constructor(private financaService: FinancaService) { }

  ngOnInit(): void {
    this.carregarFinancas();
  }

  carregarFinancas(): void {
    this.financaService.listarFinancas().subscribe(
      financas => this.financas = financas
    );
  }
}
