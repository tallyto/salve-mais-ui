import { Routes } from '@angular/router';
import { PoliticaPrivacidadeComponent } from '@components/legal/politica-privacidade/politica-privacidade.component';
import { TermosUsoComponent } from '@components/legal/termos-uso/termos-uso.component';

export const LEGAL_ROUTES: Routes = [
  { path: 'privacidade', component: PoliticaPrivacidadeComponent },
  { path: 'termos', component: TermosUsoComponent }
];
