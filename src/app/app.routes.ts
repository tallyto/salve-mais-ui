import { Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';
import { NoAuthGuard } from '@guards/no-auth.guard';
import { DashboardComponent } from '@components/dashboard/dashboard.component';
import { ProventoFormComponent } from '@components/proventos/provento-form/provento-form.component';
import { AccountComponent } from '@components/contas/account/account.component';
import { RegisterComponent } from '@components/auth/register/register.component';
import { LoginComponent } from '@components/auth/login/login.component';
import { RecuperarSenhaComponent } from '@components/auth/recuperar-senha/recuperar-senha.component';
import { RedefinirSenhaComponent } from '@components/auth/redefinir-senha/redefinir-senha.component';
import { CriarUsuarioComponent } from '@components/auth/criar-usuario/criar-usuario.component';
import { NotificacoesComponent } from '@components/notificacoes/notificacoes/notificacoes.component';
import { BudgetRuleComponent } from '@components/dashboard/budget-rule/budget-rule.component';
import { HomeComponent } from '@components/shell/home/home.component';
import { NotFoundComponent } from '@components/shell/not-found/not-found.component';

export const APP_ROUTES: Routes = [
  // Rotas públicas
  { path: '', component: HomeComponent, canActivate: [NoAuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [NoAuthGuard] },

  // Rotas de autenticação
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'recuperar-senha', component: RecuperarSenhaComponent },
  { path: 'redefinir-senha', component: RedefinirSenhaComponent },
  { path: 'criar-usuario', component: CriarUsuarioComponent },

  // Rotas críticas no bundle inicial
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
  { path: 'notificacoes', component: NotificacoesComponent, canActivate: [AuthGuard] },
  { path: 'budget-rule', component: BudgetRuleComponent, canActivate: [AuthGuard] },
  { path: 'provento-form', component: ProventoFormComponent, canActivate: [AuthGuard] },

  // Rotas lazy-loaded por feature
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
  {
    path: 'despesas',
    loadChildren: () => import('./features/despesas/despesas.routes').then(m => m.DESPESAS_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'transacoes',
    loadChildren: () => import('./features/transacoes/transacoes.routes').then(m => m.TRANSACOES_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'compras',
    loadChildren: () => import('./features/compras/compras.routes').then(m => m.COMPRAS_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'relatorios',
    loadChildren: () => import('./features/relatorios/relatorios.routes').then(m => m.RELATORIOS_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'reserva-emergencia',
    loadChildren: () => import('./features/reserva-emergencia/reserva-emergencia.routes').then(m => m.RESERVA_EMERGENCIA_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'billing',
    loadChildren: () => import('./features/billing/billing.routes').then(m => m.BILLING_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'legal',
    loadChildren: () => import('./features/legal/legal.routes').then(m => m.LEGAL_ROUTES)
  },

  // Redirects dos paths antigos para novos (backward compatibility)
  { path: 'compras-parceladas', redirectTo: '/compras/parceladas', pathMatch: 'full' },
  { path: 'compras-parceladas/nova', redirectTo: '/compras/parceladas/nova', pathMatch: 'full' },
  { path: 'compras-parceladas/editar/:id', redirectTo: '/compras/parceladas/editar/:id', pathMatch: 'full' },
  { path: 'compras-debito', redirectTo: '/compras/debito', pathMatch: 'full' },
  { path: 'compras-debito/nova', redirectTo: '/compras/debito/nova', pathMatch: 'full' },
  { path: 'compras-debito/editar/:id', redirectTo: '/compras/debito/editar/:id', pathMatch: 'full' },
  { path: 'comprovantes', redirectTo: '/compras/comprovantes', pathMatch: 'full' },
  { path: 'transacao/:id', redirectTo: '/transacoes/:id', pathMatch: 'full' },
  { path: 'despesas-fixas', redirectTo: '/despesas/fixas', pathMatch: 'full' },
  { path: 'despesas-recorrentes', redirectTo: '/despesas/recorrentes', pathMatch: 'full' },
  { path: 'conta-fixa-recorrente', redirectTo: '/despesas/conta-fixa-recorrente', pathMatch: 'full' },
  { path: 'list-pagamentos-status', redirectTo: '/despesas/pagamentos-status', pathMatch: 'full' },
  { path: 'relatorio-mensal', redirectTo: '/relatorios/mensal', pathMatch: 'full' },
  { path: 'comparativo-mensal', redirectTo: '/relatorios/comparativo', pathMatch: 'full' },
  { path: 'minha-conta', redirectTo: '/admin/minha-conta', pathMatch: 'full' },
  { path: 'tenant-config', redirectTo: '/admin/tenant-config', pathMatch: 'full' },
  { path: 'list-usuarios', redirectTo: '/admin/usuarios', pathMatch: 'full' },
  { path: 'notificacoes-email-config', redirectTo: '/admin/notificacoes-email', pathMatch: 'full' },
  { path: 'politica-privacidade', redirectTo: '/legal/privacidade', pathMatch: 'full' },
  { path: 'termos-uso', redirectTo: '/legal/termos', pathMatch: 'full' },

  // Fallback
  { path: '**', component: NotFoundComponent }
];
