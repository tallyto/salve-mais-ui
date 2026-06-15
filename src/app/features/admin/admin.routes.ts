import { Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';
import { MinhaContaComponent } from '@components/admin/minha-conta/minha-conta.component';
import { TenantConfigComponent } from '@components/admin/tenant-config/tenant-config.component';
import { ListUsuariosComponent } from '@components/admin/list-usuarios/list-usuarios.component';
import { NotificacoesEmailConfigComponent } from '@components/notificacoes/notificacoes-email-config/notificacoes-email-config.component';

export const ADMIN_ROUTES: Routes = [
  { path: 'minha-conta', component: MinhaContaComponent, canActivate: [AuthGuard] },
  { path: 'tenant-config', component: TenantConfigComponent, canActivate: [AuthGuard] },
  { path: 'usuarios', component: ListUsuariosComponent, canActivate: [AuthGuard] },
  { path: 'notificacoes-email', component: NotificacoesEmailConfigComponent, canActivate: [AuthGuard] }
];
