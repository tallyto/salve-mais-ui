import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GastoCartao} from "../models/gasto-cartao.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GastoCartaoService {

  private apiUrl = 'http://localhost:8080/api/compras'; // substitua pela sua URL

  constructor(private http: HttpClient) { }

  public listCompras() : Observable<GastoCartao[]>{
      return this.http.get<GastoCartao[]>(this.apiUrl);
  }

    public salvarCompra(compra: GastoCartao) : Observable<GastoCartao>{
        return this.http.post<GastoCartao>(this.apiUrl, compra);
    }
}
