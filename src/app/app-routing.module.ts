import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {CartaoFormComponent} from "./components/cartao-form/cartao-form.component";
import {CategoriaFormComponent} from "./components/categoria-form/categoria-form.component";
import {ProventoFormComponent} from "./components/provento-form/provento-form.component";
import {DespesasFixasComponent} from "./components/despesas-fixas/despesas-fixas.component";

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'card-form', component: CartaoFormComponent},
  {path: 'categoria-form', component: CategoriaFormComponent},
  {path: 'provento-form', component: ProventoFormComponent},
  {path: 'despesas-fixas', component: DespesasFixasComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
