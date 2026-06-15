import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CompraParceladaService } from '@services/compra-parcelada.service';
import { CategoriaService } from '@services/categoria.service';
import { CartaoService } from '@services/cartao.service';
import { CompraParcelada, Parcela } from '@models/compra-parcelada.model';
import { Categoria } from '@models/categoria.model';
import { Cartao } from '@models/cartao.model';
import { SALVE_COMMON, SALVE_FORMS, SALVE_DATA } from '@shared/primeng-shared';
import { StatCardComponent } from '@components/shared';

@Component({
  selector: 'app-list-compras-parceladas',
  standalone: true,
  imports: [
    ...SALVE_COMMON,
    ...SALVE_FORMS,
    ...SALVE_DATA,
    StatCardComponent
  ],
  templateUrl: './list-compras-parceladas.component.html'
})
export class ListComprasParceladasComponent implements OnInit {
  compras: CompraParcelada[] = [];
  todasCompras: CompraParcelada[] = []; // Cache de todas as compras
  categorias: Categoria[] = [];
  cartoes: Cartao[] = [];
  loading: boolean = false;
  page: number = 0;
  size: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;
  expandedCompraId: number | null = null;

  // Filtros
  filtroCartaoId: number | null = null;
  filtroCategoriaId: number | null = null;
  buscaTexto: string = '';
  filtroApenasPendentes: boolean = false;
  mostrarArquivadas: boolean = false;
  statusOptions = [
    { label: 'Todas', value: false },
    { label: 'Apenas pendentes', value: true }
  ];
  arquivoOptions = [
    { label: 'Ativas', value: false },
    { label: 'Arquivadas', value: true }
  ];

  constructor(
    private compraParceladaService: CompraParceladaService,
    private categoriaService: CategoriaService,
    private cartaoService: CartaoService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadCompras();
    this.loadCategorias();
    this.loadCartoes();
  }

  loadCategorias(): void {
    this.categoriaService.listarCategorias().subscribe({
      next: (categorias: Categoria[]) => {
        this.categorias = categorias;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar categorias.' });
      }
    });
  }

  loadCartoes(): void {
    this.cartaoService.listarCartoes().subscribe({
      next: (cartoes: Cartao[]) => {
        this.cartoes = cartoes;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar cartões.' });
      }
    });
  }

  loadCompras(): void {
    this.loading = true;

    // Usa a API com filtros no backend
    this.compraParceladaService.listar(
      this.page, 
      this.size,
      this.filtroCartaoId,
      this.filtroCategoriaId,
      this.filtroApenasPendentes,
      this.mostrarArquivadas
    ).subscribe({
      next: (response) => {
        this.compras = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        
        // Aplicar busca textual local (já que o backend não tem esse filtro)
        if (this.buscaTexto && this.buscaTexto.trim() !== '') {
          const termo = this.buscaTexto.toLowerCase().trim();
          this.compras = this.compras.filter(c => 
            c.descricao.toLowerCase().includes(termo) ||
            c.categoriaNome?.toLowerCase().includes(termo) ||
            c.cartaoNome?.toLowerCase().includes(termo)
          );
          this.totalElements = this.compras.length;
        }

        this.loading = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar compras parceladas.' });
        this.loading = false;
      }
    });
  }

  aplicarFiltros(): void {
    this.page = 0; // Reset para primeira página
    this.loadCompras();
  }

  /**
   * Aplicar busca em tempo real sem resetar página
   */
  atualizarBusca(): void {
    if (this.buscaTexto === '') {
      // Se limpar o campo, recarrega com filtros
      this.aplicarFiltros();
    } else {
      // Se está digitando, filtra localmente
      this.loadCompras();
    }
  }

  limparFiltros(): void {
    this.filtroCartaoId = null;
    this.filtroCategoriaId = null;
    this.buscaTexto = '';
    this.filtroApenasPendentes = false;
    this.mostrarArquivadas = false;
    this.page = 0;
    this.loadCompras();
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
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao marcar parcela como paga.' });
        }
      });
    } else {
      this.compraParceladaService.desmarcarParcelaComoPaga(parcela.id).subscribe({
        next: (parcelaAtualizada) => {
          parcela.paga = parcelaAtualizada.paga;
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao desmarcar parcela.' });
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
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao desmarcar parcela.' });
        }
      });
    } else {
      this.compraParceladaService.marcarParcelaComoPaga(parcela.id).subscribe({
        next: () => {
          parcela.paga = true;
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao marcar parcela como paga.' });
        }
      });
    }
  }

  excluirCompra(compra: CompraParcelada): void {
    this.confirmationService.confirm({
      message: `Deseja realmente excluir a compra "${compra.descricao}"? Todas as parcelas serão excluídas.`,
      header: 'Excluir compra parcelada',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.compraParceladaService.excluir(compra.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Compra parcelada excluída com sucesso.' });
            this.loadCompras();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir compra parcelada.' });
          }
        });
      }
    });
  }

  excluir(id: number): void {
    this.excluirCompra(this.compras.find(c => c.id === id)!);
  }

  novaCompra(): void {
    this.router.navigate(['/compras-parceladas/nova']);
  }

  editar(id: number): void {
    this.router.navigate(['/compras-parceladas/editar', id]);
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

  calcularTotalCompras(): number {
    return this.compras.reduce((sum, compra) => sum + (compra.valorTotal || 0), 0);
  }

  getProgressoPagamento(compra: CompraParcelada): number {
    if (!compra.parcelas || compra.parcelas.length === 0) return 0;
    const pagas = this.calcularParcelasPagas(compra.parcelas);
    return (pagas / compra.parcelas.length) * 100;
  }

  onPageChange(event: any): void {
    this.page = event.page ?? 0;
    this.size = event.rows ?? this.size;
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

  /**
   * Formata data string (YYYY-MM-DD) para formato brasileiro (dd/MM/yyyy)
   * Evita problemas de timezone ao converter strings ISO para Date
   */
  formatarData(dataStr: string): string {
    if (!dataStr) return '';

    // Se já vier no formato dd/MM/yyyy, retorna direto
    if (dataStr.includes('/')) return dataStr;

    // Converte YYYY-MM-DD para dd/MM/yyyy
    const partes = dataStr.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    return dataStr;
  }

  /**
   * Arquiva uma compra parcelada
   */
  arquivarCompra(compra: CompraParcelada): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja arquivar "${compra.descricao}"?`,
      header: 'Arquivar compra parcelada',
      icon: 'pi pi-archive',
      acceptLabel: 'Arquivar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.compraParceladaService.arquivar(compra.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Compra parcelada arquivada com sucesso.' });
            this.loadCompras();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao arquivar compra parcelada.' });
          }
        });
      }
    });
  }

  /**
   * Desarchiva uma compra parcelada
   */
  desarquivarCompra(compra: CompraParcelada): void {
    this.compraParceladaService.desarquivar(compra.id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Compra parcelada desarquivada com sucesso.' });
        this.loadCompras();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao desarquivar compra parcelada.' });
      }
    });
  }
}
