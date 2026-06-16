import { Component } from '@angular/core';
import { SALVE_COMMON } from '@shared/primeng-shared';

@Component({
  selector: 'app-politica-privacidade',
  templateUrl: './politica-privacidade.component.html',
  standalone: true,
  imports: [...SALVE_COMMON]
})
export class PoliticaPrivacidadeComponent {
  currentYear = new Date().getFullYear();
}
