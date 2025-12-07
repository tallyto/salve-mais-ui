import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Meta } from '../../models/meta.model';
import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-meta-progresso',
  templateUrl: './meta-progresso.component.html',
  styleUrls: ['./meta-progresso.component.css'],
  standalone: false
})
export class MetaProgressoComponent {
  progressoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private metaService: MetaService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<MetaProgressoComponent>,
    @Inject(MAT_DIALOG_DATA) public meta: Meta
  ) {
    this.progressoForm = this.fb.group({
      valor: [0, [Validators.required, Validators.min(0.01)]],
      descricao: ['']
    });
  }

  get valorRestante(): number {
    return this.meta.valorAlvo - this.meta.valorAtual;
  }

  get novoValor(): number {
    const adicionar = this.progressoForm.get('valor')?.value || 0;
    return this.meta.valorAtual + adicionar;
  }

  get novoPercentual(): number {
    return (this.novoValor / this.meta.valorAlvo) * 100;
  }

  salvar(): void {
    if (this.progressoForm.valid) {
      this.metaService.atualizarProgresso(this.meta.id!, this.progressoForm.value).subscribe({
        next: () => {
          this.snackBar.open('Progresso atualizado com sucesso', 'Fechar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Erro ao atualizar progresso:', error);
          this.snackBar.open('Erro ao atualizar progresso', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
