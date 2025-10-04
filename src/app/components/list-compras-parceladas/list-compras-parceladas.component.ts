import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CompraParceladaService } from '../../services/compra-parcelada.service';
import { CompraParcelada, Parcela } from '../../models/compra-parcelada.model';

@Component({
  selector: 'app-list-compras-parceladas',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './list-compras-parceladas.component.html',
  styleUrls: ['./list-compras-parceladas.component.css']
})
export class ListComprasParceladasComponent implements OnInit {
  compras: CompraParcelada[] = [];
  loading: boolean = false;
  page: number = 0;
  size: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;
  expandedCompraId: number | null = null;

  constructor(
    private compraParceladaService: CompraParceladaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCompras();
  }

  loadCompras(): void {
    this.loading = true;
    this.compraParceladaService.listar(this.page, this.size).subscribe({
      next: (response) => {
        this.compras = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar compras parceladas:', error);
        this.loading = false;
      }
    });
  }

  toggleExpandCompra(compraId: number): void {
    if (this.expandedCompraId === compraId) {
      this.expandedCompraId = null;
    } else {
      this.expandedCompraId = compraId;
    }
  }

  isExpanded(compra: CompraParcelada): boolean {
    return true; // Sempre retorna true para permitir a renderização da linha de detalhes
  }

  isRowExpanded(compra: CompraParcelada): boolean {
    return this.expandedCompraId === compra.id;
  }

  togglePagamento(parcela: Parcela, paga: boolean): void {
    if (paga) {
      this.compraParceladaService.marcarParcelaComoPaga(parcela.id).subscribe({
        next: (parcelaAtualizada) => {
          parcela.paga = parcelaAtualizada.paga;
        },
        error: (error: any) => {
          console.error('Erro ao marcar parcela como paga:', error);
          alert('Erro ao marcar parcela como paga');
        }
      });
    } else {
      this.compraParceladaService.desmarcarParcelaComoPaga(parcela.id).subscribe({
        next: (parcelaAtualizada) => {
          parcela.paga = parcelaAtualizada.paga;
        },
        error: (error: any) => {
          console.error('Erro ao desmarcar parcela:', error);
          alert('Erro ao desmarcar parcela');
        }
      });
    }
  }

  marcarParcelaComoPaga(parcela: Parcela): void {
    if (parcela.paga) {
      this.compraParceladaService.desmarcarParcelaComoPaga(parcela.id).subscribe({
        next: () => {
          parcela.paga = false;
        },
        error: (error: any) => {
          console.error('Erro ao desmarcar parcela:', error);
          alert('Erro ao desmarcar parcela como paga');
        }
      });
    } else {
      this.compraParceladaService.marcarParcelaComoPaga(parcela.id).subscribe({
        next: () => {
          parcela.paga = true;
        },
        error: (error: any) => {
          console.error('Erro ao marcar parcela:', error);
          alert('Erro ao marcar parcela como paga');
        }
      });
    }
  }

  excluirCompra(compra: CompraParcelada): void {
    if (confirm(`Deseja realmente excluir a compra "${compra.descricao}"? Todas as parcelas serão excluídas.`)) {
      this.compraParceladaService.excluir(compra.id).subscribe({
        next: () => {
          alert('Compra parcelada excluída com sucesso!');
          this.loadCompras();
        },
        error: (error: any) => {
          console.error('Erro ao excluir compra:', error);
          alert('Erro ao excluir compra parcelada');
        }
      });
    }
  }

  excluir(id: number): void {
    this.excluirCompra(this.compras.find(c => c.id === id)!);
  }

  novaCompra(): void {
    this.router.navigate(['/compras-parceladas/nova']);
  }

  calcularParcelasPagas(parcelas?: Parcela[]): number {
    if (!parcelas) return 0;
    return parcelas.filter(p => p.paga).length;
  }

  calcularValorPago(parcelas?: Parcela[]): number {
    if (!parcelas) return 0;
    return parcelas.filter(p => p.paga).reduce((sum, p) => sum + p.valor, 0);
  }

  calcularValorRestante(parcelas?: Parcela[]): number {
    if (!parcelas) return 0;
    return parcelas.filter(p => !p.paga).reduce((sum, p) => sum + p.valor, 0);
  }

  getProgressoPagamento(compra: CompraParcelada): number {
    if (!compra.parcelas || compra.parcelas.length === 0) return 0;
    const pagas = this.calcularParcelasPagas(compra.parcelas);
    return (pagas / compra.parcelas.length) * 100;
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.loadCompras();
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadCompras();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadCompras();
    }
  }
}
