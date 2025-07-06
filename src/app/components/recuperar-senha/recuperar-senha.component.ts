import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { TenantService } from '../../services/tenant.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-recuperar-senha',
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
    MatProgressSpinnerModule,
    RouterModule
  ],
  templateUrl: './recuperar-senha.component.html',
  styleUrl: './recuperar-senha.component.css'
})
export class RecuperarSenhaComponent {
  recuperarForm: FormGroup;
  isSubmitting: boolean = false;
  showDomainField: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private tenantService: TenantService
  ) {
    this.recuperarForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      dominio: ['']
    });
  }

  onEmailBlur() {
    const email: string = this.recuperarForm.get('email')?.value || '';
    const domain = email.split('@')[1] || '';
    const publicDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'];
    this.showDomainField = publicDomains.includes(domain);
    if (!this.showDomainField) {
      this.recuperarForm.patchValue({ dominio: domain });
    } else {
      this.recuperarForm.patchValue({ dominio: '' });
    }
  }

  onSubmit() {
    if (this.recuperarForm.invalid) {
      this.snackBar.open('Preencha todos os campos corretamente.', 'Fechar', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: 'snackbar-error'
      });
      return;
    }

    const { email, dominio } = this.recuperarForm.value;
    const tenant = dominio || (email.split('@')[1] || '');

    this.isSubmitting = true;
    this.authService.recuperarSenha({ email }, tenant)
      .pipe(
        finalize(() => this.isSubmitting = false)
      )
      .subscribe({
        next: () => {
          this.snackBar.open('Se o e-mail existir, as instruções foram enviadas.', 'Fechar', {
            duration: 4000,
            verticalPosition: 'top',
            panelClass: 'snackbar-success'
          });
          // Limpar o formulário após envio bem-sucedido
          this.recuperarForm.reset();
          this.showDomainField = false;
        },
        error: (err) => {
          this.snackBar.open(err.error?.message || 'Erro ao solicitar recuperação de senha.', 'Fechar', {
            duration: 4000,
            verticalPosition: 'top',
            panelClass: 'snackbar-error'
          });
        }
      });
  }
}
