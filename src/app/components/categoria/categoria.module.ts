import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ChipsModule } from 'primeng/chips';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';

import { CategoriaContainerComponent } from './categoria-container/categoria-container.component';
import { CategoriaFormComponent } from './categoria-form/categoria-form.component';
import { CategoriaListComponent } from './categoria-list/categoria-list.component';
import { CategoriaTypeChipComponent } from './categoria-type-chip/categoria-type-chip.component';

const routes: Routes = [
  {
    path: '',
    component: CategoriaContainerComponent
  }
];

@NgModule({
  declarations: [
    CategoriaContainerComponent,
    CategoriaFormComponent,
    CategoriaListComponent,
    CategoriaTypeChipComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),

    // PrimeNG
    CardModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    SelectModule,
    TableModule,
    TooltipModule,
    DialogModule,
    ToastModule,
    ChipsModule,
    DividerModule,
    CheckboxModule,
    ChipModule
  ],
  exports: [
    CategoriaContainerComponent,
    CategoriaFormComponent,
    CategoriaListComponent,
    CategoriaTypeChipComponent
  ]
})
export class CategoriaModule { }
