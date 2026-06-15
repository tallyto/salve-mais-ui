import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-skeleton-reserva',
  standalone: true,
  imports: [CommonModule, CardModule, SkeletonModule],
  template: `
    <div class="grid">
      <div class="col-12">
        <p-card>
          <div class="flex align-items-center gap-3 mb-4">
            <p-skeleton shape="circle" size="3rem"></p-skeleton>
            <div class="flex flex-column gap-2 flex-1">
              <p-skeleton height="1.25rem" width="30%"></p-skeleton>
              <p-skeleton height="0.75rem" width="50%"></p-skeleton>
            </div>
          </div>
          <p-skeleton height="1rem" styleClass="mb-2"></p-skeleton>
          <p-skeleton height="0.5rem" styleClass="mb-4"></p-skeleton>
          <div class="flex gap-2">
            <p-skeleton height="2.25rem" width="8rem"></p-skeleton>
            <p-skeleton height="2.25rem" width="8rem"></p-skeleton>
          </div>
        </p-card>
      </div>
      <div class="col-12 lg:col-8">
        <p-card>
          <p-skeleton height="10rem"></p-skeleton>
        </p-card>
      </div>
      <div class="col-12 lg:col-4">
        <p-card>
          <p-skeleton height="10rem"></p-skeleton>
        </p-card>
      </div>
    </div>
  `,
  styles: []
})
export class SkeletonReservaComponent {}
