import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';

@Component({
    selector: 'app-redefinir-senha',
    standalone: true,
    imports: [
      CommonModule,
      ReactiveFormsModule,
      ButtonModule,
      CardModule,
      FloatLabelModule,
      PasswordModule,
      RouterModule
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
    }, { validators: this.senhasIguaisValidator });
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

  senhasIguaisValidator(group: FormGroup) {
    const novaSenha = group.get('novaSenha')?.value;
    const confirmarSenha = group.get('confirmarSenha')?.value;

    return novaSenha === confirmarSenha ? null : { senhasDiferentes: true };
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
