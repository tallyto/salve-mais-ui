import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Conta, TipoConta } from '@models/conta.model';
import { Page } from '@models/page.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private apiUrl = environment.apiUrl + '/contas'

  accountsChanged$ = new BehaviorSubject<void>(undefined);
  constructor(private http: HttpClient) {

  }

  salvarAccount(account: Conta): Observable<Conta> {
    // Define o saldo inicial como 0
    const newAccount = {
      ...account,
      saldo: 0
    };
    return this.http.post<Conta>(this.apiUrl, newAccount);
  }

  atualizarAccount(account: Conta): Observable<Conta> {
    return this.http.put<Conta>(`${this.apiUrl}/${account.id}`, account)
  }

  listarAccounts(page: number, size: number, sort: string): Observable<Page<Conta>> {
    return this.http.get<Page<Conta>>(this.apiUrl,  {
      params: {
        page,
        size,
        sort
      }
    })
  }

  listarTodasContas(): Observable<Conta[]> {
    // Usa a mesma endpoint paginada mas com um tamanho grande para pegar todas
    return this.http.get<Page<Conta>>(`${this.apiUrl}?page=0&size=1000&sort=titular`)
      .pipe(
        map((response: Page<Conta>) => response.content || [])
      );
  }

  excluirAccount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  transferirEntreConta(contaOrigemId: number, contaDestinoId: number, valor: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/transferir`, {
      contaOrigemId,
      contaDestinoId,
      valor
    });
  }
}
