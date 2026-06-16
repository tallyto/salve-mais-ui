import { Component } from '@angular/core';
import { SALVE_COMMON } from '@shared/primeng-shared';

@Component({
  selector: 'app-termos-uso',
  templateUrl: './termos-uso.component.html',
  standalone: true,
  imports: [...SALVE_COMMON]
})
export class TermosUsoComponent {
  currentYear = new Date().getFullYear();
}
