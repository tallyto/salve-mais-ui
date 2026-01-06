import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@services/auth.guard';
import { CartaoFormComponent } from './cartao-form/cartao-form.component';
import { CartaoLimitesComponent } from './cartao-limites/cartao-limites.component';
import { FaturaFormComponent } from './fatura-form/fatura-form.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'form',
        component: CartaoFormComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'limites',
        component: CartaoLimitesComponent,
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

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartaoRoutingModule { }
