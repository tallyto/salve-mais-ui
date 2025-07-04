import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UsuarioCadastroDTO {
  nome: string;
  email: string;
  senha: string;
}

export interface LoginDTO {
  email: string;
  senha: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl + '/usuarios';

  constructor(private http: HttpClient) {}

  register(data: UsuarioCadastroDTO): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  login(data: LoginDTO): Observable<any> {
    return this.http.post(environment.apiUrl + '/auth/login', data);
  }

  recuperarSenha(data: { email: string }): Observable<any> {
    return this.http.post(environment.apiUrl + '/auth/recuperar-senha', data);
  }

  redefinirSenha(token: string, novaSenha: string) {
    return this.http.post<any>(environment.apiUrl + '/auth/redefinir-senha', { token, novaSenha });
  }
}
