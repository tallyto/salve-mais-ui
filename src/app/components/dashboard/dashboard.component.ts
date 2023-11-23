import {Component, OnInit} from '@angular/core';
import {FinancaService} from '../../services/financa.service';
import {Financa} from '../../models/financa.model';
import {ProventoService} from 'src/app/services/provento.service';
import {Provento} from 'src/app/models/provento.model';
import {GastoCartaoService} from "../../services/gasto-cartao.service";
import {GastoCartao} from "../../models/gasto-cartao.model";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  displayedColumnsContasFixas: string[] = ['nome', 'categoria', 'vencimento', 'valor', 'pago'];
  displayedColumnsProventos: string[] = ['nome', 'data', 'valor'];
  displayedColumnsGastoRecorrente: string[] = ['descricao', 'categoria', 'cartaoCredito', 'data', 'valor'];

  listGastosRecorrentes: GastoCartao[] = [];
  contasFixas: Financa[] = [];
  proventos: Provento[] = [];

  constructor(
    private financaService: FinancaService,
    private proventoService: ProventoService,
    private despesaRecorrenteService: GastoCartaoService,
  ) {
  }


  ngOnInit(): void {
    this.carregarContasFixas();
    this.carregarProventos();
    this.carregarGastoRecorrente();
  }

  carregarContasFixas(): void {
    this.financaService.listarFinancas().subscribe(
      contasFixas => this.contasFixas = contasFixas
    );
  }

  carregarProventos(): void {
    this.proventoService.listarProventos().subscribe(
      proventos => this.proventos = proventos
    );
  }

  carregarGastoRecorrente(): void {
    this.despesaRecorrenteService.listCompras().subscribe(
      gastoRecorrente => this.listGastosRecorrentes = gastoRecorrente
    );
  }
}
