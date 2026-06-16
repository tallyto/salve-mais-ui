import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Anexo, UrlDownload } from '@models/anexo.model';
import { AnexoService } from '@services/anexo.service';
import { SALVE_COMMON, SALVE_DATA, SALVE_OVERLAY } from '@shared/primeng-shared';

@Component({
    selector: 'app-comprovantes-dialog',
    templateUrl: './comprovantes-dialog.component.html',
    standalone: true,
    imports: [
        ...SALVE_COMMON,
        ...SALVE_DATA,
        ...SALVE_OVERLAY
    ]
})
export class ComprovantesDialogComponent {
  anexos: Anexo[] = [];
  selectedFiles?: FileList;
  isUploading = false;

  constructor(
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private anexoService: AnexoService,
    private messageService: MessageService
  ) {
    this.data = config.data;
    this.carregarAnexos();
  }

  get data(): { contaFixaId: number, contaFixaNome: string } {
    return this._data;
  }

  set data(value: { contaFixaId: number, contaFixaNome: string }) {
    this._data = value;
  }

  private _data: { contaFixaId: number, contaFixaNome: string } = { contaFixaId: 0, contaFixaNome: '' };

  carregarAnexos(): void {
    this.anexoService.listarComprovantes(this.data.contaFixaId).subscribe({
      next: (anexos) => {
        this.anexos = anexos;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar comprovantes', life: 3000 });
      }
    });
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: 'Selecione um arquivo para upload', life: 3000 });
      return;
    }

    this.isUploading = true;
    const file = this.selectedFiles[0];

    this.anexoService.uploadComprovante(this.data.contaFixaId, file).subscribe({
      next: (anexo) => {
        this.isUploading = false;
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Comprovante enviado com sucesso', life: 3000 });
        this.carregarAnexos();
        // Limpar seleção de arquivo
        this.selectedFiles = undefined;
        // Limpar o input de arquivo
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      },
      error: (err) => {
        this.isUploading = false;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao fazer upload do comprovante', life: 3000 });
      }
    });
  }

  downloadAnexo(anexo: Anexo): void {
    this.anexoService.obterUrlDownload(this.data.contaFixaId, anexo.id).subscribe({
      next: (urlDownload: UrlDownload) => {
        // Abrir URL em nova aba do navegador
        window.open(urlDownload.url, '_blank');
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao gerar link para download', life: 3000 });
      }
    });
  }

  removerAnexo(anexo: Anexo): void {
    if (confirm(`Tem certeza que deseja remover o comprovante "${anexo.nome}"?`)) {
      this.anexoService.removerComprovante(this.data.contaFixaId, anexo.id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Comprovante removido com sucesso', life: 3000 });
          this.carregarAnexos();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao remover comprovante', life: 3000 });
        }
      });
    }
  }

  fechar(): void {
    this.dialogRef.close();
  }

  formatarData(dataString: string): string {
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
