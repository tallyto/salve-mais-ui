import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Anexo, UrlDownload } from '../../models/anexo.model';
import { AnexoService } from '../../services/anexo.service';

@Component({
  selector: 'app-comprovantes-list',
  templateUrl: './comprovantes-list.component.html',
  styleUrls: ['./comprovantes-list.component.css'],
  standalone: false
})
export class ComprovantesListComponent implements OnInit {
  anexos: Anexo[] = [];
  isLoading = true;
  searchTerm = '';
  filteredAnexos: Anexo[] = [];

  constructor(
    private anexoService: AnexoService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.carregarComprovantes();
  }

  carregarComprovantes(): void {
    this.isLoading = true;
    this.anexoService.listarTodosComprovantes().subscribe({
      next: (anexos) => {
        this.anexos = anexos;
        this.filteredAnexos = [...anexos];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar comprovantes:', err);
        this.snackBar.open('Erro ao carregar comprovantes', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        this.isLoading = false;
      }
    });
  }

  downloadAnexo(anexo: Anexo): void {
    this.anexoService.obterUrlDownloadGlobal(anexo.id).subscribe({
      next: (urlDownload: UrlDownload) => {
        window.open(urlDownload.url, '_blank');
      },
      error: (err) => {
        console.error('Erro ao obter URL de download:', err);
        this.snackBar.open('Erro ao gerar link para download', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }
    });
  }

  removerAnexo(anexo: Anexo): void {
    if (confirm(`Tem certeza que deseja remover o comprovante "${anexo.nome}"?`)) {
      this.anexoService.removerComprovanteGlobal(anexo.id).subscribe({
        next: () => {
          this.snackBar.open('Comprovante removido com sucesso', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          this.carregarComprovantes();
        },
        error: (err) => {
          console.error('Erro ao remover comprovante:', err);
          this.snackBar.open('Erro ao remover comprovante', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        }
      });
    }
  }

  formatarData(dataString: string): string {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getFileIcon(tipo: string): string {
    if (!tipo) return 'insert_drive_file';

    if (tipo.includes('pdf')) {
      return 'picture_as_pdf';
    } else if (tipo.includes('image')) {
      return 'image';
    } else if (tipo.includes('excel') || tipo.includes('spreadsheet')) {
      return 'table_chart';
    } else if (tipo.includes('word') || tipo.includes('document')) {
      return 'description';
    }
    return 'insert_drive_file';
  }

  aplicarFiltro(): void {
    if (!this.searchTerm.trim()) {
      this.filteredAnexos = [...this.anexos];
      return;
    }

    const searchTermLower = this.searchTerm.trim().toLowerCase();
    this.filteredAnexos = this.anexos.filter(anexo =>
      anexo.nome.toLowerCase().includes(searchTermLower)
    );
  }

  limparFiltro(): void {
    this.searchTerm = '';
    this.filteredAnexos = [...this.anexos];
  }
}
