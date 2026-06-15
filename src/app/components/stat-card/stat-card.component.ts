import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="surface-ground border-round p-3 h-full flex align-items-center justify-content-between gap-3">
      <div>
        <div class="text-sm text-color-secondary">{{ label }}</div>
        <div class="text-2xl font-bold">{{ value }}</div>
      </div>
      <i [class]="'pi ' + icon + ' text-3xl text-primary'"></i>
    </div>
  `,
  styles: [],
})
export class StatCardComponent {
  @Input() label: string = '';
  @Input() value: any;
  @Input() icon: string = '';
}
