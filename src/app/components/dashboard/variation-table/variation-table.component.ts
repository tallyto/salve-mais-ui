import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { VariationData } from '../../../services/dashboard.service';

@Component({
  selector: 'app-variation-table',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './variation-table.component.html',
  styleUrls: ['./variation-table.component.css']
})
export class VariationTableComponent {
  @Input() data: VariationData[] = [];

  getTrendClass(trend: string): string {
    switch (trend) {
      case 'up': return 'trend-positive';
      case 'down': return 'trend-negative';
      default: return 'trend-neutral';
    }
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'up': return 'keyboard_arrow_up';
      case 'down': return 'keyboard_arrow_down';
      default: return 'remove';
    }
  }
}
