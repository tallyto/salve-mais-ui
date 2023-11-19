import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Provento} from '../models/provento.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProventoService {

  private apiUrl = 'http://localhost:8080/api/proventos'; // substitua pela sua URL

  constructor(private http: HttpClient) {
  }

  public listarProventos(): Observable<Provento[]> {
    return this.http.get<Provento[]>(this.apiUrl);
  }

  public criarProvento(provento: Provento): Observable<Provento> {
    return this.http.post<Provento>(this.apiUrl, provento);
  }
}
