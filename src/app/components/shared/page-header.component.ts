import { Component, Input } from '@angular/core';
import { SALVE_COMMON } from '../../shared/primeng-shared';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [...SALVE_COMMON],
  template: `
    <div class="flex align-items-center justify-content-between">
      <div class="flex align-items-center gap-3">
        <i *ngIf="icon" [class]="'pi ' + icon + ' text-3xl text-primary'"></i>
        <div>
          <h2 class="m-0 font-bold">{{ title }}</h2>
          <span *ngIf="subtitle" class="text-sm text-color-secondary">{{ subtitle }}</span>
        </div>
      </div>
      <ng-content></ng-content>
    </div>
  `
})
export class PageHeaderComponent {
  @Input() icon?: string;
  @Input() title: string = '';
  @Input() subtitle?: string;
}
