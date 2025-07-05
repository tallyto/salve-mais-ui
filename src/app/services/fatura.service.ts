import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Fatura} from "../models/fatura.model";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FaturaService {

 private apiUrl = environment.apiUrl + '/faturas'

  constructor(private http: HttpClient) {

  }

  public listarFaturas(): Observable<Fatura[]> {
    return this.http.get<Fatura[]>(this.apiUrl)
  }

  public criarFatura(cardId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${cardId}`, {});
  }

  public pagarFatura(faturaId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/pagar/${faturaId}`, {});
  }
}
