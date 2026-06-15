import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-billing-cancelado',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule
  ],
  templateUrl: './billing-cancelado.component.html'
})
export class BillingCanceladoComponent {

  constructor(private router: Router) { }

  tentarNovamente(): void {
    this.router.navigate(['/billing']);
  }
}
