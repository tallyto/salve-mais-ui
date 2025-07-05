import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Financa} from '../models/financa.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContasFixasService {

  private apiUrl = environment.apiUrl + '/contas/fixas'; // substitua pela sua URL

  savedFinanca = new EventEmitter<void>();
  editingFinanca = new EventEmitter<Financa>();

  constructor(private http: HttpClient) {
  }

  listarFinancas(page: number, size: number, sort: string): Observable<Financa[]> {
    return this.http.get<Financa[]>(this.apiUrl, {
      params: {
        page,
        size,
        sort
      }
    });
  }

  salvarFinanca(financa: Financa): Observable<Financa> {
    if (financa.id) {
      // Se tem ID, é uma atualização (PUT)
      return this.http.put<Financa>(`${this.apiUrl}/${financa.id}`, financa);
    }
    // Se não tem ID, é uma criação (POST)
    return this.http.post<Financa>(this.apiUrl, financa);
  }

  excluirFinanca(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getFinancaById(id: number): Observable<Financa> {
    return this.http.get<Financa>(`${this.apiUrl}/${id}`);
  }
}
