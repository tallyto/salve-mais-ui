import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '@services/usuario.service';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { senhasIguaisValidator, markFormGroupTouched } from '@shared/utils';
import { SALVE_COMMON, SALVE_FORMS } from '@shared/primeng-shared';

@Component({
  selector: 'app-novo-usuario-dialog',
  standalone: true,
  imports: [
    ...SALVE_COMMON,
    ...SALVE_FORMS
  ],
  templateUrl: './novo-usuario-dialog.component.html'
})
export class NovoUsuarioDialogComponent {
  usuarioForm: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private dialogRef: DynamicDialogRef
  ) {
    this.usuarioForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]]
    }, { validators: senhasIguaisValidator });
  }

  onSubmit() {
    if (this.usuarioForm.invalid) {
      markFormGroupTouched(this.usuarioForm);
      return;
    }

    this.loading = true;
    const { nome, email, senha } = this.usuarioForm.value;

    this.usuarioService.criarUsuario({ nome, email, senha }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário criado com sucesso!' });
        this.dialogRef.close(true);
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Erro ao criar usuário';
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: errorMessage });
        this.loading = false;
      }
    });
  }

  fechar() {
    this.dialogRef.close(false);
  }
}
