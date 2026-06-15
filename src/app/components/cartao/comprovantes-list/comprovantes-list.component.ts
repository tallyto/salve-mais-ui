import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Anexo, UrlDownload } from '@models/anexo.model';
import { AnexoService } from '@services/anexo.service';
import { SALVE_COMMON, SALVE_FORMS, SALVE_DATA } from '@shared/primeng-shared';

@Component({
  selector: 'app-comprovantes-list',
  templateUrl: './comprovantes-list.component.html',
  standalone: true,
  imports: [
    ...SALVE_COMMON,
    ...SALVE_FORMS,
    ...SALVE_DATA
  ]
})
export class ComprovantesListComponent implements OnInit {
  anexos: Anexo[] = [];
  isLoading = true;
  searchTerm = '';
  filteredAnexos: Anexo[] = [];
  skeletonItems = Array.from({ length: 4 });

  constructor(
    private anexoService: AnexoService,
    private messageService: MessageService
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
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar comprovantes', life: 3000 });
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
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao gerar link para download', life: 3000 });
      }
    });
  }

  removerAnexo(anexo: Anexo): void {
    if (confirm(`Tem certeza que deseja remover o comprovante "${anexo.nome}"?`)) {
      this.anexoService.removerComprovanteGlobal(anexo.id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Comprovante removido com sucesso', life: 3000 });
          this.carregarComprovantes();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao remover comprovante', life: 3000 });
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

  getFileIconClass(tipo: string): string {
    if (!tipo) return 'pi-file';

    if (tipo.includes('pdf')) {
      return 'pi-file-pdf';
    } else if (tipo.includes('image')) {
      return 'pi-image';
    } else if (tipo.includes('excel') || tipo.includes('spreadsheet')) {
      return 'pi-table';
    } else if (tipo.includes('word') || tipo.includes('document')) {
      return 'pi-file-word';
    }
    return 'pi-file';
  }
}
