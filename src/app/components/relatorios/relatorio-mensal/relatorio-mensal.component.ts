import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { RelatorioMensalService } from '@services/relatorio-mensal.service';
import { RelatorioMensalDTO, ItemGastoFixoDTO } from '@models/relatorio-mensal.model';
import { MONTHS, generateYears, formatarMoeda } from '@shared/utils';
import { SALVE_COMMON, SALVE_FORMS, SALVE_DATA, SALVE_OVERLAY } from '@shared/primeng-shared';
import { MonthYearFilterComponent } from '@components/dashboard/month-year-filter/month-year-filter.component';

@Component({
    selector: 'app-relatorio-mensal',
    templateUrl: './relatorio-mensal.component.html',
    standalone: true,
    imports: [...SALVE_COMMON, ...SALVE_FORMS, ...SALVE_DATA, ...SALVE_OVERLAY, MonthYearFilterComponent]
})
export class RelatorioMensalComponent implements OnInit {
  relatorioForm: FormGroup;
  relatorioData: RelatorioMensalDTO | null = null;
  contasVencidas: ItemGastoFixoDTO[] = [];
  isLoading = false;
  isLoadingContas = false;
  formatarMoeda = formatarMoeda;

  expandedCartoes = new Set<number>();

  isCartaoExpanded(id: number): boolean { return this.expandedCartoes.has(id); }
  toggleCartao(id: number): void {
    this.expandedCartoes.has(id) ? this.expandedCartoes.delete(id) : this.expandedCartoes.add(id);
  }

  // Filtros de mês e ano
  selectedMonth: number;
  selectedYear: number;
  years = generateYears(5, 2);

  get meses() {
    return MONTHS.map(m => ({ value: m.value, name: m.label }));
  }

  get months() {
    return MONTHS.map(m => ({ value: m.value, name: m.label }));
  }

  constructor(
    private formBuilder: FormBuilder,
    private relatorioService: RelatorioMensalService,
    private messageService: MessageService
  ) {
    // Inicializar formulário
    const anoAtual = new Date().getFullYear();
    this.relatorioForm = this.formBuilder.group({
      ano: [anoAtual, [Validators.required]],
      mes: [new Date().getMonth() + 1, [Validators.required]]
    });

    // Inicializar filtros
    this.selectedMonth = new Date().getMonth() + 1;
    this.selectedYear = anoAtual;
  }

  ngOnInit(): void {
    this.gerarRelatorioAtual();
    this.carregarContasVencidas();
  }

  /**
   * Gera relatório para o mês atual
   */
  gerarRelatorioAtual(): void {
    this.isLoading = true;
    this.relatorioService.gerarRelatorioAtual().subscribe({
      next: (relatorio) => {
        this.relatorioData = relatorio;
        this.isLoading = false;
      },
      error: (error) => {
        this.showError('Erro ao gerar relatório atual');
        this.isLoading = false;
      }
    });
  }

  /**
   * Gera relatório para o mês e ano selecionados
   */
  gerarRelatorio(): void {
    this.isLoading = true;

    this.relatorioService.gerarRelatorio(this.selectedYear, this.selectedMonth).subscribe({
      next: (relatorio) => {
        this.relatorioData = relatorio;
        this.isLoading = false;
      },
      error: (error) => {
        this.showError('Erro ao gerar relatório');
        this.isLoading = false;
      }
    });
  }

  /**
   * Carrega contas vencidas
   */
  carregarContasVencidas(): void {
    this.isLoadingContas = true;
    this.relatorioService.obterContasVencidas().subscribe({
      next: (contas) => {
        this.contasVencidas = contas;
        this.isLoadingContas = false;
      },
      error: (error) => {
        this.showError('Erro ao carregar contas vencidas');
        this.isLoadingContas = false;
      }
    });
  }

  /**
   * Formata valor para moeda brasileira
   */

  /**
   * Formata data para padrão brasileiro
   */
  formatarData(data: Date): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  /**
   * Retorna a classe CSS baseada no status de pagamento
   */
  getStatusClass(pago: boolean): string {
    return pago ? 'status-pago' : 'status-pendente';
  }

  /**
   * Retorna o texto do status
   */
  getStatusText(pago: boolean): string {
    return pago ? 'Pago' : 'Pendente';
  }

  /**
   * Mostra mensagem de erro
   */
  private showError(message: string): void {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: message });
  }

  /**
   * Mostra mensagem de sucesso
   */
  private showSuccess(message: string): void {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });
  }

  /**
   * Retorna texto do período selecionado
   */
  getSelectedPeriodText(): string {
    const mesNome = this.meses.find(m => m.value === this.selectedMonth)?.name || '';
    return `${mesNome} de ${this.selectedYear}`;
  }

  /**
   * Vai para o mês anterior
   */
  previousMonth(): void {
    let mes = this.selectedMonth - 1;
    let ano = this.selectedYear;
    if (mes < 1) {
      mes = 12;
      ano--;
    }
    this.selectedMonth = mes;
    this.selectedYear = ano;
    this.onFilterChange();
  }

  /**
   * Vai para o próximo mês
   */
  nextMonth(): void {
    let mes = this.selectedMonth + 1;
    let ano = this.selectedYear;
    if (mes > 12) {
      mes = 1;
      ano++;
    }
    this.selectedMonth = mes;
    this.selectedYear = ano;
    this.onFilterChange();
  }

  /**
   * Verifica se é o mês atual
   */
  isCurrentMonth(): boolean {
    const hoje = new Date();
    return this.selectedMonth === hoje.getMonth() + 1 && 
           this.selectedYear === hoje.getFullYear();
  }

  /**
   * Verifica se é o mês passado
   */
  isLastMonth(): boolean {
    const hoje = new Date();
    let mesPassado = hoje.getMonth();
    let anoPassado = hoje.getFullYear();
    if (mesPassado === 0) {
      mesPassado = 12;
      anoPassado--;
    }
    return this.selectedMonth === mesPassado && 
           this.selectedYear === anoPassado;
  }

  /**
   * Verifica se é o próximo mês
   */
  isNextMonth(): boolean {
    const hoje = new Date();
    let proximoMes = hoje.getMonth() + 2;
    let anoProximo = hoje.getFullYear();
    if (proximoMes > 12) {
      proximoMes -= 12;
      anoProximo++;
    }
    return this.selectedMonth === proximoMes && 
           this.selectedYear === anoProximo;
  }

  /**
   * Define para o mês passado
   */
  setLastMonth(): void {
    const hoje = new Date();
    let mes = hoje.getMonth();
    let ano = hoje.getFullYear();
    if (mes === 0) {
      mes = 12;
      ano--;
    }
    this.selectedMonth = mes;
    this.selectedYear = ano;
    this.onFilterChange();
  }

  /**
   * Define para o próximo mês
   */
  setNextMonth(): void {
    const hoje = new Date();
    let mes = hoje.getMonth() + 2;
    let ano = hoje.getFullYear();
    if (mes > 12) {
      mes -= 12;
      ano++;
    }
    this.selectedMonth = mes;
    this.selectedYear = ano;
    this.onFilterChange();
  }


  /**
   * Reset para o mês/ano atual
   */
  resetFilters(): void {
    const hoje = new Date();
    this.selectedMonth = hoje.getMonth() + 1;
    this.selectedYear = hoje.getFullYear();
    this.onFilterChange();
  }

  /**
   * Chamado quando os filtros mudam
   */
  onFilterChange(): void {
    this.gerarRelatorio();
  }

  onPeriodChange(period: { month: number; year: number }): void {
    this.selectedMonth = period.month;
    this.selectedYear = period.year;
    this.onFilterChange();
  }

  /**
   * Exporta o relatório mensal para Excel
   */
  exportarRelatorioParaExcel(): void {
    if (!this.relatorioData) {
      this.showError('Não há dados para exportar. Aguarde o carregamento dos dados.');
      return;
    }

    this.relatorioService.exportarRelatorioParaExcel(this.selectedYear, this.selectedMonth).subscribe({
      next: (data: Blob) => {
        // Criar um link temporário para download do arquivo
        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        
        // Definir nome do arquivo baseado no período selecionado
        const fileName = `relatorio-mensal-${this.selectedMonth.toString().padStart(2, '0')}-${this.selectedYear}.xlsx`;
        link.download = fileName;
        
        // Adicionar ao DOM, disparar clique e remover
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Liberar a URL do blob
        window.URL.revokeObjectURL(url);
        
        this.showSuccess('Relatório exportado com sucesso!');
      },
      error: (error) => {
        this.showError('Erro ao exportar relatório. Tente novamente.');
      }
    });
  }
}
