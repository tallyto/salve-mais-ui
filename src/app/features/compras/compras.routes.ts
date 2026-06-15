import { Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';
import { ListComprasParceladasComponent } from '@components/compras/list-compras-parceladas/list-compras-parceladas.component';
import { CompraParceladaFormComponent } from '@components/compras/compra-parcelada-form/compra-parcelada-form.component';
import { ListComprasDebitoComponent } from '@components/compras/list-compras-debito/list-compras-debito.component';
import { CompraDebitoFormComponent } from '@components/compras/compra-debito-form/compra-debito-form.component';
import { ComprovantesListComponent } from '@components/cartao/comprovantes-list/comprovantes-list.component';

export const COMPRAS_ROUTES: Routes = [
  { path: 'parceladas', component: ListComprasParceladasComponent, canActivate: [AuthGuard] },
  { path: 'parceladas/nova', component: CompraParceladaFormComponent, canActivate: [AuthGuard] },
  { path: 'parceladas/editar/:id', component: CompraParceladaFormComponent, canActivate: [AuthGuard] },
  { path: 'debito', component: ListComprasDebitoComponent, canActivate: [AuthGuard] },
  { path: 'debito/nova', component: CompraDebitoFormComponent, canActivate: [AuthGuard] },
  { path: 'debito/editar/:id', component: CompraDebitoFormComponent, canActivate: [AuthGuard] },
  { path: 'comprovantes', component: ComprovantesListComponent, canActivate: [AuthGuard] }
];
