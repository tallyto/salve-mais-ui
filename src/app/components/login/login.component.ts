import { isTokenExpired } from '../../utils/jwt.util';
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
  alterarDominioManualmente: boolean = false;
  dominioDetectado: string = '';

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
      lembrarMe: [false],
      alterarDominio: [false] // Checkbox para permitir alteração manual do domínio
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

      // Se não for um domínio público, usamos o domínio do email como tenant
      if (!isPublicDomain) {
        this.dominioDetectado = emailDomain;
        this.loginForm.patchValue({ dominio: emailDomain });
        // NÃO salvar no sessionStorage aqui - apenas detectar
        this.showDomainField = false; // Não mostrar por padrão
      } else {
        // Se for domínio público, verificamos se já existe um tenant lembrado
        const rememberedTenant = this.tenantService.getRememberedTenant();
        if (rememberedTenant && !this.loginForm.get('dominio')?.value) {
          this.dominioDetectado = rememberedTenant;
          this.loginForm.patchValue({ dominio: rememberedTenant });
        }
        this.showDomainField = true; // Sempre mostrar para domínios públicos
        this.loginForm.get('dominio')?.setValidators([Validators.required]);
      }
    } else {
      // Se não houver domínio no email, verificar se existe um tenant lembrado
      const rememberedTenant = this.tenantService.getRememberedTenant();
      if (rememberedTenant) {
        this.dominioDetectado = rememberedTenant;
        this.loginForm.patchValue({ dominio: rememberedTenant });
      }
      this.showDomainField = true;
      this.loginForm.get('dominio')?.setValidators([Validators.required]);
    }

    this.loginForm.get('dominio')?.updateValueAndValidity();
  }

  onAlterarDominioChange() {
    this.alterarDominioManualmente = this.loginForm.get('alterarDominio')?.value || false;
    
    if (this.alterarDominioManualmente) {
      // Permitir edição manual
      this.showDomainField = true;
      this.loginForm.get('dominio')?.enable(); // IMPORTANTE: Habilitar o campo
      this.loginForm.get('dominio')?.setValidators([Validators.required]);
      // Usar o domínio detectado como valor inicial para edição
      if (this.dominioDetectado) {
        this.loginForm.patchValue({ dominio: this.dominioDetectado });
      }
    } else {
      // Voltar ao domínio detectado
      const email: string = this.loginForm.get('email')?.value || '';
      const emailDomain = email.split('@')[1] || '';
      const publicDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com'];
      const isPublicDomain = publicDomains.some(domain => emailDomain.toLowerCase().includes(domain));
      
      if (!isPublicDomain && emailDomain) {
        this.showDomainField = false;
        // Garantir que o domínio detectado está no formulário
        this.loginForm.patchValue({ dominio: this.dominioDetectado || emailDomain });
        this.loginForm.get('dominio')?.clearValidators();
        // NÃO desabilitar o campo - apenas ocultar visualmente
        this.loginForm.get('dominio')?.enable();
      } else {
        this.showDomainField = true;
        this.loginForm.get('dominio')?.setValidators([Validators.required]);
        this.loginForm.get('dominio')?.enable();
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

    // Usar getRawValue() para pegar valores mesmo de campos desabilitados
    const formValues = this.loginForm.getRawValue();
    const { email, senha, dominio, lembrarMe, alterarDominio } = formValues;
    const emailDomain = email.split('@')[1] || '';

    // Verificar se o email tem um domínio corporativo (não público)
    const publicDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com'];
    const isPublicDomain = emailDomain ? publicDomains.some(domain => emailDomain.toLowerCase().includes(domain)) : true;

    // Determinar qual tenant usar
    let tenant: string;

    // Se o usuário marcou "Alterar domínio", sempre usar o valor do campo domínio
    if (alterarDominio) {
      tenant = dominio || '';
    } else if (!isPublicDomain && emailDomain) {
      // Se for um email corporativo e não marcou alterar, usar o domínio do email como tenant
      tenant = emailDomain;
    } else {
      // Se for email público, usar o domínio fornecido pelo usuário
      tenant = dominio || '';
    }

    // Se ainda não temos um tenant, verificar se existe um tenant lembrado
    if (!tenant) {
      tenant = this.tenantService.getRememberedTenant() || '';
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

    // Gerenciar credenciais lembradas
    if (lembrarMe) {
      localStorage.setItem('rememberedEmail', email);
      // Se "lembrar-me" estiver marcado, salvar o tenant para uso posterior
      this.tenantService.rememberTenant(tenant);
    } else {
      localStorage.removeItem('rememberedEmail');
      // Não limpar o tenant lembrado aqui, pois pode ser usado por outros usuários
    }

    this.authService.login({ email, senha }, tenant).subscribe({
      next: (res) => {
        if (res && res.token) {
          localStorage.setItem('token', res.token);

          // Definir o tenant atual na sessão
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
