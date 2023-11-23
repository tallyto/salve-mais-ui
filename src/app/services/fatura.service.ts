import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Fatura} from "../models/fatura.model";

@Injectable({
  providedIn: 'root'
})
export class FaturaService {

 private apiUrl = 'http://localhost:8080/api/faturas'

  constructor(private http: HttpClient) {

  }

  public listarFaturas(): Observable<Fatura[]> {
    return this.http.get<Fatura[]>(this.apiUrl)
  }
}
