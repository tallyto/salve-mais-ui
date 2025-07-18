import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Financa } from "../../models/financa.model";
import { ContasFixasService } from "../../services/financa.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { catchError, map, merge, of as observableOf, startWith, switchMap } from "rxjs";
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface MonthOption {
  value: number;
  label: string;
}

@Component({
  selector: 'app-list-contas-fixas',
  templateUrl: './list-contas-fixas.component.html',
  styleUrls: ['./list-contas-fixas.component.css']
})
export class ListContasFixasComponent implements AfterViewInit {
  displayedColumnsContasFixas: string[] = ['nome', 'categoria', 'conta', 'vencimento', 'valor', 'pago', 'acoes'];
  contasFixas: Financa[] = [];
  editingDespesa: Financa | null = null;
  despesaForm: FormGroup;

  resultsLength = 0;
  isLoadingResults = true;

  // Filtros de mês e ano
  selectedMonth: number;
  selectedYear: number;
  months: MonthOption[] = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];
  years: number[] = [];

  // @ts-expect-error
  @ViewChild(MatPaginator) paginator: MatPaginator
  // @ts-expect-error
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private financaService: ContasFixasService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {
    this.despesaForm = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      categoriaId: ['', Validators.required],
      contaId: ['', Validators.required],
      vencimento: ['', Validators.required],
      valor: [0, [Validators.required, Validators.min(0)]],
      pago: [false]
    });

    this.financaService.savedFinanca.subscribe(
      {
        next: () => {
          this.refreshContasFixasList()
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

  ngAfterViewInit(): void {
    this.refreshContasFixasList()
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
    this.financaService.editingFinanca.emit(despesa);
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
          this.snackBar.open('Despesa atualizada com sucesso!', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          this.editingDespesa = null;
          this.refreshContasFixasList();
        },
        error: (error) => {
          console.error('Erro ao atualizar despesa:', error);
          this.snackBar.open('Erro ao atualizar despesa', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        }
      });
    }
  }

  excluirDespesa(despesa: Financa): void {
    if (confirm(`Deseja realmente excluir a despesa "${despesa.nome}"?`)) {
      this.financaService.excluirFinanca(despesa.id).subscribe({
        next: () => {
          this.snackBar.open('Despesa excluída com sucesso!', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          this.refreshContasFixasList();
        },
        error: (error: any) => {
          console.error('Erro ao excluir despesa:', error);
          this.snackBar.open('Erro ao excluir despesa', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        }
      });
    }
  }

  isEditing(despesa: Financa): boolean {
    return this.editingDespesa !== null && this.editingDespesa.id === despesa.id;
  }

  onFilterChange(): void {
    this.paginator.pageIndex = 0; // Reset para primeira página
    this.refreshContasFixasList();
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

  private generateYears(): void {
    const currentYear = new Date().getFullYear();
    this.years = [];

    // Gerar anos dos últimos 3 anos até os próximos 2 anos
    for (let year = currentYear - 3; year <= currentYear + 2; year++) {
      this.years.push(year);
    }
  }

  private refreshContasFixasList() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          const sort = `${this.sort.active},${this.sort.direction}`
          return this.financaService.listarFinancas(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            sort,
            this.selectedMonth,
            this.selectedYear
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
      .subscribe(data => (this.contasFixas = data));
  }
}
