import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Financa} from '../models/financa.model';

@Injectable({
  providedIn: 'root'
})
export class FinancaService {

  private apiUrl = 'http://localhost:8080/api/contasfixas'; // substitua pela sua URL

  constructor(private http: HttpClient) {
  }

  listarFinancas(): Observable<Financa[]> {
    return this.http.get<Financa[]>(this.apiUrl);
  }

  salvarFinanca(financa: Financa): Observable<Financa> {
    return this.http.post<Financa>(this.apiUrl, financa);
  }
}
