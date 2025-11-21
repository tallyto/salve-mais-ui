import { Component, Input } from '@angular/core';
import { TipoCategoria } from '../../../models/categoria.model';

@Component({
  selector: 'app-categoria-type-chip',
  templateUrl: './categoria-type-chip.component.html',
  styleUrls: ['./categoria-type-chip.component.css'],
  standalone: false
})
export class CategoriaTypeChipComponent {
  @Input() tipo!: TipoCategoria;

  /**
   * Retorna a classe CSS para o tipo de categoria
   */
  getTipoClass(): string {
    switch(this.tipo) {
      case TipoCategoria.NECESSIDADE:
        return 'tipo-necessidade';
      case TipoCategoria.DESEJO:
        return 'tipo-desejo';
      case TipoCategoria.ECONOMIA:
        return 'tipo-economia';
      default:
        return '';
    }
  }

  /**
   * Retorna o label para o tipo de categoria
   */
  getTipoLabel(): string {
    switch(this.tipo) {
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
}