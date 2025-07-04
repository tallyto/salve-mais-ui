import {HttpClient} from '@angular/common/http';
import {EventEmitter, Injectable} from '@angular/core';
import {Provento} from '../models/provento.model';
import {Observable} from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProventoService {

  private apiUrl = environment.apiUrl + '/proventos'; // substitua pela sua URL

  constructor(private http: HttpClient) {
  }

  proventoSaved = new EventEmitter<void>();

  public listarProventos(page: number, size: number, sort: string): Observable<Provento[]> {
    return this.http.get<Provento[]>(this.apiUrl, {
      params: {
        page,
        size,
        sort
      }
    });
  }

  public criarProvento(provento: Provento): Observable<Provento> {
    return this.http.post<Provento>(this.apiUrl, provento);
  }
}
