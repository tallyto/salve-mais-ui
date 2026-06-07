import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-billing-cancelado',
  templateUrl: './billing-cancelado.component.html',
  styleUrls: ['../billing-result.css'],
  standalone: false
})
export class BillingCanceladoComponent {

  constructor(private router: Router) { }

  tentarNovamente(): void {
    this.router.navigate(['/billing']);
  }
}
