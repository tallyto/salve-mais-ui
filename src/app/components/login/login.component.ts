import { isTokenExpired } from '../../utils/jwt.util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';

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
    MatSnackBarModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  hidePassword: boolean = true;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      lembrarMe: [false]
    });

    // Recuperar credenciais salvas se existirem
    this.restoreCredentials();
  }

  ngOnInit(): void {
    // Se já existe token válido, redireciona para o dashboard
    const token = localStorage.getItem('token');
    if (token && !isTokenExpired(token)) {
      this.router.navigate(['/dashboard']);
    } else if (token && isTokenExpired(token)) {
      localStorage.removeItem('token');
    }

    // Verificar se o usuário foi redirecionado por erro de autenticação
    this.route.queryParams.subscribe(params => {
      if (params['sessionExpired'] === 'true') {
        this.snackBar.open('Sua sessão expirou. Por favor, faça login novamente.', 'Fechar', {
          duration: 5000,
          verticalPosition: 'top',
          panelClass: 'snackbar-warning'
        });
      }
    });
  }

  restoreCredentials() {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      this.loginForm.patchValue({
        email: savedEmail,
        lembrarMe: true
      });
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onEmailBlur() {
    // Simplificado: o backend já sabe qual tenant o usuário pertence
    // O JWT retornado conterá o tenantDomain automaticamente
  }

  onAlterarDominioChange() {
    // Simplificado: campo de domínio não é mais necessário
    // O backend determina o tenant automaticamente via usuario_global
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

    const formValues = this.loginForm.getRawValue();
    const { email, senha, lembrarMe } = formValues;

    // Gerenciar credenciais lembradas
    if (lembrarMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    this.loading = true;
    this.authService.login({ email, senha }).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
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
