import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SALVE_COMMON } from '@shared/primeng-shared';

@Component({
  selector: 'app-billing-cancelado',
  standalone: true,
  imports: [
    ...SALVE_COMMON
  ],
  templateUrl: './billing-cancelado.component.html'
})
export class BillingCanceladoComponent {

  constructor(private router: Router) { }

  tentarNovamente(): void {
    this.router.navigate(['/billing']);
  }
}
