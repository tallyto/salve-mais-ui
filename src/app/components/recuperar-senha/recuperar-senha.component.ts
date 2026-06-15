import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    FloatLabelModule,
    InputTextModule,
    RouterModule
  ],
  templateUrl: './recuperar-senha.component.html'
})
export class RecuperarSenhaComponent {
  recuperarForm: FormGroup;
  isSubmitting: boolean = false;
  showDomainField: boolean = false;
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService
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
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Preencha todos os campos corretamente.'
      });
      return;
    }

    const { email, dominio } = this.recuperarForm.value;

    this.isSubmitting = true;
    this.authService.recuperarSenha({ email })
      .pipe(
        finalize(() => this.isSubmitting = false)
      )
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Instruções enviadas',
            detail: 'Se o e-mail existir, as instruções foram enviadas.'
          });
          // Limpar o formulário após envio bem-sucedido
          this.recuperarForm.reset();
          this.showDomainField = false;
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: err.error?.message || 'Erro ao solicitar recuperação de senha.'
          });
        }
      });
  }
}
