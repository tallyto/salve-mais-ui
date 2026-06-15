import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TenantService } from '../../services/tenant.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-criar-usuario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    FloatLabelModule,
    InputTextModule,
    MessageModule,
    PasswordModule
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
    }, { validators: this.senhasIguaisValidator });
  }

  ngOnInit() {
    // Verificar se há um tenant atual na sessão
    this.tenantDominio = this.tenantService.getTenant();
    if (!this.tenantDominio) {
      this.router.navigate(['/register']);
    }
  }

  senhasIguaisValidator(group: FormGroup) {
    const senha = group.get('senha')?.value;
    const confirmarSenha = group.get('confirmarSenha')?.value;

    return senha === confirmarSenha ? null : { senhasDiferentes: true };
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.markFormGroupTouched(this.userForm);
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

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}
