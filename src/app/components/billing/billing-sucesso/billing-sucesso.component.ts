import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SALVE_COMMON } from '../../../shared/primeng-shared';

@Component({
  selector: 'app-billing-sucesso',
  standalone: true,
  imports: [
    ...SALVE_COMMON
  ],
  templateUrl: './billing-sucesso.component.html'
})
export class BillingSucessoComponent {

  constructor(private router: Router) { }

  irParaDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
