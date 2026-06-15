import { isTokenExpired } from '@utils/jwt.util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { SALVE_COMMON, SALVE_FORMS } from '@shared/primeng-shared';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ...SALVE_COMMON,
    ...SALVE_FORMS
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading = false;
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
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
        this.messageService.add({severity:'warn', summary:'Sessão Expirada', detail:'Por favor, faça login novamente.'});
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
      this.messageService.add({severity:'error', summary:'Erro', detail:'Preencha todos os campos corretamente.'});
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

          this.messageService.add({severity:'success', summary:'Sucesso', detail:'Login realizado com sucesso!'});
          this.errorMessage = '';
          this.router.navigate(['/dashboard']);
        } else {
          this.messageService.add({severity:'error', summary:'Erro', detail:'Resposta inválida do servidor.'});
        }
      },
      error: (err) => {
        this.messageService.add({severity:'error', summary:'Erro', detail:err.error?.message || 'Usuário ou senha inválidos.'});
      }
    });
  }
}
