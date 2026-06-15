import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-skeleton-table',
  standalone: true,
  imports: [CommonModule, SkeletonModule],
  template: `
    <div class="flex flex-column gap-3">
      <p-skeleton *ngFor="let i of rows" height="2.5rem"></p-skeleton>
    </div>
  `,
  styles: []
})
export class SkeletonTableComponent {
  @Input() rows: number[] = [1, 2, 3];
}
