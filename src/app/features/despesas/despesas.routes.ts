import { Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';
import { DespesasFixasComponent } from '@components/despesas/despesas-fixas/despesas-fixas.component';
import { DespesasRecorrentesComponent } from '@components/despesas/despesas-recorrentes/despesas-recorrentes.component';
import { ContaFixaRecorrenteComponent } from '@components/despesas/conta-fixa-recorrente/conta-fixa-recorrente.component';
import { ListPagamentosStatusComponent } from '@components/despesas/list-pagamentos-status/list-pagamentos-status.component';

export const DESPESAS_ROUTES: Routes = [
  { path: 'fixas', component: DespesasFixasComponent, canActivate: [AuthGuard] },
  { path: 'recorrentes', component: DespesasRecorrentesComponent, canActivate: [AuthGuard] },
  { path: 'conta-fixa-recorrente', component: ContaFixaRecorrenteComponent, canActivate: [AuthGuard] },
  { path: 'pagamentos-status', component: ListPagamentosStatusComponent, canActivate: [AuthGuard] }
];
