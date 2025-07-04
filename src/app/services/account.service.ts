import { HttpClient } from '@angular/common/http';
import {EventEmitter, Injectable} from '@angular/core';
import {Account, AccountPage} from '../models/account.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private apiUrl = environment.apiUrl + '/conta'

  savedAccount = new EventEmitter<void>();
  constructor(private http: HttpClient) {

  }

  salvarAccount(account: Account): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, account)
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
}
