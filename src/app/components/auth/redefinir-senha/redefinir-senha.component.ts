import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SALVE_COMMON, SALVE_FORMS } from '@shared/primeng-shared';
import { senhasIguaisValidator } from '@shared/utils';

@Component({
    selector: 'app-redefinir-senha',
    standalone: true,
    imports: [
      ...SALVE_COMMON,
      ...SALVE_FORMS
    ],
    templateUrl: './redefinir-senha.component.html'
})
export class RedefinirSenhaComponent implements OnInit {
  redefinirForm: FormGroup;
  token: string = '';
  domain: string = '';
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  tokenValido = false;
  currentYear = new Date().getFullYear();

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.redefinirForm = this.fb.group({
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]]
    }, { validators: senhasIguaisValidator });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      this.domain = params['domain'] || '';

      // Verificar se o token é válido
      if (this.token) {
        this.authService.verificarToken(this.token).subscribe({
          next: () => {
            this.tokenValido = true;
          },
          error: () => {
            this.tokenValido = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Token inválido',
              detail: 'Token inválido ou expirado. Solicite uma nova redefinição de senha.'
            });
            this.router.navigate(['/recuperar-senha']);
          }
        });
      } else {
        this.router.navigate(['/recuperar-senha']);
      }
    });
  }

  redefinirSenha() {
    if (this.redefinirForm.invalid || !this.token || !this.tokenValido) {
      return;
    }

    this.loading = true;

    this.authService.redefinirSenha(this.token, this.redefinirForm.value.novaSenha)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Senha atualizada',
            detail: 'Senha redefinida com sucesso!'
          });
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (err: { error: { message: any; error: any; }; }) => {
          const mensagem = err.error?.message || err.error?.error || 'Erro ao redefinir senha. Tente novamente.';
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: mensagem
          });
          this.loading = false;
        }
      });
  }
}
