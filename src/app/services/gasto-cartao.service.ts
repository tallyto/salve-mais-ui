import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GastoCartaoInput} from "../models/input/gasto-cartao.input";
import {Observable} from "rxjs";
import {GastoCartao} from "../models/gasto-cartao.model";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GastoCartaoService {

  private apiUrl = environment.apiUrl + '/compras';

  gastaoCartaoSaved = new EventEmitter<void>();
  editingGasto = new EventEmitter<GastoCartao>();

  constructor(private http: HttpClient) {
  }

  public listCompras(page: number, size: number, sort: string): Observable<GastoCartao[]> {
    return this.http.get<GastoCartao[]>(this.apiUrl, {
      params: {
        page,
        size,
        sort
      }
    });
  }

  public salvarCompra(compra: GastoCartaoInput): Observable<GastoCartao> {
    if (compra.id) {
      // Se tem ID, é uma atualização (PUT)
      return this.http.put<GastoCartao>(`${this.apiUrl}/${compra.id}`, compra);
    }
    // Se não tem ID, é uma criação (POST)
    return this.http.post<GastoCartao>(this.apiUrl, compra);
  }

  public excluirCompra(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  public getCompraById(id: number): Observable<GastoCartao> {
    return this.http.get<GastoCartao>(`${this.apiUrl}/${id}`);
  }
}
