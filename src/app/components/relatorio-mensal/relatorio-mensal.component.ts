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
        console.error('Erro ao gerar relatório atual:', error);
        this.showError('Erro ao gerar relatório atual');
        this.isLoading = false;
      }
    });
  }

  /**
   * Gera relatório para o mês e ano selecionados
   */
  gerarRelatorio(): void {
    if (this.relatorioForm.invalid) {
      this.showError('Por favor, selecione um mês e ano válidos');
      return;
    }

    const { ano, mes } = this.relatorioForm.value;
    this.isLoading = true;

    this.relatorioService.gerarRelatorio(ano, mes).subscribe({
      next: (relatorio) => {
        this.relatorioData = relatorio;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao gerar relatório:', error);
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
        console.error('Erro ao carregar contas vencidas:', error);
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
}
