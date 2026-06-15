import { Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';
import { ListTransacoesComponent } from '@components/transacoes/list-transacoes/list-transacoes.component';
import { TransacaoDetalheComponent } from '@components/transacoes/transacao-detalhe/transacao-detalhe.component';

export const TRANSACOES_ROUTES: Routes = [
  { path: '', component: ListTransacoesComponent, canActivate: [AuthGuard] },
  { path: ':id', component: TransacaoDetalheComponent, canActivate: [AuthGuard] }
];
