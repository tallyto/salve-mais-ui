import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  /**
   * Processa o erro HTTP e retorna uma mensagem amigável
   */
  public handleError(error: HttpErrorResponse): string {
    let errorMessage = 'Ocorreu um erro inesperado. Por favor, tente novamente.';

    if (error.error) {
      // Tratamento para erros com corpo personalizado
      if (error.error.message) {
        // Mensagem personalizada do backend
        errorMessage = error.error.message;
      } else if (error.error.userMessage) {
        // Mensagem amigável ao usuário do backend
        errorMessage = error.error.userMessage;
      } else if (typeof error.error === 'string') {
        // Mensagem de erro simples
        errorMessage = error.error;
      }
    } else if (error.status === 0) {
      // Erro de conectividade (sem conexão com o servidor)
      errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão de internet.';
    } else if (error.status === 401) {
      // Erro de autenticação
      errorMessage = 'Sessão expirada. Por favor, faça login novamente.';
    } else if (error.status === 403) {
      // Erro de permissão
      errorMessage = 'Você não tem permissão para realizar esta operação.';
    } else if (error.status === 404) {
      // Erro de recurso não encontrado
      errorMessage = 'O recurso solicitado não foi encontrado.';
    } else if (error.status === 409) {
      // Conflito (geralmente usado para entidades em uso)
      errorMessage = 'Este item não pode ser modificado ou excluído porque está sendo usado em outro lugar.';
    } else if (error.status === 422) {
      // Erro de validação
      errorMessage = 'Os dados fornecidos são inválidos. Verifique os campos e tente novamente.';
    } else if (error.status >= 500) {
      // Erro do servidor
      errorMessage = 'Ocorreu um erro no servidor. Por favor, tente novamente mais tarde.';
    }

    // Loga o erro detalhado para diagnóstico
    console.error('Erro HTTP:', error);

    return errorMessage;
  }

  /**
   * Retorna um operador que pode ser usado em um pipe para tratar erros de requisições HTTP
   */
  public handleErrorAsObservable<T>(): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>): Observable<T> => {
      return source.pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => this.handleError(error));
        })
      );
    };
  }
}
