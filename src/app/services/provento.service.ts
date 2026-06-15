import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Provento} from '../models/provento.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProventoPage {
  content: Provento[];
  totalElements: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProventoService {

  private apiUrl = environment.apiUrl + '/proventos';

  constructor(private http: HttpClient) {
  }

  proventosChanged$ = new BehaviorSubject<void>(undefined);
  editingProvento$ = new BehaviorSubject<Provento | null>(null);

  public listarProventos(page: number, size: number, sort: string): Observable<ProventoPage | Provento[]> {
    return this.http.get<ProventoPage | Provento[]>(this.apiUrl, {
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

  public atualizarProvento(provento: Provento): Observable<Provento> {
    return this.http.put<Provento>(`${this.apiUrl}/${provento.id}`, provento);
  }

  public excluirProvento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
