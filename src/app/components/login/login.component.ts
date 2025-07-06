import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TenantService } from 'src/app/services/tenant.service';

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
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  tenant: string = '';
  showDomainField: boolean = false;
  hidePassword: boolean = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private tenantService: TenantService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      dominio: [''],
      lembrarMe: [false]
    });

    // Recuperar credenciais salvas se existirem
    this.restoreCredentials();
  }

  restoreCredentials() {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      this.loginForm.patchValue({
        email: savedEmail,
        lembrarMe: true
      });
      this.onEmailBlur();
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onEmailBlur() {
    const email: string = this.loginForm.get('email')?.value || '';
    const domain = email.split('@')[1] || '';
    const publicDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'];
    this.showDomainField = publicDomains.includes(domain);
    if (!this.showDomainField) {
      this.loginForm.patchValue({ dominio: domain });
    } else {
      this.loginForm.patchValue({ dominio: '' });
    }
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

    const { email, senha, dominio, lembrarMe } = this.loginForm.value;
    const tenant = dominio || (email.split('@')[1] || '');

    // Salvar email se "lembrarMe" estiver marcado
    if (lembrarMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    this.authService.login({ email, senha }, tenant).subscribe({
      next: (res) => {
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          this.tenantService.setTenant(tenant);
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
