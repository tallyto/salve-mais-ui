import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {CartaoFormComponent} from "./components/cartao-form/cartao-form.component";
import {CategoriaFormComponent} from "./components/categoria-form/categoria-form.component";
import {ProventoFormComponent} from "./components/provento-form/provento-form.component";
import {DespesasFixasComponent} from "./components/despesas-fixas/despesas-fixas.component";
import {DepesasRecorrentesComponent} from "./components/depesas-recorrentes/depesas-recorrentes.component";
import {FaturaComponent} from "./components/fatura/fatura.component";
import { AccountComponent } from './components/account/account.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './services/auth.guard';
import { RecuperarSenhaComponent } from './components/recuperar-senha/recuperar-senha.component';
import { RedefinirSenhaComponent } from './components/redefinir-senha/redefinir-senha.component';
import { CriarUsuarioComponent } from './components/criar-usuario/criar-usuario.component';


const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'card-form', component: CartaoFormComponent, canActivate: [AuthGuard]},
  {path: 'categoria-form', component: CategoriaFormComponent, canActivate: [AuthGuard]},
  {path: 'provento-form', component: ProventoFormComponent, canActivate: [AuthGuard]},
  {path: 'despesas-fixas', component: DespesasFixasComponent, canActivate: [AuthGuard]},
  {path: 'despesas-recorrentes', component: DepesasRecorrentesComponent, canActivate: [AuthGuard]},
  {path: 'faturas', component: FaturaComponent, canActivate: [AuthGuard]},
  {path: 'account', component: AccountComponent, canActivate: [AuthGuard]},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'recuperar-senha', component: RecuperarSenhaComponent},
  {path: 'redefinir-senha', component: RedefinirSenhaComponent},
  {path: 'criar-usuario', component: CriarUsuarioComponent},
  {path: '**', redirectTo: 'dashboard'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
