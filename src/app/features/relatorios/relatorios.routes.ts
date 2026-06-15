import { Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';
import { RelatorioMensalComponent } from '@components/relatorios/relatorio-mensal/relatorio-mensal.component';
import { ComparativoMensalComponent } from '@components/relatorios/comparativo-mensal/comparativo-mensal.component';

export const RELATORIOS_ROUTES: Routes = [
  { path: 'mensal', component: RelatorioMensalComponent, canActivate: [AuthGuard] },
  { path: 'comparativo', component: ComparativoMensalComponent, canActivate: [AuthGuard] }
];
