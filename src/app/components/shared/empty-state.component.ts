import { Component, Input } from '@angular/core';
import { SALVE_COMMON } from '../../shared/primeng-shared';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [...SALVE_COMMON],
  template: `
    <div class="flex flex-column align-items-center gap-2 p-5">
      <i *ngIf="icon" [class]="'pi ' + icon + ' text-4xl text-color-secondary'"></i>
      <span>{{ message }}</span>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() icon: string = 'pi-inbox';
  @Input() message: string = 'Nenhum item encontrado.';
}
