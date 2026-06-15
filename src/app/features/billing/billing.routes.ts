import { Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';
import { BillingComponent } from '@components/billing/billing/billing.component';
import { BillingSucessoComponent } from '@components/billing/billing-sucesso/billing-sucesso.component';
import { BillingCanceladoComponent } from '@components/billing/billing-cancelado/billing-cancelado.component';

export const BILLING_ROUTES: Routes = [
  { path: '', component: BillingComponent, canActivate: [AuthGuard] },
  { path: 'sucesso', component: BillingSucessoComponent, canActivate: [AuthGuard] },
  { path: 'cancelado', component: BillingCanceladoComponent, canActivate: [AuthGuard] }
];
