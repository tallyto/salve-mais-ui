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
import { TenantService } from '../../services/tenant.service';

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
    const emailDomain = email.split('@')[1] || '';

    // Verificar se o email contém um domínio
    if (emailDomain) {
      // Verificar se o domínio é público
      const publicDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com'];
      const isPublicDomain = publicDomains.some(domain => emailDomain.toLowerCase().includes(domain));
      this.showDomainField = isPublicDomain;

      // Se não for um domínio público, usamos o domínio do email como tenant
      if (!isPublicDomain) {
        this.loginForm.patchValue({ dominio: emailDomain });
        // Priorizar sempre o domínio do email corporativo sobre o tenant salvo
        this.tenantService.setTenant(emailDomain);
      } else {
        // Se for domínio público, verificamos se já existe um tenant salvo
        const savedTenant = this.tenantService.getTenant();
        if (savedTenant && !this.loginForm.get('dominio')?.value) {
          // Usar o tenant salvo como valor padrão, mas permitir que o usuário altere
          this.loginForm.patchValue({ dominio: savedTenant });
          this.showDomainField = true; // Sempre mostrar para domínios públicos
        } else {
          // Limpar o campo de domínio e torná-lo obrigatório se for um domínio público
          if (!this.loginForm.get('dominio')?.value) {
            this.loginForm.patchValue({ dominio: '' });
          }
          this.loginForm.get('dominio')?.setValidators([Validators.required]);
        }
      }
    } else {
      // Se não houver domínio no email, verificar se existe um tenant salvo
      const savedTenant = this.tenantService.getTenant();
      if (savedTenant) {
        this.loginForm.patchValue({ dominio: savedTenant });
        this.showDomainField = true; // Permitir alteração mesmo com tenant salvo
      } else {
        // Se não houver tenant salvo, mostrar o campo de domínio
        this.showDomainField = true;
        this.loginForm.get('dominio')?.setValidators([Validators.required]);
      }
    }

    this.loginForm.get('dominio')?.updateValueAndValidity();
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
    const emailDomain = email.split('@')[1] || '';
    
    // Verificar se o email tem um domínio corporativo (não público)
    const publicDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com'];
    const isPublicDomain = emailDomain ? publicDomains.some(domain => emailDomain.toLowerCase().includes(domain)) : true;
    
    // Determinar qual tenant usar
    let tenant: string;
    
    if (!isPublicDomain && emailDomain) {
      // Se for um email corporativo, sempre usar o domínio do email como tenant
      tenant = emailDomain;
    } else {
      // Se for email público, usar o domínio fornecido pelo usuário
      tenant = dominio || '';
    }

    // Se ainda não temos um tenant, verificar se existe um salvo no localStorage
    if (!tenant) {
      tenant = this.tenantService.getTenant() || '';
    }

    // Se não temos um tenant, mostrar erro
    if (!tenant) {
      this.snackBar.open('É necessário informar um domínio válido.', 'Fechar', {
        duration: 3000,
        panelClass: 'snackbar-error',
        verticalPosition: 'top'
      });
      return;
    }

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

          // Salvar o tenant para uso futuro
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
