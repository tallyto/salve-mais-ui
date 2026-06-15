import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SALVE_COMMON } from '@shared/primeng-shared';

@Component({
  selector: 'app-action-buttons',
  standalone: true,
  imports: [...SALVE_COMMON],
  template: `
    <div class="flex gap-2">
      <p-button
        icon="pi pi-pencil"
        [rounded]="true"
        [text]="true"
        pTooltip="Editar"
        tooltipPosition="top"
        (onClick)="onEdit()">
      </p-button>
      <p-button
        icon="pi pi-trash"
        [rounded]="true"
        [text]="true"
        severity="danger"
        pTooltip="Excluir"
        tooltipPosition="top"
        (onClick)="onDelete()">
      </p-button>
    </div>
  `,
  styles: []
})
export class ActionButtonsComponent {
  @Input() disabled: boolean = false;
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  onEdit(): void {
    if (!this.disabled) {
      this.edit.emit();
    }
  }

  onDelete(): void {
    if (!this.disabled) {
      this.delete.emit();
    }
  }
}
