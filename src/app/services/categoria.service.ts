import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Categoria} from "../models/categoria.model";
import {Observable} from "rxjs";
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private apiUrl = environment.apiUrl + '/categorias'

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  public listarCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl)
      .pipe(
        this.errorHandler.handleErrorAsObservable()
      );
  }

  salvarCategoria(categoria: Categoria): Observable<Categoria> {
    if (categoria.id) {
      return this.http.put<Categoria>(`${this.apiUrl}/${categoria.id}`, categoria)
        .pipe(
          this.errorHandler.handleErrorAsObservable()
        );
    }
    return this.http.post<Categoria>(this.apiUrl, categoria)
      .pipe(
        this.errorHandler.handleErrorAsObservable()
      );
  }

  excluirCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        this.errorHandler.handleErrorAsObservable()
      );
  }
}
