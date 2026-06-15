import { Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';
import { ReservaEmergenciaComponent } from '@components/reserva-emergencia/reserva-emergencia/reserva-emergencia.component';
import { ReservaEmergenciaFormComponent } from '@components/reserva-emergencia/reserva-emergencia-form/reserva-emergencia-form.component';

export const RESERVA_EMERGENCIA_ROUTES: Routes = [
  { path: '', component: ReservaEmergenciaComponent, canActivate: [AuthGuard] },
  { path: 'criar', component: ReservaEmergenciaFormComponent, canActivate: [AuthGuard] },
  { path: 'editar/:id', component: ReservaEmergenciaFormComponent, canActivate: [AuthGuard] }
];
