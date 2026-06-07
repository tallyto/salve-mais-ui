import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-billing-sucesso',
  templateUrl: './billing-sucesso.component.html',
  styleUrls: ['../billing-result.css'],
  standalone: false
})
export class BillingSucessoComponent {

  constructor(private router: Router) { }

  irParaDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
