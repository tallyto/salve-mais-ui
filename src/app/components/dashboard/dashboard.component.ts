import { Component, OnInit } from '@angular/core';
import { FinancaService } from '../../services/financa.service';
import { Financa } from '../../models/financa.model';
import { ProventoService } from 'src/app/services/provento.service';
import { Provento } from 'src/app/models/provento.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  displayedColumnsContasFixas: string[] = ['nome', 'categoria', 'vencimento', 'valor', 'pago'];
  displayedColumnsProventos: string[] = ['nome', 'data', 'valor'];

  contasFixas: Financa[] = [];
  proventos: Provento[] = [];

  constructor(private financaService: FinancaService, private proventoService: ProventoService) { }


  ngOnInit(): void {
    this.carregarContasFixas();
    this.carregarProventos();
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
}
