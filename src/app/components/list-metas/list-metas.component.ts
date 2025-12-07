import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Meta, StatusMeta } from '../../models/meta.model';
import { MetaService } from '../../services/meta.service';
import { MetaFormComponent } from '../meta-form/meta-form.component';
import { MetaProgressoComponent } from '../meta-progresso/meta-progresso.component';

@Component({
  selector: 'app-list-metas',
  templateUrl: './list-metas.component.html',
  styleUrls: ['./list-metas.component.css'],
  standalone: false
})
export class ListMetasComponent implements OnInit {
  displayedColumns: string[] = ['nome', 'valorAlvo', 'valorAtual', 'progresso', 'dataAlvo', 'status', 'acoes'];
  dataSource: MatTableDataSource<Meta>;
  statusFilter: string = 'TODAS';
  statusMeta = StatusMeta;
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private metaService: MetaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Meta>([]);
  }

  ngOnInit(): void {
    this.carregarMetas();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  carregarMetas(): void {
    this.isLoading = true;
    const request = this.statusFilter === 'TODAS' 
      ? this.metaService.listarTodas()
      : this.metaService.listarPorStatus(this.statusFilter);

    request.subscribe({
      next: (metas) => {
        this.dataSource.data = metas;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar metas:', error);
        this.snackBar.open('Erro ao carregar metas', 'Fechar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  abrirFormulario(meta?: Meta): void {
    const dialogRef = this.dialog.open(MetaFormComponent, {
      width: '600px',
      data: meta ? { ...meta } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.carregarMetas();
      }
    });
  }

  atualizarProgresso(meta: Meta): void {
    const dialogRef = this.dialog.open(MetaProgressoComponent, {
      width: '400px',
      data: meta
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.carregarMetas();
      }
    });
  }

  excluir(meta: Meta): void {
    if (confirm(`Deseja realmente excluir a meta "${meta.nome}"?`)) {
      this.metaService.deletar(meta.id!).subscribe({
        next: () => {
          this.snackBar.open('Meta excluída com sucesso', 'Fechar', { duration: 3000 });
          this.carregarMetas();
        },
        error: (error) => {
          console.error('Erro ao excluir meta:', error);
          this.snackBar.open('Erro ao excluir meta', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  getStatusClass(status: StatusMeta): string {
    switch (status) {
      case StatusMeta.CONCLUIDA: return 'status-concluida';
      case StatusMeta.EM_ANDAMENTO: return 'status-andamento';
      case StatusMeta.PAUSADA: return 'status-pausada';
      case StatusMeta.CANCELADA: return 'status-cancelada';
      default: return '';
    }
  }

  getProgressColor(percentual: number): string {
    if (percentual >= 100) return 'accent';
    if (percentual >= 75) return 'primary';
    if (percentual >= 50) return 'primary';
    return 'warn';
  }

  filtrarPorStatus(): void {
    this.carregarMetas();
  }
}
