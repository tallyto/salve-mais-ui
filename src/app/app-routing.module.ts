import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {CartaoFormComponent} from "./components/cartao-form/cartao-form.component";
import {ProventoFormComponent} from "./components/provento-form/provento-form.component";
import {DespesasFixasComponent} from "./components/despesas-fixas/despesas-fixas.component";
import {DespesasRecorrentesComponent} from "./components/despesas-recorrentes/despesas-recorrentes.component";
import { AccountComponent } from './components/account/account.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './services/auth.guard';
import { NoAuthGuard } from './services/no-auth.guard';
import { RecuperarSenhaComponent } from './components/recuperar-senha/recuperar-senha.component';
import { RedefinirSenhaComponent } from './components/redefinir-senha/redefinir-senha.component';
import { CriarUsuarioComponent } from './components/criar-usuario/criar-usuario.component';
import { RelatorioMensalComponent } from './components/relatorio-mensal/relatorio-mensal.component';
import { FaturaFormComponent } from './components/fatura-form/fatura-form.component';
import { CartaoLimitesComponent } from './components/cartao-limites/cartao-limites.component';
import { ContaFixaRecorrenteComponent } from './components/conta-fixa-recorrente/conta-fixa-recorrente.component';
import { NotificacoesComponent } from './components/notificacoes/notificacoes.component';
import { NotificacoesEmailConfigComponent } from './components/notificacoes-email-config/notificacoes-email-config.component';
import { MinhaContaComponent } from './components/minha-conta/minha-conta.component';
import { ReservaEmergenciaComponent } from './components/reserva-emergencia/reserva-emergencia.component';
import { ReservaEmergenciaFormComponent } from './components/reserva-emergencia-form/reserva-emergencia-form.component';
import { BudgetRuleComponent } from './components/budget-rule/budget-rule.component';
import { ComprovantesListComponent } from './components/comprovantes-list/comprovantes-list.component';
import { ListTransacoesComponent } from './components/list-transacoes/list-transacoes.component';
import { TransacaoDetalheComponent } from './components/transacao-detalhe/transacao-detalhe.component';
import { CompraParceladaFormComponent } from './components/compra-parcelada-form/compra-parcelada-form.component';
import { ListComprasParceladasComponent } from './components/list-compras-parceladas/list-compras-parceladas.component';
import { PagamentosStatusComponent } from './components/pagamentos-status/pagamentos-status.component';
import { TenantConfigComponent } from './components/tenant-config/tenant-config.component';
import { HomeComponent } from './components/home/home.component';
import { AdminUsuariosComponent } from './components/admin-usuarios/admin-usuarios.component';
import { CompraDebitoFormComponent } from './components/compra-debito-form/compra-debito-form.component';
import { ListComprasDebitoComponent } from './components/list-compras-debito/list-compras-debito.component';
import { ComparativoMensalComponent } from './components/comparativo-mensal/comparativo-mensal.component';


const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [NoAuthGuard]},
  {path: 'home', component: HomeComponent, canActivate: [NoAuthGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'card-form', component: CartaoFormComponent, canActivate: [AuthGuard]},
  {
    path: 'categoria-form', 
    loadChildren: () => import('./components/categoria/categoria.module').then(m => m.CategoriaModule),
    canActivate: [AuthGuard]
  },
  {path: 'provento-form', component: ProventoFormComponent, canActivate: [AuthGuard]},
  {path: 'despesas-fixas', component: DespesasFixasComponent, canActivate: [AuthGuard]},
  {path: 'conta-fixa-recorrente', component: ContaFixaRecorrenteComponent, canActivate: [AuthGuard]},
  {path: 'despesas-recorrentes', component: DespesasRecorrentesComponent, canActivate: [AuthGuard]},
  {path: 'faturas', component: FaturaFormComponent, canActivate: [AuthGuard]},
  {path: 'cartao-limites', component: CartaoLimitesComponent, canActivate: [AuthGuard]},
  {path: 'notificacoes', component: NotificacoesComponent, canActivate: [AuthGuard]},
  {path: 'notificacoes-email-config', component: NotificacoesEmailConfigComponent, canActivate: [AuthGuard]},
  {path: 'pagamentos-status', component: PagamentosStatusComponent, canActivate: [AuthGuard]},
  {path: 'account', component: AccountComponent, canActivate: [AuthGuard]},
  {path: 'minha-conta', component: MinhaContaComponent, canActivate: [AuthGuard]},
  {path: 'budget-rule', component: BudgetRuleComponent, canActivate: [AuthGuard]},
  {path: 'comprovantes', component: ComprovantesListComponent, canActivate: [AuthGuard]},
  {path: 'transacoes', component: ListTransacoesComponent, canActivate: [AuthGuard]},
  {path: 'transacao/:id', component: TransacaoDetalheComponent, canActivate: [AuthGuard]},
  {path: 'compras-parceladas', component: ListComprasParceladasComponent, canActivate: [AuthGuard]},
  {path: 'compras-parceladas/nova', component: CompraParceladaFormComponent, canActivate: [AuthGuard]},
  {path: 'compras-parceladas/editar/:id', component: CompraParceladaFormComponent, canActivate: [AuthGuard]},
  {path: 'compras-debito', component: ListComprasDebitoComponent, canActivate: [AuthGuard]},
  {path: 'compras-debito/nova', component: CompraDebitoFormComponent, canActivate: [AuthGuard]},
  {path: 'compras-debito/editar/:id', component: CompraDebitoFormComponent, canActivate: [AuthGuard]},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'recuperar-senha', component: RecuperarSenhaComponent},
  {path: 'redefinir-senha', component: RedefinirSenhaComponent},
  {path: 'criar-usuario', component: CriarUsuarioComponent},
  {path: 'relatorio-mensal', component: RelatorioMensalComponent, canActivate: [AuthGuard]},
  {path: 'comparativo-mensal', component: ComparativoMensalComponent, canActivate: [AuthGuard]},
  {path: 'reserva-emergencia', component: ReservaEmergenciaComponent, canActivate: [AuthGuard]},
  {path: 'reserva-emergencia/criar', component: ReservaEmergenciaFormComponent, canActivate: [AuthGuard]},
  {path: 'reserva-emergencia/editar/:id', component: ReservaEmergenciaFormComponent, canActivate: [AuthGuard]},
  {path: 'tenant-config', component: TenantConfigComponent, canActivate: [AuthGuard]},
  {path: 'admin-usuarios', component: AdminUsuariosComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: 'dashboard'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
