import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="expanded ? 'expanded' : 'compact'">
      <i [class]="'pi ' + icon + ' text-primary'"></i>
      <div>
        <span *ngIf="!expanded" class="font-semibold">{{ label }}</span>
        <h3 *ngIf="expanded" class="m-0 mb-1 font-semibold text-base">{{ label }}</h3>
        <span *ngIf="!expanded" class="text-color-secondary">{{ value }}</span>
        <p *ngIf="expanded" class="m-0 text-sm text-color-secondary">{{ value }}</p>
      </div>
    </div>
  `,
  styles: [`
    .compact {
      @apply surface-ground border-round p-3 flex flex-column gap-2;
    }

    .compact i {
      @apply text-primary;
    }

    .expanded {
      @apply surface-ground border-round p-3 flex gap-3 align-items-start;
    }

    .expanded i {
      @apply text-xl text-primary;
    }
  `]
})
export class InfoBlockComponent {
  @Input() label: string = '';
  @Input() value: string | number | null = '';
  @Input() icon: string = '';
  @Input() expanded: boolean = false;
}
