import { Component, OnInit } from '@angular/core';
import { Financa } from "../../models/financa.model";
import { ContasFixasService } from "../../services/financa.service";
import { catchError, map, of as observableOf } from "rxjs";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { TableLazyLoadEvent } from 'primeng/table';
import { ComprovantesDialogComponent } from '../cartao/comprovantes-dialog/comprovantes-dialog.component';
import { MONTHS, generateYears } from '../../shared/utils';
import { LazyTableBase } from '../../shared/lazy-table.base';

@Component({
    selector: 'app-list-contas-fixas',
    templateUrl: './list-contas-fixas.component.html',
    standalone: false
})
export class ListContasFixasComponent extends LazyTableBase implements OnInit {
  displayedColumnsContasFixas: string[] = ['nome', 'categoria', 'conta', 'vencimento', 'valor', 'pago', 'acoes'];
  contasFixas: Financa[] = [];
  editingDespesa: Financa | null = null;
  despesaForm: FormGroup;

  // Filtros de mês e ano
  selectedMonth: number;
  selectedYear: number;
  months = MONTHS;
  years: number[] = [];

  constructor(
    private financaService: ContasFixasService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder,
    private dialogService: DialogService
  ) {
    super();
    this.despesaForm = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      categoriaId: ['', Validators.required],
      contaId: ['', Validators.required],
      vencimento: ['', Validators.required],
      valor: [0, [Validators.required, Validators.min(0)]],
      pago: [false]
    });

    this.financaService.financasChanged$.subscribe(
      {
        next: () => {
          this.carregarDados()
        }
      }
    );

    // Inicializar filtros com mês e ano atuais
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1; // getMonth() retorna 0-11
    this.selectedYear = currentDate.getFullYear();

    // Gerar lista de anos (últimos 3 anos até próximos 2 anos)
    this.generateYears();
  }

  ngOnInit(): void {
    this.carregarDados()
  }

  protected carregarDados(): void {
    this.refreshContasFixasList();
  }

  startEdit(despesa: Financa): void {
    this.editingDespesa = despesa;
    this.despesaForm.patchValue({
      id: despesa.id,
      nome: despesa.nome,
      categoriaId: despesa.categoria?.id,
      contaId: despesa.conta?.id, // Corrigido para usar conta.id
      vencimento: despesa.vencimento,
      valor: despesa.valor,
      pago: despesa.pago
    });

    // Emitir evento para que o componente principal possa reagir
    this.financaService.editingFinanca$.next(despesa);
  }

  cancelEdit(): void {
    this.editingDespesa = null;
  }

  saveEdit(): void {
    if (this.despesaForm.valid && this.editingDespesa) {
      const updatedDespesa = {
        ...this.editingDespesa,
        ...this.despesaForm.value
      };

      this.financaService.salvarFinanca(updatedDespesa).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Despesa atualizada com sucesso.' });
          this.editingDespesa = null;
          this.refreshContasFixasList();
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar despesa.' });
        }
      });
    }
  }

  excluirDespesa(despesa: Financa): void {
    this.confirmationService.confirm({
      message: `Deseja realmente excluir a despesa "${despesa.nome}"?`,
      header: 'Excluir despesa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.financaService.excluirFinanca(despesa.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Despesa excluída com sucesso.' });
            this.refreshContasFixasList();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir despesa.' });
          }
        });
      }
    });
  }

  isEditing(despesa: Financa): boolean {
    return this.editingDespesa !== null && this.editingDespesa.id === despesa.id;
  }

  onFilterChange(): void {
    this.pageIndex = 0;
    this.refreshContasFixasList();
  }

  onPeriodChange(period: { month: number; year: number }): void {
    this.selectedMonth = period.month;
    this.selectedYear = period.year;
    this.onFilterChange();
  }

  override onLazyLoad(event: TableLazyLoadEvent): void {
    super.onLazyLoad(event);
    this.carregarDados();
  }

  resetFilters(): void {
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();
    this.onFilterChange();
  }

  getSelectedPeriodText(): string {
    const monthName = this.months.find(m => m.value === this.selectedMonth)?.label || '';
    return `${monthName} de ${this.selectedYear}`;
  }

  calcularTotal(): number {
    return this.contasFixas.reduce((sum, conta) => sum + (conta.valor || 0), 0);
  }

  private generateYears(): void {
    this.years = generateYears();
  }
  
  /**
   * Navega para o mês anterior
   */
  previousMonth(): void {
    if (this.selectedMonth === 1) {
      this.selectedMonth = 12;
      this.selectedYear--;
    } else {
      this.selectedMonth--;
    }
    this.onFilterChange();
  }
  
  /**
   * Navega para o próximo mês
   */
  nextMonth(): void {
    if (this.selectedMonth === 12) {
      this.selectedMonth = 1;
      this.selectedYear++;
    } else {
      this.selectedMonth++;
    }
    this.onFilterChange();
  }
  
  /**
   * Define o filtro para o mês passado
   */
  setLastMonth(): void {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    this.selectedMonth = lastMonth.getMonth() + 1;
    this.selectedYear = lastMonth.getFullYear();
    this.onFilterChange();
  }
  
  /**
   * Define o filtro para o próximo mês
   */
  setNextMonth(): void {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    this.selectedMonth = nextMonth.getMonth() + 1;
    this.selectedYear = nextMonth.getFullYear();
    this.onFilterChange();
  }
  
  /**
   * Verifica se o filtro está no mês atual
   */
  isCurrentMonth(): boolean {
    const currentDate = new Date();
    return this.selectedMonth === currentDate.getMonth() + 1 && 
           this.selectedYear === currentDate.getFullYear();
  }
  
  /**
   * Verifica se o filtro está no mês passado
   */
  isLastMonth(): boolean {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return this.selectedMonth === lastMonth.getMonth() + 1 && 
           this.selectedYear === lastMonth.getFullYear();
  }
  
  /**
   * Verifica se o filtro está no próximo mês
   */
  isNextMonth(): boolean {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return this.selectedMonth === nextMonth.getMonth() + 1 && 
           this.selectedYear === nextMonth.getFullYear();
  }

  /**
   * Exporta as contas fixas para Excel
   */
  exportarParaExcel(): void {
    this.isLoadingResults = true;
    
    this.financaService.exportarParaExcel(this.selectedMonth, this.selectedYear).subscribe({
      next: (blob) => {
        // Criar URL para download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Gerar nome do arquivo
        const filename = `debitos_em_conta_${String(this.selectedMonth).padStart(2, '0')}_${this.selectedYear}.xlsx`;
        link.download = filename;
        
        // Fazer download
        link.click();
        
        // Limpar
        window.URL.revokeObjectURL(url);
        
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Excel exportado com sucesso.' });
        
        this.isLoadingResults = false;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao exportar para Excel.' });
        this.isLoadingResults = false;
      }
    });
  }

  private refreshContasFixasList() {
    this.isLoadingResults = true;
    const sort = `${this.sortField},${this.sortOrder}`;

    this.financaService.listarFinancas(
      this.pageIndex,
      this.pageSize,
      sort,
      this.selectedMonth,
      this.selectedYear
    ).pipe(
      catchError(() => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar despesas fixas.' });
        return observableOf(null);
      }),
      map((data: any) => {
        this.isLoadingResults = false;

        if (!data) {
          this.resultsLength = 0;
          return [];
        }

        if (Array.isArray(data)) {
          this.resultsLength = data.length;
          return data;
        }

        this.resultsLength = data.totalElements ?? 0;
        return data.content ?? [];
      }),
    )
    .subscribe(data => (this.contasFixas = data));
  }

  /**
   * Abre o diálogo para gerenciar comprovantes da conta fixa
   */
  abrirComprovantes(contaFixa: Financa): void {
    this.dialogService.open(ComprovantesDialogComponent, {
      header: 'Comprovantes',
      width: '600px',
      modal: true,
      data: {
        contaFixaId: contaFixa.id,
        contaFixaNome: contaFixa.nome
      }
    });
  }
  
  /**
   * Realiza o pagamento de uma conta fixa
   */
  pagarContaFixa(contaFixa: Financa): void {
    if (contaFixa.pago) {
      this.messageService.add({ severity: 'info', summary: 'Conta paga', detail: 'Esta conta já está paga.' });
      return;
    }
    
    this.confirmationService.confirm({
      message: `Deseja confirmar o pagamento de "${contaFixa.nome}" no valor de ${contaFixa.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}?`,
      header: 'Confirmar pagamento',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.isLoadingResults = true;

        this.financaService.pagarContaFixa(contaFixa.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Conta paga com sucesso.' });
            this.refreshContasFixasList();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: this.getErrorMessage(error, 'Erro ao realizar o pagamento') });
          },
          complete: () => {
            this.isLoadingResults = false;
          }
        });
      }
    });
  }
  
  /**
   * Recria uma despesa fixa para o próximo mês como não paga
   */
  recriarDespesaProximoMes(contaFixa: Financa): void {
    const proximoMes = this.months.find(m => m.value === (this.selectedMonth % 12) + 1)?.label || '';
    
    this.confirmationService.confirm({
      message: `Deseja recriar a despesa "${contaFixa.nome}" para ${proximoMes} como não paga?`,
      header: 'Lançar no próximo mês',
      icon: 'pi pi-refresh',
      acceptLabel: 'Lançar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.isLoadingResults = true;

        this.financaService.recriarDespesaProximoMes(contaFixa.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: `Despesa recriada com sucesso para ${proximoMes}.` });
            this.refreshContasFixasList();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: this.getErrorMessage(error, 'Erro ao recriar despesa') });
          },
          complete: () => {
            this.isLoadingResults = false;
          }
        });
      }
    });
  }

  getStatusSeverity(contaFixa: Financa): 'success' | 'warn' {
    return contaFixa.pago ? 'success' : 'warn';
  }

  getMenuItems(contaFixa: Financa): any[] {
    return [
      {
        label: 'Comprovantes',
        icon: 'pi pi-paperclip',
        command: () => this.abrirComprovantes(contaFixa)
      },
      {
        label: 'Lançar no próximo mês',
        icon: 'pi pi-refresh',
        command: () => this.recriarDespesaProximoMes(contaFixa)
      },
      {
        separator: true
      },
      {
        label: 'Excluir despesa',
        icon: 'pi pi-trash',
        command: () => this.excluirDespesa(contaFixa)
      }
    ];
  }

  private getErrorMessage(error: any, fallback: string): string {
    if (error?.error && typeof error.error === 'string') {
      return error.error;
    }

    if (error?.error?.message) {
      return error.error.message;
    }

    return error?.message || fallback;
  }
}
