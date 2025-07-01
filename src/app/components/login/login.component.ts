import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.snackBar.open('Preencha todos os campos corretamente.', 'Fechar', {
        duration: 3000,
        panelClass: 'snackbar-error',
        verticalPosition: 'top'
      });
      return;
    }
    const { email, senha } = this.loginForm.value;
    this.authService.login({ email, senha }).subscribe({
      next: (res) => {
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          this.snackBar.open('Login realizado com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: 'snackbar-success',
            verticalPosition: 'top'
          });
          this.errorMessage = '';
          this.router.navigate(['/dashboard']);
        } else {
          this.snackBar.open('Resposta inválida do servidor.', 'Fechar', {
            duration: 3000,
            panelClass: 'snackbar-error',
            verticalPosition: 'top'
          });
        }
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Usuário ou senha inválidos.', 'Fechar', {
          duration: 3000,
          panelClass: 'snackbar-error',
          verticalPosition: 'top'
        });
      }
    });
  }
}
