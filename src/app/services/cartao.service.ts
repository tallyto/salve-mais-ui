import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Cartao} from "../models/cartao.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartaoService {

  private apiUrl = 'http://localhost:8080/api/cartao-credito'

  constructor(private http: HttpClient) {

  }

  salvarCartao(cartao: Cartao ): Observable<Cartao> {
    return this.http.post<Cartao>(this.apiUrl, cartao)
  }

}
