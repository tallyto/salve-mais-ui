import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-skeleton-kpi',
  standalone: true,
  imports: [CommonModule, CardModule, SkeletonModule],
  template: `
    <div class="grid mb-2">
      <div class="col-12 md:col-6 lg:col-3" *ngFor="let i of [1,2,3,4]">
        <p-card styleClass="dashboard-kpi-card h-full">
          <div class="flex justify-content-between align-items-start">
            <div class="flex flex-column gap-2 w-full">
              <p-skeleton width="6rem" height="0.75rem"></p-skeleton>
              <p-skeleton width="9rem" height="1.75rem"></p-skeleton>
              <p-skeleton width="7rem" height="0.75rem"></p-skeleton>
            </div>
            <p-skeleton shape="circle" size="2.5rem"></p-skeleton>
          </div>
        </p-card>
      </div>
    </div>
  `,
  styles: []
})
export class SkeletonKpiComponent {}
