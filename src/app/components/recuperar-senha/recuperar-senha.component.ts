import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './recuperar-senha.component.html',
  styleUrl: './recuperar-senha.component.css'
})
export class RecuperarSenhaComponent {
  recuperarForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private snackBar: MatSnackBar) {
    this.recuperarForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.recuperarForm.invalid) {
      this.snackBar.open('Preencha o e-mail corretamente.', 'Fechar', { duration: 3000, verticalPosition: 'top', panelClass: 'snackbar-error' });
      return;
    }
    this.authService.recuperarSenha(this.recuperarForm.value).subscribe({
      next: () => {
        this.snackBar.open('Se o e-mail existir, as instruções foram enviadas.', 'Fechar', { duration: 4000, verticalPosition: 'top', panelClass: 'snackbar-success' });
      },
      error: () => {
        this.snackBar.open('Erro ao solicitar recuperação de senha.', 'Fechar', { duration: 4000, verticalPosition: 'top', panelClass: 'snackbar-error' });
      }
    });
  }
}
