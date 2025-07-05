import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Cartao} from "../models/cartao.model";
import {Observable} from "rxjs";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartaoService {

  private apiUrl = environment.apiUrl + '/cartao-credito'

  constructor(private http: HttpClient) {

  }

  salvarCartao(cartao: Cartao): Observable<Cartao> {
    return this.http.post<Cartao>(this.apiUrl, cartao)
  }

  listarCartoes(): Observable<Cartao[]> {
    return this.http.get<Cartao[]>(this.apiUrl)
  }

  excluirCartao(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
