import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { TenantService } from '@services/tenant.service';
import { SALVE_COMMON, SALVE_FORMS, SALVE_OVERLAY } from '@shared/primeng-shared';
import { senhasIguaisValidator, markFormGroupTouched } from '@shared/utils';

@Component({
  selector: 'app-criar-usuario',
  standalone: true,
  imports: [
    ...SALVE_COMMON,
    ...SALVE_FORMS,
    ...SALVE_OVERLAY
  ],
  templateUrl: './criar-usuario.component.html'
})
export class CriarUsuarioComponent implements OnInit {
  userForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  loading = false;
  tenantDominio: string | null = null;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tenantService: TenantService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]]
    }, { validators: senhasIguaisValidator });
  }

  ngOnInit() {
    // Verificar se há um tenant atual na sessão
    this.tenantDominio = this.tenantService.obter();
    if (!this.tenantDominio) {
      this.router.navigate(['/register']);
    }
  }

  onSubmit() {
    if (this.userForm.invalid) {
      markFormGroupTouched(this.userForm);
      return;
    }

    this.loading = true;
    const { nome, email, senha } = this.userForm.value;

    this.authService.register({ nome, email, senha }).subscribe({
      next: () => {
        this.successMessage = 'Usuário criado com sucesso!';
        this.errorMessage = '';

        // Redirecionar para o login após 2 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erro ao criar usuário.';
        this.successMessage = '';
        this.loading = false;
      }
    });
  }
}
