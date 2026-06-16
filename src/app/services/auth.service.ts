import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface UsuarioCadastroDTO {
  nome: string;
  email: string;
  senha: string;
}

export interface LoginDTO {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuario?: { id: number; email: string; nome: string };
}

export interface RegisterResponse {
  id?: number;
  email: string;
  nome: string;
}

export interface TokenVerificationResponse {
  valid: boolean;
  email?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl + '/usuarios';

  constructor(private http: HttpClient) {}

  register(data: UsuarioCadastroDTO): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(this.apiUrl, data);
  }

  login(data: LoginDTO): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(environment.apiUrl + '/auth/login', data);
  }

  recuperarSenha(data: { email: string }): Observable<void> {
    return this.http.post<void>(environment.apiUrl + '/auth/recuperar-senha', data);
  }

  redefinirSenha(token: string, novaSenha: string): Observable<void> {
    return this.http.post<void>(environment.apiUrl + '/auth/redefinir-senha', { token, novaSenha });
  }

  verificarToken(token: string): Observable<TokenVerificationResponse> {
    return this.http.get<TokenVerificationResponse>(environment.apiUrl + '/auth/verificar-token', {
      params: { token }
    });
  }

  logout(): void {
    // Remove o token do localStorage
    localStorage.removeItem('token');
    // Remove informações do tenant se houver
    localStorage.removeItem('tenant');
    // Remove qualquer outro dado de sessão
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
