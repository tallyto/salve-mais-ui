import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { ProventoService } from '../../services/provento.service';
import { Account } from '../../models/account.model';
import { Provento } from '../../models/provento.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  accounts: Account[] = [];
  proventos: Provento[] = [];
  totalSaldo: number = 0;
  totalReceitas: number = 0;
  isLoading: boolean = true;
  today: Date = new Date();

  constructor(
    private accountService: AccountService,
    private proventoService: ProventoService
  ) {}

  ngOnInit(): void {
    this.loadSummaryData();
  }

  loadSummaryData(): void {
    this.isLoading = true;
    forkJoin({
      accounts: this.accountService.listarAccounts(0, 100, ''),
      proventos: this.proventoService.listarProventos(0, 100, '')
    }).subscribe({
      next: (results) => {
        this.accounts = results.accounts.content;
        // @ts-ignore
        this.proventos = results.proventos.content;
        
        this.calculateTotals();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar dados do resumo:', error);
        this.isLoading = false;
      }
    });
  }

  calculateTotals(): void {
    this.totalSaldo = this.accounts.reduce((sum, account) => sum + account.saldo, 0);
    this.totalReceitas = this.proventos.reduce((sum, provento) => sum + provento.valor, 0);
  }
}
