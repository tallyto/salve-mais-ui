import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SALVE_COMMON } from '../../shared/primeng-shared';

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
        [pTooltip]="editTooltip"
        (onClick)="onEdit.emit()"
      ></p-button>
      <p-button
        icon="pi pi-trash"
        [rounded]="true"
        [text]="true"
        severity="danger"
        [pTooltip]="deleteTooltip"
        (onClick)="onDelete.emit()"
      ></p-button>
    </div>
  `
})
export class ActionButtonsComponent {
  @Input() editTooltip: string = 'Editar';
  @Input() deleteTooltip: string = 'Excluir';
  @Output() onEdit = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<void>();
}
