import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { VariationData } from '../../../services/dashboard.service';

@Component({
  selector: 'app-variation-table',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './variation-table.component.html'
})
export class VariationTableComponent {
  @Input() data: VariationData[] = [];

  getTrendClass(trend: string): string {
    switch (trend) {
      case 'up': return 'font-bold text-green-600';
      case 'down': return 'font-bold text-red-600';
      default: return 'text-color-secondary';
    }
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'up': return 'pi-arrow-up';
      case 'down': return 'pi-arrow-down';
      default: return 'pi-minus';
    }
  }
}
