import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Categoria} from "../models/categoria.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private apiUrl = 'http://localhost:8080/api/categorias'

  constructor(private http: HttpClient) {

  }

  salvarCategoria(categoria: Categoria ): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria)
  }
}
