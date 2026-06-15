import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaturaService } from '@services/fatura.service';
import { ContasFixasService } from '@services/contas-fixas.service';
import { CompraParceladaService } from '@services/compra-parcelada.service';
import { FaturaResponseDTO } from '@models/fatura.model';
import { Financa } from '@models/financa.model';
import { CompraParcelada } from '@models/compra-parcelada.model';
import { Page } from '@models/page.model';
import { forkJoin } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SALVE_COMMON, SALVE_DATA, SALVE_OVERLAY } from '@shared/primeng-shared';

interface StatusPagamentos {
  faturasPagas: FaturaResponseDTO[];
  faturasPendentes: FaturaResponseDTO[];
  contasFixasPagas: Financa[];
  contasFixasPendentes: Financa[];
  comprasParceladas: CompraParcelada[];
  totalPago: number;
  totalPendente: number;
}

@Component({
  selector: 'app-list-pagamentos-status',
  templateUrl: './list-pagamentos-status.component.html',
  standalone: true,
  imports: [CommonModule, ...SALVE_COMMON, ...SALVE_DATA, ...SALVE_OVERLAY]
})
export class ListPagamentosStatusComponent implements OnInit {
  isLoading = true;
  statusPagamentos: StatusPagamentos = {
    faturasPagas: [],
    faturasPendentes: [],
    contasFixasPagas: [],
    contasFixasPendentes: [],
    comprasParceladas: [],
    totalPago: 0,
    totalPendente: 0
  };

  // Colunas das tabelas
  faturasColumns = ['nomeCartao', 'valor', 'vencimento', 'dataPagamento', 'status'];
  faturasPagasColumns = ['nomeCartao', 'valor', 'vencimento', 'dataPagamento', 'status', 'acoes'];
  contasFixasColumns = ['nome', 'categoria', 'valor', 'vencimento', 'status'];

  constructor(
    private faturaService: FaturaService,
    private contasFixasService: ContasFixasService,
    private compraParceladaService: CompraParceladaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.isLoading = true;

    // Buscar mês e ano atuais
    const now = new Date();
    const mes = now.getMonth() + 1;
    const ano = now.getFullYear();

    forkJoin({
      todasFaturas: this.faturaService.listarFaturasNovas(0, 100, 'id,desc', mes, ano),
      contasFixas: this.contasFixasService.listarFinancas(0, 100, 'vencimento,asc', mes, ano),
      comprasParceladas: this.compraParceladaService.listar(0, 100)
    }).subscribe({
      next: (dados) => {
        // Extrair faturas do objeto Page
        const todasFaturasArray = (dados.todasFaturas as Page<FaturaResponseDTO>).content || [];

        // Separar faturas pagas e pendentes
        this.statusPagamentos.faturasPagas = todasFaturasArray.filter((f: FaturaResponseDTO) => f.pago);
        this.statusPagamentos.faturasPendentes = todasFaturasArray.filter((f: FaturaResponseDTO) => !f.pago);

        // Extrair o array de contas fixas do objeto Page e separar pagas e pendentes
        // As contas fixas já vêm filtradas por mês/ano do serviço
        const contasFixasArray = Array.isArray(dados.contasFixas) 
          ? dados.contasFixas 
          : (dados.contasFixas as Page<Financa>).content || [];
        
        this.statusPagamentos.contasFixasPagas = contasFixasArray.filter((c: Financa) => c.pago);
        this.statusPagamentos.contasFixasPendentes = contasFixasArray.filter((c: Financa) => !c.pago);

        // Compras parceladas
        this.statusPagamentos.comprasParceladas = dados.comprasParceladas.content || [];

        // Calcular totais
        this.calcularTotais();

        this.isLoading = false;
      },
      error: (error) => {
        this.showError('Erro ao carregar dados de pagamentos');
        this.isLoading = false;
      }
    });
  }

  calcularTotais(): void {
    // Total pago (faturas + contas fixas)
    const totalFaturasPagas = this.statusPagamentos.faturasPagas
      .reduce((sum, f) => sum + f.valorTotal, 0);
    
    const totalContasFixasPagas = this.statusPagamentos.contasFixasPagas
      .reduce((sum, c) => sum + c.valor, 0);

    this.statusPagamentos.totalPago = totalFaturasPagas + totalContasFixasPagas;

    // Total pendente (faturas + contas fixas)
    const totalFaturasPendentes = this.statusPagamentos.faturasPendentes
      .reduce((sum, f) => sum + f.valorTotal, 0);
    
    const totalContasFixasPendentes = this.statusPagamentos.contasFixasPendentes
      .reduce((sum, c) => sum + c.valor, 0);

    this.statusPagamentos.totalPendente = totalFaturasPendentes + totalContasFixasPendentes;
  }

  getParcelasPagasMes(compra: CompraParcelada): number {
    if (!compra.parcelas) return 0;
    
    const now = new Date();
    const mesAtual = now.getMonth() + 1;
    const anoAtual = now.getFullYear();

    return compra.parcelas.filter(p => {
      if (!p.paga) return false;
      const dataVencimento = new Date(p.dataVencimento);
      return dataVencimento.getMonth() + 1 === mesAtual && 
             dataVencimento.getFullYear() === anoAtual;
    }).length;
  }

  getParcelasPendentesMes(compra: CompraParcelada): number {
    if (!compra.parcelas) return 0;
    
    const now = new Date();
    const mesAtual = now.getMonth() + 1;
    const anoAtual = now.getFullYear();

    return compra.parcelas.filter(p => {
      if (p.paga) return false;
      const dataVencimento = new Date(p.dataVencimento);
      return dataVencimento.getMonth() + 1 === mesAtual && 
             dataVencimento.getFullYear() === anoAtual;
    }).length;
  }

  getValorParcelasPagasMes(compra: CompraParcelada): number {
    if (!compra.parcelas) return 0;
    
    const now = new Date();
    const mesAtual = now.getMonth() + 1;
    const anoAtual = now.getFullYear();

    return compra.parcelas
      .filter(p => {
        if (!p.paga) return false;
        const dataVencimento = new Date(p.dataVencimento);
        return dataVencimento.getMonth() + 1 === mesAtual && 
               dataVencimento.getFullYear() === anoAtual;
      })
      .reduce((sum, p) => sum + p.valor, 0);
  }

  getValorParcelasPendentesMes(compra: CompraParcelada): number {
    if (!compra.parcelas) return 0;
    
    const now = new Date();
    const mesAtual = now.getMonth() + 1;
    const anoAtual = now.getFullYear();

    return compra.parcelas
      .filter(p => {
        if (p.paga) return false;
        const dataVencimento = new Date(p.dataVencimento);
        return dataVencimento.getMonth() + 1 === mesAtual && 
               dataVencimento.getFullYear() === anoAtual;
      })
      .reduce((sum, p) => sum + p.valor, 0);
  }

  podeExcluirFatura(fatura: FaturaResponseDTO): boolean {
    return fatura.pago && !fatura.contaPagamentoId;
  }

  confirmarExclusaoFatura(fatura: FaturaResponseDTO): void {
    this.confirmationService.confirm({
      header: 'Excluir fatura',
      message: `Tem certeza que deseja excluir a fatura do cartão <b>${fatura.nomeCartao}</b> no valor de <b>R$ ${fatura.valorTotal.toFixed(2)}</b>? Essa ação não poderá ser desfeita.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.excluirFatura(fatura);
      }
    });
  }

  private excluirFatura(fatura: FaturaResponseDTO): void {
    this.faturaService.excluirFatura(fatura.id).subscribe({
      next: () => {
        this.showSuccess('Fatura excluída com sucesso.');
        this.carregarDados();
      },
      error: () => this.showError('Erro ao excluir a fatura. Tente novamente.')
    });
  }

  getProgressoCompra(compra: CompraParcelada): number {
    const total = compra.totalParcelas || 0;
    const restantes = compra.parcelasRestantes || 0;
    if (total === 0) return 0;
    return Math.round(((total - restantes) / total) * 100);
  }

  private showSuccess(message: string): void {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });
  }

  private showError(message: string): void {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: message });
  }
}
