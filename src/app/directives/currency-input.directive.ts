import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCurrencyInput]',
  standalone: false
})
export class CurrencyInputDirective implements OnInit {
  private decimalSeparator = ',';
  private thousandSeparator = '.';
  
  constructor(
    private el: ElementRef,
    private control: NgControl
  ) {}

  ngOnInit() {
    // Formata o valor inicial se existir
    if (this.control.value) {
      this.formatValue(this.control.value);
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    let value = event.target.value;
    
    // Remove tudo que não é número
    value = value.replace(/\D/g, '');
    
    if (value === '') {
      this.control.control?.setValue(null);
      this.el.nativeElement.value = '';
      return;
    }

    // Limita a 10 dígitos (99.999.999,99 - quase 100 milhões)
    if (value.length > 10) {
      value = value.substring(0, 10);
    }

    // Converte para número com centavos
    const numericValue = parseFloat(value) / 100;
    
    // Atualiza o valor do controle com o número
    this.control.control?.setValue(numericValue, { emitEvent: false });
    
    // Formata o valor para exibição
    this.formatValue(numericValue);
  }

  @HostListener('blur', ['$event'])
  onBlur(event: any): void {
    const value = this.control.value;
    if (value !== null && value !== undefined) {
      this.formatValue(value);
    }
  }

  @HostListener('focus', ['$event'])
  onFocus(event: any): void {
    const value = this.control.value;
    if (value !== null && value !== undefined) {
      this.formatValue(value);
    }
  }

  private formatValue(value: number): void {
    if (value === null || value === undefined || isNaN(value)) {
      this.el.nativeElement.value = '';
      return;
    }

    // Formata o valor com separadores
    const formattedValue = this.formatCurrency(value);
    this.el.nativeElement.value = formattedValue;
  }

  private formatCurrency(value: number): string {
    // Converte para string com 2 casas decimais
    const parts = value.toFixed(2).split('.');
    
    // Adiciona separador de milhares
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandSeparator);
    
    // Junta com separador decimal
    return parts.join(this.decimalSeparator);
  }
}
