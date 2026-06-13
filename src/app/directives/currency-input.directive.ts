import { Directive, ElementRef, HostListener, OnDestroy, OnInit, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appCurrencyInput]',
  standalone: false
})
export class CurrencyInputDirective implements OnInit, OnDestroy {
  private decimalSeparator = ',';
  private thousandSeparator = '.';
  private _isUserInput = false;
  private _sub: Subscription | null = null;

  constructor(
    private el: ElementRef,
    @Optional() private control: NgControl | null
  ) {}

  ngOnInit() {
    const initialValue = this.control ? this.control.value : this.el.nativeElement.value;
    if (initialValue) {
      this.formatValue(initialValue);
    }

    // Reage a patchValue/setValue programático, mas só quando o campo não está em foco
    if (this.control?.valueChanges) {
      this._sub = this.control.valueChanges.subscribe(value => {
        const isFocused = document.activeElement === this.el.nativeElement;
        if (!this._isUserInput && !isFocused) {
          this.formatValue(value);
        }
      });
    }
  }

  ngOnDestroy() {
    this._sub?.unsubscribe();
  }

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    this._isUserInput = true;

    let value = event.target.value;
    value = value.replace(/\D/g, '');

    if (value === '') {
      this.control?.control?.setValue(null);
      this.el.nativeElement.value = '';
      this._isUserInput = false;
      return;
    }

    if (value.length > 10) {
      value = value.substring(0, 10);
    }

    const numericValue = parseFloat(value) / 100;

    // emitEvent: false garante que valueChanges não dispara durante digitação
    this.control?.control?.setValue(numericValue, { emitEvent: false });
    this.formatValue(numericValue);
    this._isUserInput = false;
  }

  @HostListener('focus', ['$event'])
  onFocus(_event: any): void {
    const value = this.control ? this.control.value : this.el.nativeElement.value;
    if (value !== null && value !== undefined) {
      this.formatValue(value);
    }
    // Seleciona todo o texto para que o próximo keystroke substitua o valor
    setTimeout(() => this.el.nativeElement.select(), 0);
  }

  @HostListener('blur', ['$event'])
  onBlur(_event: any): void {
    const value = this.control ? this.control.value : this.el.nativeElement.value;
    if (value !== null && value !== undefined) {
      this.formatValue(value);
    }
  }

  private formatValue(value: any): void {
    if (value === null || value === undefined || value === '') {
      this.el.nativeElement.value = '';
      return;
    }

    let numValue: number;

    if (typeof value === 'number') {
      numValue = value;
    } else {
      const str = String(value).trim();
      if (str.includes(',')) {
        // Formato brasileiro: "1.500,00"
        numValue = parseFloat(str.replace(/\./g, '').replace(',', '.'));
      } else {
        // Formato da API / numérico padrão: "1500.00" ou "1500"
        numValue = parseFloat(str);
      }
    }

    if (isNaN(numValue)) {
      this.el.nativeElement.value = '';
      return;
    }

    this.el.nativeElement.value = this.formatCurrency(numValue);
  }

  private formatCurrency(value: number): string {
    const parts = value.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandSeparator);
    return parts.join(this.decimalSeparator);
  }
}
