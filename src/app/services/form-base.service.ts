import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormBaseService {
  loading$ = new BehaviorSubject<boolean>(false);

  constructor(private messageService: MessageService) {}

  setLoading(loading: boolean): void {
    this.loading$.next(loading);
  }

  markFormAsTouched(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      form.get(key)?.markAsTouched();
    });
  }

  showSuccess(message: string, title: string = 'Sucesso'): void {
    this.messageService.add({
      severity: 'success',
      summary: title,
      detail: message,
      life: 3000
    });
  }

  showError(message: string, title: string = 'Erro'): void {
    this.messageService.add({
      severity: 'error',
      summary: title,
      detail: message,
      life: 5000
    });
  }

  handleError(error: any, defaultMessage: string = 'Erro ao processar requisição'): string {
    if (error.error?.message) {
      return error.error.message;
    }

    if (error.status === 400) {
      if (error.error && typeof error.error === 'string') {
        return error.error;
      }
      return 'Dados inválidos. Verifique os campos preenchidos.';
    }

    if (error.status === 403) {
      return 'Você não tem permissão para realizar esta ação.';
    }

    if (error.status === 404) {
      return 'Recurso não encontrado.';
    }

    if (error.status >= 500) {
      return 'Erro do servidor. Tente novamente mais tarde.';
    }

    return defaultMessage;
  }
}
