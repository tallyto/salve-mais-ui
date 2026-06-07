import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface Period {
  month: number;
  year: number;
}

@Component({
  selector: 'app-month-year-filter',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule
  ],
  templateUrl: './month-year-filter.component.html',
  styleUrls: ['./month-year-filter.component.css']
})
export class MonthYearFilterComponent {
  @Input() month!: number;
  @Input() year!: number;

  /** Emitido sempre que o usuário seleciona um novo período (mês/ano, navegação ou atalhos) */
  @Output() periodChange = new EventEmitter<Period>();

  readonly months: { value: number; label: string }[] = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];

  readonly years: number[] = this.generateYears();

  private generateYears(): number[] {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let i = currentYear - 3; i <= currentYear + 2; i++) {
      years.push(i);
    }
    return years;
  }

  private emitPeriod(month: number, year: number): void {
    this.periodChange.emit({ month, year });
  }

  onSelectionChange(): void {
    this.emitPeriod(this.month, this.year);
  }

  previousMonth(): void {
    if (this.month === 1) {
      this.emitPeriod(12, this.year - 1);
    } else {
      this.emitPeriod(this.month - 1, this.year);
    }
  }

  nextMonth(): void {
    if (this.month === 12) {
      this.emitPeriod(1, this.year + 1);
    } else {
      this.emitPeriod(this.month + 1, this.year);
    }
  }

  resetFilters(): void {
    const today = new Date();
    this.emitPeriod(today.getMonth() + 1, today.getFullYear());
  }

  setLastMonth(): void {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    this.emitPeriod(date.getMonth() + 1, date.getFullYear());
  }

  setNextMonth(): void {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    this.emitPeriod(date.getMonth() + 1, date.getFullYear());
  }

  isCurrentMonth(): boolean {
    const today = new Date();
    return this.month === today.getMonth() + 1 && this.year === today.getFullYear();
  }

  isLastMonth(): boolean {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return this.month === date.getMonth() + 1 && this.year === date.getFullYear();
  }

  isNextMonth(): boolean {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return this.month === date.getMonth() + 1 && this.year === date.getFullYear();
  }

  getSelectedPeriodText(): string {
    const monthName = this.months.find(m => m.value === this.month)?.label || '';
    return `${monthName} de ${this.year}`;
  }
}
