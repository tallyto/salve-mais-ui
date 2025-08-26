import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {CartaoFormComponent} from "./components/cartao-form/cartao-form.component";
import {CategoriaFormComponent} from "./components/categoria-form/categoria-form.component";
import {ProventoFormComponent} from "./components/provento-form/provento-form.component";
import {DespesasFixasComponent} from "./components/despesas-fixas/despesas-fixas.component";
import {DespesasRecorrentesComponent} from "./components/despesas-recorrentes/despesas-recorrentes.component";
import { AccountComponent } from './components/account/account.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './services/auth.guard';
import { RecuperarSenhaComponent } from './components/recuperar-senha/recuperar-senha.component';
import { RedefinirSenhaComponent } from './components/redefinir-senha/redefinir-senha.component';
import { CriarUsuarioComponent } from './components/criar-usuario/criar-usuario.component';
import { RelatorioMensalComponent } from './components/relatorio-mensal/relatorio-mensal.component';
import { FaturaFormComponent } from './components/fatura-form/fatura-form.component';
import { CartaoLimitesComponent } from './components/cartao-limites/cartao-limites.component';
import { ContaFixaRecorrenteComponent } from './components/conta-fixa-recorrente/conta-fixa-recorrente.component';
import { NotificacoesComponent } from './components/notificacoes/notificacoes.component';
import { MinhaContaComponent } from './components/minha-conta/minha-conta.component';
import { ReservaEmergenciaComponent } from './components/reserva-emergencia/reserva-emergencia.component';
import { ReservaEmergenciaFormComponent } from './components/reserva-emergencia-form/reserva-emergencia-form.component';


const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'card-form', component: CartaoFormComponent, canActivate: [AuthGuard]},
  {path: 'categoria-form', component: CategoriaFormComponent, canActivate: [AuthGuard]},
  {path: 'provento-form', component: ProventoFormComponent, canActivate: [AuthGuard]},
  {path: 'despesas-fixas', component: DespesasFixasComponent, canActivate: [AuthGuard]},
  {path: 'conta-fixa-recorrente', component: ContaFixaRecorrenteComponent, canActivate: [AuthGuard]},
  {path: 'despesas-recorrentes', component: DespesasRecorrentesComponent, canActivate: [AuthGuard]},
  {path: 'faturas', component: FaturaFormComponent, canActivate: [AuthGuard]},
  {path: 'cartao-limites', component: CartaoLimitesComponent, canActivate: [AuthGuard]},
  {path: 'notificacoes', component: NotificacoesComponent, canActivate: [AuthGuard]},
  {path: 'account', component: AccountComponent, canActivate: [AuthGuard]},
  {path: 'minha-conta', component: MinhaContaComponent, canActivate: [AuthGuard]},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'recuperar-senha', component: RecuperarSenhaComponent},
  {path: 'redefinir-senha', component: RedefinirSenhaComponent},
  {path: 'criar-usuario', component: CriarUsuarioComponent},
  {path: 'relatorio-mensal', component: RelatorioMensalComponent, canActivate: [AuthGuard]},
  {path: 'reserva-emergencia', component: ReservaEmergenciaComponent, canActivate: [AuthGuard]},
  {path: 'reserva-emergencia/criar', component: ReservaEmergenciaFormComponent, canActivate: [AuthGuard]},
  {path: 'reserva-emergencia/editar/:id', component: ReservaEmergenciaFormComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: 'dashboard'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
