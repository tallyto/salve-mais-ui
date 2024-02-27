import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FinancaService} from '../../services/financa.service';
import {Financa} from '../../models/financa.model';
import {ProventoService} from 'src/app/services/provento.service';
import {Provento} from 'src/app/models/provento.model';
import {GastoCartaoService} from "../../services/gasto-cartao.service";
import {GastoCartao} from "../../models/gasto-cartao.model";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {catchError, map, merge, of as observableOf, startWith, switchMap} from "rxjs";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  displayedColumnsContasFixas: string[] = ['nome', 'categoria', 'vencimento', 'valor', 'pago'];
  displayedColumnsProventos: string[] = ['nome', 'data', 'valor'];
  displayedColumnsGastoRecorrente: string[] = ['descricao', 'categoria', 'cartaoCredito', 'data', 'valor'];

  listGastosRecorrentes: GastoCartao[] = [];
  contasFixas: Financa[] = [];
  proventos: Provento[] = [];

  resultsLength = 0;
  isLoadingResults = true;


  // @ts-expect-error
  @ViewChild(MatPaginator) paginator: MatPaginator
  // @ts-expect-error
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private financaService: FinancaService,
    private proventoService: ProventoService,
    private despesaRecorrenteService: GastoCartaoService,
  ) {
  }


  ngOnInit(): void {
    this.carregarContasFixas();
    this.carregarProventos();
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          const sort = `${this.sort.active},${this.sort.direction}`
          return this.despesaRecorrenteService.listCompras(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            sort,
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;

          // @ts-expect-error
          if (data.content === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          // @ts-ignore
          this.resultsLength = data.totalElements;
          // @ts-ignore
          return data.content;
        }),
      )
      .subscribe(data => (this.listGastosRecorrentes = data));

  }

  carregarContasFixas(): void {
    this.financaService.listarFinancas().subscribe(
      contasFixas => this.contasFixas = contasFixas
    );
  }

  carregarProventos(): void {
    this.proventoService.listarProventos().subscribe(
      // @ts-expect-error
      proventos => this.proventos = proventos.content
    );
  }

}
