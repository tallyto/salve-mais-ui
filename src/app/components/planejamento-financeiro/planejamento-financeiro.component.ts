import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Meta, StatusMeta } from '../../models/meta.model';
import { PlanoCompra, StatusPlano } from '../../models/plano-compra.model';
import { MetaService } from '../../services/meta.service';
import { PlanoCompraService } from '../../services/plano-compra.service';

@Component({
  selector: 'app-planejamento-financeiro',
  templateUrl: './planejamento-financeiro.component.html',
  styleUrls: ['./planejamento-financeiro.component.css'],
  standalone: false
})
export class PlanejamentoFinanceiroComponent implements OnInit {
  metas: Meta[] = [];
  planos: PlanoCompra[] = [];
  isLoading = true;

  // Estatísticas
  totalMetas = 0;
  metasConcluidas = 0;
  metasEmAndamento = 0;
  totalPlanos = 0;
  planosConcluidos = 0;
  planosEmAndamento = 0;

  constructor(
    private metaService: MetaService,
    private planoCompraService: PlanoCompraService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.isLoading = true;

    Promise.all([
      this.metaService.listarTodas().toPromise(),
      this.planoCompraService.listarTodos().toPromise()
    ]).then(([metas, planos]) => {
      this.metas = (metas || []).filter(m => m.status === StatusMeta.EM_ANDAMENTO).slice(0, 5);
      this.planos = (planos || []).filter(p => p.status !== StatusPlano.CANCELADO).slice(0, 5);
      
      // Calcular estatísticas
      this.totalMetas = (metas || []).length;
      this.metasConcluidas = (metas || []).filter(m => m.status === StatusMeta.CONCLUIDA).length;
      this.metasEmAndamento = (metas || []).filter(m => m.status === StatusMeta.EM_ANDAMENTO).length;
      
      this.totalPlanos = (planos || []).length;
      this.planosConcluidos = (planos || []).filter(p => p.status === StatusPlano.CONCLUIDO).length;
      this.planosEmAndamento = (planos || []).filter(p => p.status === StatusPlano.EM_ANDAMENTO).length;
      
      this.isLoading = false;
    }).catch(error => {
      console.error('Erro ao carregar dados:', error);
      this.isLoading = false;
    });
  }

  navegarParaMetas(): void {
    this.router.navigate(['/metas']);
  }

  navegarParaPlanos(): void {
    this.router.navigate(['/planos-compra']);
  }

  getProgressColor(percentual: number): string {
    if (percentual >= 100) return 'accent';
    if (percentual >= 75) return 'primary';
    if (percentual >= 50) return 'primary';
    return 'warn';
  }

  calcularPercentualPlano(plano: PlanoCompra): number {
    if (plano.percentualEconomizado !== undefined && plano.percentualEconomizado !== null) {
      return plano.percentualEconomizado;
    }
    if (plano.valorTotal <= 0) return 0;
    return (plano.valorEconomizado / plano.valorTotal) * 100;
  }
}
