import { Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';
import { CartaoFormComponent } from './cartao-form/cartao-form.component';
import { ListCartaoLimitesComponent } from './list-cartao-limites/list-cartao-limites.component';
import { FaturaFormComponent } from './fatura-form/fatura-form.component';

export const CARTAO_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'form',
        pathMatch: 'full'
      },
      {
        path: 'form',
        component: CartaoFormComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'limites',
        component: ListCartaoLimitesComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'faturas',
        component: FaturaFormComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];
