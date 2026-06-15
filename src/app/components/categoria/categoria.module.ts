import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CategoriaContainerComponent } from './categoria-container/categoria-container.component';
import { CategoriaFormComponent } from './categoria-form/categoria-form.component';
import { ListCategoriasComponent } from './list-categorias/list-categorias.component';
import { CategoriaTypeChipComponent } from './categoria-type-chip/categoria-type-chip.component';

const routes: Routes = [
  {
    path: '',
    component: CategoriaContainerComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    // Componentes standalone
    CategoriaContainerComponent,
    CategoriaFormComponent,
    ListCategoriasComponent,
    CategoriaTypeChipComponent
  ],
  exports: [
    CategoriaContainerComponent,
    CategoriaFormComponent,
    ListCategoriasComponent,
    CategoriaTypeChipComponent
  ]
})
export class CategoriaModule { }
