import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'salve-mais-theme';

  private _isDark = new BehaviorSubject<boolean>(this.loadPreference());
  isDark$ = this._isDark.asObservable();

  get isDark(): boolean {
    return this._isDark.value;
  }

  private loadPreference(): boolean {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored !== null) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  init(): void {
    this.apply(this._isDark.value);
  }

  toggle(): void {
    const next = !this._isDark.value;
    this._isDark.next(next);
    localStorage.setItem(this.STORAGE_KEY, next ? 'dark' : 'light');
    this.apply(next);
  }

  private apply(dark: boolean): void {
    document.documentElement.classList.toggle('dark-mode', dark);
    document.documentElement.classList.toggle('light-mode', !dark);
  }
}
