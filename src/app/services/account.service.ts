import { HttpClient } from '@angular/common/http';
import {EventEmitter, Injectable} from '@angular/core';
import {Account, AccountPage} from '../models/account.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private apiUrl = environment.apiUrl + '/contas'

  savedAccount = new EventEmitter<void>();
  constructor(private http: HttpClient) {

  }

  salvarAccount(account: Account): Observable<Account> {
    // Define o saldo inicial como 0 e tipo como CORRENTE por padrão
    const newAccount = {
      ...account,
      saldo: 0,
      tipo: account.tipo || 'CORRENTE'
    };
    return this.http.post<Account>(this.apiUrl, newAccount);
  }

  atualizarAccount(account: Account): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrl}/${account.id}`, account)
  }

  listarAccounts(page: number, size: number, sort: string): Observable<AccountPage> {
    return this.http.get<AccountPage>(this.apiUrl,  {
      params: {
        page,
        size,
        sort
      }
    })
  }

  listarTodasContas(): Observable<Account[]> {
    // Usa a mesma endpoint paginada mas com um tamanho grande para pegar todas
    return this.http.get<AccountPage>(`${this.apiUrl}?page=0&size=1000&sort=titular`)
      .pipe(
        map((response: AccountPage) => response.content || [])
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
