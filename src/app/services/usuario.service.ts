import { Usuario } from '../models/usuario.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UsuarioAtualizacaoDTO {
  email: string;
  nome: string;
}

export interface UsuarioSenhaDTO {
  email: string;
  senhaAtual: string;
  novaSenha: string;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = environment.apiUrl + '/usuarios';

  constructor(private http: HttpClient) { }

  atualizarNome(dto: UsuarioAtualizacaoDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/atualizar-nome`, dto);
  }

  atualizarSenha(dto: UsuarioSenhaDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/atualizar-senha`, dto, { responseType: 'text' });
  }

  getUsuarioLogado(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/me`);
  }
}
