import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {ProventoFormComponent} from "./components/proventos/provento-form/provento-form.component";
import {DespesasFixasComponent} from "./components/despesas/despesas-fixas/despesas-fixas.component";
import {DespesasRecorrentesComponent} from "./components/despesas/despesas-recorrentes/despesas-recorrentes.component";
import { AccountComponent } from './components/contas/account/account.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';
import { RecuperarSenhaComponent } from './components/auth/recuperar-senha/recuperar-senha.component';
import { RedefinirSenhaComponent } from './components/auth/redefinir-senha/redefinir-senha.component';
import { CriarUsuarioComponent } from './components/auth/criar-usuario/criar-usuario.component';
import { RelatorioMensalComponent } from './components/relatorios/relatorio-mensal/relatorio-mensal.component';
import { ContaFixaRecorrenteComponent } from './components/despesas/conta-fixa-recorrente/conta-fixa-recorrente.component';
import { NotificacoesComponent } from './components/notificacoes/notificacoes/notificacoes.component';
import { NotificacoesEmailConfigComponent } from './components/notificacoes/notificacoes-email-config/notificacoes-email-config.component';
import { MinhaContaComponent } from './components/admin/minha-conta/minha-conta.component';
import { ReservaEmergenciaComponent } from './components/reserva-emergencia/reserva-emergencia/reserva-emergencia.component';
import { ReservaEmergenciaFormComponent } from './components/reserva-emergencia/reserva-emergencia-form/reserva-emergencia-form.component';
import { BudgetRuleComponent } from './components/dashboard/budget-rule/budget-rule.component';
import { ListTransacoesComponent } from './components/transacoes/list-transacoes/list-transacoes.component';
import { TransacaoDetalheComponent } from './components/transacoes/transacao-detalhe/transacao-detalhe.component';
import { CompraParceladaFormComponent } from './components/compras/compra-parcelada-form/compra-parcelada-form.component';
import { ListComprasParceladasComponent } from './components/compras/list-compras-parceladas/list-compras-parceladas.component';
import { ListPagamentosStatusComponent } from './components/despesas/list-pagamentos-status/list-pagamentos-status.component';
import { TenantConfigComponent } from './components/admin/tenant-config/tenant-config.component';
import { HomeComponent } from './components/shell/home/home.component';
import { ListUsuariosComponent } from './components/admin/list-usuarios/list-usuarios.component';
import { CompraDebitoFormComponent } from './components/compras/compra-debito-form/compra-debito-form.component';
import { ListComprasDebitoComponent } from './components/compras/list-compras-debito/list-compras-debito.component';
import { ComparativoMensalComponent } from './components/relatorios/comparativo-mensal/comparativo-mensal.component';
import { BillingComponent } from './components/billing/billing/billing.component';
import { BillingSucessoComponent } from './components/billing/billing-sucesso/billing-sucesso.component';
import { BillingCanceladoComponent } from './components/billing/billing-cancelado/billing-cancelado.component';
import { ComprovantesListComponent } from './components/cartao/comprovantes-list/comprovantes-list.component';
import { NotFoundComponent } from './components/shell/not-found/not-found.component';
import { PoliticaPrivacidadeComponent } from './components/legal/politica-privacidade/politica-privacidade.component';
import { TermosUsoComponent } from './components/legal/termos-uso/termos-uso.component';


const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [NoAuthGuard]},
  {path: 'home', component: HomeComponent, canActivate: [NoAuthGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {
    path: 'cartao',
    loadChildren: () => import('./components/cartao/cartao.routes').then(m => m.CARTAO_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'categoria-form',
    loadComponent: () => import('./components/categoria/categoria-container/categoria-container.component').then(m => m.CategoriaContainerComponent),
    canActivate: [AuthGuard]
  },
  {path: 'provento-form', component: ProventoFormComponent, canActivate: [AuthGuard]},
  {path: 'despesas-fixas', component: DespesasFixasComponent, canActivate: [AuthGuard]},
  {path: 'conta-fixa-recorrente', component: ContaFixaRecorrenteComponent, canActivate: [AuthGuard]},
  {path: 'despesas-recorrentes', component: DespesasRecorrentesComponent, canActivate: [AuthGuard]},
  {path: 'notificacoes', component: NotificacoesComponent, canActivate: [AuthGuard]},
  {path: 'notificacoes-email-config', component: NotificacoesEmailConfigComponent, canActivate: [AuthGuard]},
  {path: 'list-pagamentos-status', component: ListPagamentosStatusComponent, canActivate: [AuthGuard]},
  {path: 'account', component: AccountComponent, canActivate: [AuthGuard]},
  {path: 'minha-conta', component: MinhaContaComponent, canActivate: [AuthGuard]},
  {path: 'budget-rule', component: BudgetRuleComponent, canActivate: [AuthGuard]},
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
  {path: 'billing', component: BillingComponent, canActivate: [AuthGuard]},
  {path: 'billing/sucesso', component: BillingSucessoComponent, canActivate: [AuthGuard]},
  {path: 'billing/cancelado', component: BillingCanceladoComponent, canActivate: [AuthGuard]},
  {path: 'tenant-config', component: TenantConfigComponent, canActivate: [AuthGuard]},
  {path: 'list-usuarios', component: ListUsuariosComponent, canActivate: [AuthGuard]},
  {path: 'comprovantes', component: ComprovantesListComponent, canActivate: [AuthGuard]},
  {path: 'politica-privacidade', component: PoliticaPrivacidadeComponent},
  {path: 'termos-uso', component: TermosUsoComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
