import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { TenantService } from '../../services/tenant.service';
import { Observable, map, of, debounceTime, switchMap, finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  loading = false;
  mode: 'register' | 'confirm' = 'register';
  token: string | null = null;
  confirmacaoSucesso = false;

  // Lista de domínios de provedores de email comuns
  private emailProviders = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com',
    'protonmail.com', 'zoho.com', 'yandex.com', 'mail.com', 'live.com', 'msn.com'
  ];

  constructor(
    private fb: FormBuilder,
    private tenantService: TenantService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      domain: ['', [
        Validators.required,
        // Padrão para domínio válido: letra/número + podem conter hífen + pelo menos um ponto + TLD válido
        Validators.pattern(/^[a-z0-9]([a-z0-9-]+)?(\.[a-z0-9]([a-z0-9-]+)?)+\.[a-z]{2,}$/),
        Validators.minLength(4),
        Validators.maxLength(50),
        this.dominioPublicoValidator()
      ], [this.dominioDisponivel()]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (this.token) {
        this.mode = 'confirm';
        this.verificarToken();
      }
    });
  }

  dominioDisponivel(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const dominio = control.value;
      if (!dominio || dominio.length < 3) {
        return of(null);
      }

      return of(dominio).pipe(
        debounceTime(500),
        switchMap(value =>
          this.tenantService.verificarDominioDisponivel(value).pipe(
            map(disponivel => disponivel ? null : { dominioIndisponivel: true })
          )
        )
      );
    };
  }

  verificarToken() {
    if (!this.token) return;

    this.loading = true;
    this.tenantService.verificarTenant(this.token).subscribe({
      next: () => {
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Token inválido ou expirado. Por favor, solicite um novo link de confirmação.';
        this.loading = false;
      }
    });
  }

  confirmarTenant() {
    if (!this.token) return;

    this.loading = true;
    this.tenantService.confirmarTenant(this.token).subscribe({
      next: (response) => {
        this.successMessage = 'Tenant confirmado com sucesso! Você já pode criar seu usuário.';
        this.confirmacaoSucesso = true;
        this.loading = false;

        // Salvar o domínio no localStorage para uso posterior no login
        if (response && response.dominio) {
          console.log('Salvando domínio no localStorage:', response.dominio);
          this.tenantService.setTenant(response.dominio);
        }

        // Redirect after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/criar-usuario']);
        }, 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erro ao confirmar tenant.';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.loading = true;
    this.tenantService.cadastrarTenant(this.registerForm.value).subscribe({
      next: () => {
        this.successMessage = 'Solicitação de cadastro enviada! Por favor, verifique seu e-mail para confirmar o registro do tenant.';
        this.errorMessage = '';
        this.registerForm.reset();
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erro ao cadastrar tenant.';
        this.successMessage = '';
        this.loading = false;
      }
    });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  dominioPublicoValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const dominio = control.value;
      if (!dominio) {
        return null;
      }

      // Verificar se o domínio completo está na lista de provedores de email
      // Por exemplo: "gmail.com", "hotmail.com", etc.
      if (this.emailProviders.some(provider => dominio.toLowerCase() === provider)) {
        return { dominioPublico: true };
      }

      // Verificar se o domínio termina com algum provedor de email
      // Por exemplo: "algo.gmail.com", "meu.outlook.com", etc.
      if (this.emailProviders.some(provider => dominio.toLowerCase().endsWith('.' + provider))) {
        return { dominioPublico: true };
      }

      // Verificar se o domínio contém palavras-chave comuns de serviços gratuitos
      const freeServiceKeywords = ['free', 'temp', 'demo', 'test', 'mail', 'webmail'];
      if (freeServiceKeywords.some(keyword => dominio.toLowerCase().includes(keyword))) {
        return { dominioPublico: true };
      }

      // Verificar se é um domínio de segundo nível sem TLD (top-level domain)
      // Um domínio empresarial válido deve ter pelo menos um ponto
      if (!dominio.includes('.')) {
        return { dominioPublico: true };
      }

      return null;
    };
  }
}
