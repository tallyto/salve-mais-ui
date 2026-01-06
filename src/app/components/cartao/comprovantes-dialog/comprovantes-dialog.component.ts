import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { Anexo, UrlDownload } from '../../../models/anexo.model';
import { AnexoService } from '../../../services/anexo.service';

@Component({
    selector: 'app-comprovantes-dialog',
    templateUrl: './comprovantes-dialog.component.html',
    styleUrls: ['./comprovantes-dialog.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatSnackBarModule,
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
        MatListModule,
        MatDividerModule
    ]
})
export class ComprovantesDialogComponent {
  anexos: Anexo[] = [];
  selectedFiles?: FileList;
  isUploading = false;

  constructor(
    public dialogRef: MatDialogRef<ComprovantesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { contaFixaId: number, contaFixaNome: string },
    private anexoService: AnexoService,
    private snackBar: MatSnackBar
  ) {
    this.carregarAnexos();
  }

  carregarAnexos(): void {
    this.anexoService.listarComprovantes(this.data.contaFixaId).subscribe({
      next: (anexos) => {
        this.anexos = anexos;
      },
      error: (err) => {
        console.error('Erro ao carregar anexos:', err);
        this.snackBar.open('Erro ao carregar comprovantes', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }
    });
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      this.snackBar.open('Selecione um arquivo para upload', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return;
    }

    this.isUploading = true;
    const file = this.selectedFiles[0];

    this.anexoService.uploadComprovante(this.data.contaFixaId, file).subscribe({
      next: (anexo) => {
        this.isUploading = false;
        this.snackBar.open('Comprovante enviado com sucesso', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
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
        console.error('Erro ao fazer upload:', err);
        this.snackBar.open('Erro ao fazer upload do comprovante', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
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
      this.anexoService.removerComprovante(this.data.contaFixaId, anexo.id).subscribe({
        next: () => {
          this.snackBar.open('Comprovante removido com sucesso', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          this.carregarAnexos();
        },
        error: (err) => {
          console.error('Erro ao remover anexo:', err);
          this.snackBar.open('Erro ao remover comprovante', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
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
}
