import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria, TipoCategoria } from '../../../models/categoria.model';

@Component({
  selector: 'app-categoria-form',
  templateUrl: './categoria-form.component.html',
  styleUrls: ['./categoria-form.component.css'],
  standalone: false
})
export class CategoriaFormComponent implements OnInit {
  @Input() editingCategoria: Categoria | null = null;
  @Input() isDialogMode: boolean = false;
  @Output() categoriaCreated = new EventEmitter<Categoria>();
  @Output() categoriaUpdated = new EventEmitter<Categoria>();
  @Output() formCancelled = new EventEmitter<void>();

  public categoriaForm: FormGroup;
  private horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  private verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private formBuilder: FormBuilder,
    private categoriaService: CategoriaService,
    private snackBar: MatSnackBar,
    @Optional() public dialogRef: MatDialogRef<CategoriaFormComponent>
  ) {
    this.isDialogMode = !!dialogRef;
    this.categoriaForm = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      tipo: [TipoCategoria.NECESSIDADE, Validators.required]
    });
  }

  ngOnInit() {
    if (this.editingCategoria) {
      this.categoriaForm.patchValue({
        id: this.editingCategoria.id,
        nome: this.editingCategoria.nome,
        tipo: this.editingCategoria.tipo || TipoCategoria.NECESSIDADE
      });
    }
  }

  salvarCategoria() {
    if (this.categoriaForm.invalid) {
      return;
    }

    const categoria = this.categoriaForm.value;
    const isEditing = !!categoria.id;

    this.categoriaService.salvarCategoria(categoria).subscribe({
      next: (value: Categoria) => {
        const message = isEditing ? 'Categoria atualizada com sucesso!' : 'Categoria salva com sucesso!';
        this.openSnackBar(message);
        this.limparFormulario();

        // Emite evento para o componente pai
        if (isEditing) {
          this.categoriaUpdated.emit(value);
        } else {
          this.categoriaCreated.emit(value);
        }

        // Se estiver em modo dialog, fecha o dialog retornando a categoria criada
        if (this.isDialogMode && this.dialogRef) {
          this.dialogRef.close(value);
        }
      },
      error: (errorMessage: string) => {
        this.openSnackBar(errorMessage);
      }
    });
  }

  cancelarEdicao(): void {
    this.limparFormulario();
    this.formCancelled.emit();
  }

  fecharDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  private limparFormulario(): void {
    this.categoriaForm.reset({
      id: null,
      nome: '',
      tipo: TipoCategoria.NECESSIDADE
    });
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 3000
    });
  }
}