import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlanoCompra, StatusPlano, TipoCompra } from '../../models/plano-compra.model';
import { PlanoCompraService } from '../../services/plano-compra.service';
import { PlanoCompraFormComponent } from '../plano-compra-form/plano-compra-form.component';

@Component({
  selector: 'app-list-planos-compra',
  templateUrl: './list-planos-compra.component.html',
  styleUrls: ['./list-planos-compra.component.css'],
  standalone: false
})
export class ListPlanosCompraComponent implements OnInit {
  displayedColumns: string[] = ['nome', 'valorTotal', 'valorEconomizado', 'progresso', 'tipoCompra', 'prioridade', 'status', 'acoes'];
  dataSource: MatTableDataSource<PlanoCompra>;
  statusFilter: string = 'TODOS';
  statusPlano = StatusPlano;
  tipoCompra = TipoCompra;
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private planoCompraService: PlanoCompraService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<PlanoCompra>([]);
  }

  ngOnInit(): void {
    this.carregarPlanos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  carregarPlanos(): void {
    this.isLoading = true;
    const request = this.statusFilter === 'TODOS' 
      ? this.planoCompraService.listarTodos()
      : this.planoCompraService.listarPorStatus(this.statusFilter);

    request.subscribe({
      next: (planos) => {
        this.dataSource.data = planos;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar planos:', error);
        this.snackBar.open('Erro ao carregar planos de compra', 'Fechar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  abrirFormulario(plano?: PlanoCompra): void {
    const dialogRef = this.dialog.open(PlanoCompraFormComponent, {
      width: '700px',
      data: plano ? { ...plano } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.carregarPlanos();
      }
    });
  }

  excluir(plano: PlanoCompra): void {
    if (confirm(`Deseja realmente excluir o plano "${plano.nome}"?`)) {
      this.planoCompraService.deletar(plano.id!).subscribe({
        next: () => {
          this.snackBar.open('Plano excluído com sucesso', 'Fechar', { duration: 3000 });
          this.carregarPlanos();
        },
        error: (error) => {
          console.error('Erro ao excluir plano:', error);
          this.snackBar.open('Erro ao excluir plano', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  getStatusClass(status: StatusPlano): string {
    switch (status) {
      case StatusPlano.CONCLUIDO: return 'status-concluido';
      case StatusPlano.EM_ANDAMENTO: return 'status-andamento';
      case StatusPlano.PLANEJADO: return 'status-planejado';
      case StatusPlano.CANCELADO: return 'status-cancelado';
      default: return '';
    }
  }

  getPrioridadeClass(prioridade: number): string {
    switch (prioridade) {
      case 1: return 'prioridade-alta';
      case 2: return 'prioridade-media';
      case 3: return 'prioridade-baixa';
      default: return '';
    }
  }

  getPrioridadeLabel(prioridade: number): string {
    switch (prioridade) {
      case 1: return 'Alta';
      case 2: return 'Média';
      case 3: return 'Baixa';
      default: return '';
    }
  }

  getProgressColor(percentual: number): string {
    if (percentual >= 100) return 'accent';
    if (percentual >= 75) return 'primary';
    if (percentual >= 50) return 'primary';
    return 'warn';
  }

  calcularPercentual(plano: PlanoCompra): number {
    if (plano.percentualEconomizado !== undefined && plano.percentualEconomizado !== null) {
      return plano.percentualEconomizado;
    }
    if (plano.valorTotal <= 0) return 0;
    return (plano.valorEconomizado / plano.valorTotal) * 100;
  }

  filtrarPorStatus(): void {
    this.carregarPlanos();
  }
}
