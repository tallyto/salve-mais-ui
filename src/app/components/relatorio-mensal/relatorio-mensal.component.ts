import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RelatorioMensalService } from '../../services/relatorio-mensal.service';
import { RelatorioMensalDTO, ItemGastoFixoDTO } from '../../models/relatorio-mensal.model';

@Component({
    selector: 'app-relatorio-mensal',
    templateUrl: './relatorio-mensal.component.html',
    styleUrls: ['./relatorio-mensal.component.css'],
    standalone: false
})
export class RelatorioMensalComponent implements OnInit {
  relatorioForm: FormGroup;
  relatorioData: RelatorioMensalDTO | null = null;
  contasVencidas: ItemGastoFixoDTO[] = [];
  isLoading = false;
  isLoadingContas = false;

  // Configuração dos meses
  meses = [
    { value: 1, name: 'Janeiro' },
    { value: 2, name: 'Fevereiro' },
    { value: 3, name: 'Março' },
    { value: 4, name: 'Abril' },
    { value: 5, name: 'Maio' },
    { value: 6, name: 'Junho' },
    { value: 7, name: 'Julho' },
    { value: 8, name: 'Agosto' },
    { value: 9, name: 'Setembro' },
    { value: 10, name: 'Outubro' },
    { value: 11, name: 'Novembro' },
    { value: 12, name: 'Dezembro' }
  ];

  // Configuração dos anos (últimos 5 anos + próximos 2 anos)
  anos: number[] = [];

  // Filtros de mês e ano
  selectedMonth: number;
  selectedYear: number;
  months: { value: number, name: string }[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private relatorioService: RelatorioMensalService,
    private snackBar: MatSnackBar
  ) {
    // Gerar lista de anos
    const anoAtual = new Date().getFullYear();
    for (let i = anoAtual - 5; i <= anoAtual + 2; i++) {
      this.anos.push(i);
    }

    // Inicializar formulário
    this.relatorioForm = this.formBuilder.group({
      ano: [anoAtual, [Validators.required]],
      mes: [new Date().getMonth() + 1, [Validators.required]]
    });

    // Inicializar filtros
    this.months = this.meses;
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
  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

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
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  /**
   * Mostra mensagem de sucesso
   */
  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
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
}
