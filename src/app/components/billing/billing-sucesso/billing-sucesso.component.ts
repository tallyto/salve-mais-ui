import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-billing-sucesso',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule
  ],
  templateUrl: './billing-sucesso.component.html'
})
export class BillingSucessoComponent {

  constructor(private router: Router) { }

  irParaDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
