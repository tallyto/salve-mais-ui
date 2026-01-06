import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-novo-usuario-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './novo-usuario-dialog.component.html',
  styleUrls: ['./novo-usuario-dialog.component.css']
})
export class NovoUsuarioDialogComponent {
  usuarioForm: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<NovoUsuarioDialogComponent>
  ) {
    this.usuarioForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]]
    }, { validators: this.senhasIguaisValidator });
  }

  senhasIguaisValidator(group: FormGroup) {
    const senha = group.get('senha')?.value;
    const confirmarSenha = group.get('confirmarSenha')?.value;
    return senha === confirmarSenha ? null : { senhasDiferentes: true };
  }

  onSubmit() {
    if (this.usuarioForm.invalid) {
      this.markFormGroupTouched(this.usuarioForm);
      return;
    }

    this.loading = true;
    const { nome, email, senha } = this.usuarioForm.value;

    this.usuarioService.criarUsuario({ nome, email, senha }).subscribe({
      next: () => {
        this.snackBar.open('Usuário criado com sucesso!', 'Fechar', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Erro ao criar usuário';
        this.snackBar.open(errorMessage, 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  fechar() {
    this.dialogRef.close(false);
  }
}
