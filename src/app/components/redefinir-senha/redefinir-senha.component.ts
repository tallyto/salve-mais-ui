import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-redefinir-senha',
  templateUrl: './redefinir-senha.component.html',
  styleUrls: ['./redefinir-senha.component.css']
})
export class RedefinirSenhaComponent {
  redefinirForm: FormGroup;
  token: string = '';
  loading = false;

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
    }, { validator: this.senhasIguaisValidator });
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
  }

  senhasIguaisValidator(group: FormGroup) {
    return group.get('novaSenha')!.value === group.get('confirmarSenha')!.value ? null : { senhasDiferentes: true };
  }

  redefinirSenha() {
    if (this.redefinirForm.invalid || !this.token) return;
    this.loading = true;
    this.authService.redefinirSenha(this.token, this.redefinirForm.value.novaSenha)
      .subscribe({
        next: () => {
          this.snackBar.open('Senha redefinida com sucesso!', 'Fechar', { duration: 3000 });
          this.router.navigate(['/login']);
        },
        error: err => {
          this.snackBar.open(err.error?.error || 'Erro ao redefinir senha.', 'Fechar', { duration: 4000 });
          this.loading = false;
        }
      });
  }
}
