import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Account } from '../models/account.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private apiUrl = 'http://localhost:8080/api/conta'

  constructor(private http: HttpClient) {

  }

  salvarAccount(account: Account): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, account)
  }

  listarAccounts(page: number, size: number, sort: string): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiUrl,  {
      params: {
        page,
        size,
        sort
      }
    })
  }
}
