import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CategoriaService } from '@services/categoria.service';
import { Categoria, TipoCategoria } from '@models/categoria.model';

interface TipoOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-categoria-form',
  templateUrl: './categoria-form.component.html',
  standalone: false
})
export class CategoriaFormComponent implements OnInit {
  @Input() editingCategoria: Categoria | null = null;
  @Input() isDialogMode: boolean = false;
  @Output() categoriaCreated = new EventEmitter<Categoria>();
  @Output() categoriaUpdated = new EventEmitter<Categoria>();
  @Output() formCancelled = new EventEmitter<void>();

  public categoriaForm: FormGroup;
  public tipoOptions: TipoOption[] = [
    { label: 'Necessidade (50%)', value: 'NECESSIDADE' },
    { label: 'Desejo (30%)', value: 'DESEJO' },
    { label: 'Economia (20%)', value: 'ECONOMIA' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private categoriaService: CategoriaService,
    private messageService: MessageService
  ) {
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
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });
        this.limparFormulario();

        // Emite evento para o componente pai
        if (isEditing) {
          this.categoriaUpdated.emit(value);
        } else {
          this.categoriaCreated.emit(value);
        }

        // Se estiver em modo dialog, fecha o dialog retornando a categoria criada
        if (this.isDialogMode) {
          this.fecharDialog();
        }
      },
      error: (errorMessage: string) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: errorMessage });
      }
    });
  }

  cancelarEdicao(): void {
    this.limparFormulario();
    this.formCancelled.emit();
  }

  fecharDialog(): void {
    // Dialog é fechado via p-dialog
  }

  private limparFormulario(): void {
    this.categoriaForm.reset({
      id: null,
      nome: '',
      tipo: TipoCategoria.NECESSIDADE
    });
  }
}