import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-skeleton-chart',
  standalone: true,
  imports: [CommonModule, CardModule, SkeletonModule],
  template: `
    <div class="grid" [ngClass]="{ 'gap-4': split }">
      <div [ngClass]="split ? 'col-12 md:col-6' : 'col-12'">
        <p-card styleClass="h-full">
          <p-skeleton [height]="height"></p-skeleton>
        </p-card>
      </div>
      <div *ngIf="split" class="col-12 md:col-6">
        <p-card styleClass="h-full">
          <p-skeleton [height]="height"></p-skeleton>
        </p-card>
      </div>
    </div>
  `,
  styles: []
})
export class SkeletonChartComponent {
  @Input() height: string = '12rem';
  @Input() split: boolean = true;
}
