import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoCategoria } from '@models/categoria.model';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'app-categoria-type-chip',
  templateUrl: './categoria-type-chip.component.html',
  standalone: true,
  imports: [CommonModule, ChipModule]
})
export class CategoriaTypeChipComponent {
  @Input() tipo!: TipoCategoria;

  getTipoIcon(): string {
    switch (this.tipo) {
      case TipoCategoria.NECESSIDADE:
        return 'briefcase';
      case TipoCategoria.DESEJO:
        return 'heart';
      case TipoCategoria.ECONOMIA:
        return 'wallet';
      default:
        return 'tag';
    }
  }

  getTipoLabel(): string {
    switch (this.tipo) {
      case TipoCategoria.NECESSIDADE:
        return 'Necessidade (50%)';
      case TipoCategoria.DESEJO:
        return 'Desejo (30%)';
      case TipoCategoria.ECONOMIA:
        return 'Economia (20%)';
      default:
        return this.tipo;
    }
  }

  getTipoSeverity(): 'success' | 'info' | 'warning' | 'danger' {
    switch (this.tipo) {
      case TipoCategoria.NECESSIDADE:
        return 'info';
      case TipoCategoria.DESEJO:
        return 'warning';
      case TipoCategoria.ECONOMIA:
        return 'success';
      default:
        return 'info';
    }
  }
}
