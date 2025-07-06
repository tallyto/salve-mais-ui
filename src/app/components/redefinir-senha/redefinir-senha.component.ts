import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-redefinir-senha',
  templateUrl: './redefinir-senha.component.html',
  styleUrls: ['./redefinir-senha.component.css']
})
export class RedefinirSenhaComponent implements OnInit {
  redefinirForm: FormGroup;
  token: string = '';
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  tokenValido = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
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

      // Verificar se o token é válido
      if (this.token) {
        this.authService.verificarToken(this.token).subscribe({
          next: () => {
            this.tokenValido = true;
          },
          error: () => {
            this.tokenValido = false;
            this.snackBar.open('Token inválido ou expirado. Solicite uma nova redefinição de senha.', 'Fechar', {
              duration: 5000,
              panelClass: ['mat-warn']
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
          this.snackBar.open('Senha redefinida com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['mat-primary']
          });
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: err => {
          const mensagem = err.error?.message || err.error?.error || 'Erro ao redefinir senha. Tente novamente.';
          this.snackBar.open(mensagem, 'Fechar', {
            duration: 4000,
            panelClass: ['mat-warn']
          });
          this.loading = false;
        }
      });
  }
}
