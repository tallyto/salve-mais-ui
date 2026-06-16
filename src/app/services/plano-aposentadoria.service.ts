import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';
import { PlanoAposentadoria } from '../models/plano-aposentadoria.model';

@Injectable({
  providedIn: 'root'
})
export class PlanoAposentadoriaService {
  private apiUrl = environment.apiUrl + '/plano-aposentadoria';

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  buscar(): Observable<PlanoAposentadoria> {
    return this.http.get<PlanoAposentadoria>(this.apiUrl)
      .pipe(this.errorHandler.handleErrorAsObservable());
  }

  criar(plano: PlanoAposentadoria): Observable<PlanoAposentadoria> {
    return this.http.post<PlanoAposentadoria>(this.apiUrl, plano)
      .pipe(this.errorHandler.handleErrorAsObservable());
  }

  atualizar(plano: PlanoAposentadoria): Observable<PlanoAposentadoria> {
    return this.http.put<PlanoAposentadoria>(this.apiUrl, plano)
      .pipe(this.errorHandler.handleErrorAsObservable());
  }

  deletar(): Observable<void> {
    return this.http.delete<void>(this.apiUrl)
      .pipe(this.errorHandler.handleErrorAsObservable());
  }
}
