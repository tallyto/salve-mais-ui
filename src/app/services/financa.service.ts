import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Financa} from '../models/financa.model';

@Injectable({
  providedIn: 'root'
})
export class FinancaService {

  private apiUrl = 'http://localhost:8080/api/contasfixas'; // substitua pela sua URL

  savedFinanca = new EventEmitter<void>();
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
    return this.http.post<Financa>(this.apiUrl, financa);
  }
}
