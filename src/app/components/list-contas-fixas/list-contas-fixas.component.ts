import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Financa } from "../../models/financa.model";
import { ContasFixasService } from "../../services/financa.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { catchError, map, merge, of as observableOf, startWith, switchMap } from "rxjs";
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    )
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
