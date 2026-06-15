import { Component } from '@angular/core';
import { SALVE_COMMON } from '../../shared/primeng-shared';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [...SALVE_COMMON],
  template: `
    <div class="flex flex-column align-items-center justify-content-center text-center px-4"
         style="min-height: 100vh; background: var(--surface-ground);">

      <div class="flex align-items-center justify-content-center border-round-full mb-5"
           style="width:100px;height:100px;background:var(--primary-50);">
        <i class="pi pi-map text-primary" style="font-size:3rem;"></i>
      </div>

      <h1 class="m-0 font-bold" style="font-size:6rem;line-height:1;letter-spacing:-0.04em;color:var(--primary-300);">404</h1>
      <h2 class="mt-3 mb-2 text-2xl font-bold">Página não encontrada</h2>
      <p class="text-color-secondary m-0 mb-5" style="max-width:380px;line-height:1.7;">
        A página que você procura não existe ou foi movida. Verifique o endereço ou volte para o início.
      </p>

      <div class="flex gap-3 flex-wrap justify-content-center">
        <p-button label="Voltar ao dashboard" icon="pi pi-home" routerLink="/dashboard"></p-button>
        <p-button label="Ir para o início" icon="pi pi-arrow-left" variant="outlined" routerLink="/"></p-button>
      </div>

    </div>
  `
})
export class NotFoundComponent {}
