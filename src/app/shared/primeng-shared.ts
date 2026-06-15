import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MessageModule } from 'primeng/message';
import { PaginatorModule } from 'primeng/paginator';
import { PasswordModule } from 'primeng/password';
import { PopoverModule } from 'primeng/popover';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

/** Imports básicos presentes em quase todos os componentes standalone */
export const SALVE_COMMON = [
  CommonModule,
  RouterModule,
  ButtonModule,
  CardModule,
  TooltipModule,
  TagModule,
  DividerModule,
  ToastModule,
] as const;

/** Imports para componentes com formulários reativos */
export const SALVE_FORMS = [
  FormsModule,
  ReactiveFormsModule,
  InputTextModule,
  FloatLabelModule,
  SelectModule,
  PasswordModule,
  CheckboxModule,
  DatePickerModule,
  InputNumberModule,
  RadioButtonModule,
  TextareaModule,
  IconFieldModule,
  InputIconModule,
] as const;

/** Imports para componentes com tabelas e dados */
export const SALVE_DATA = [
  TableModule,
  TabsModule,
  ProgressBarModule,
  SkeletonModule,
  ProgressSpinnerModule,
  PaginatorModule,
  MenuModule,
] as const;

/** Imports para overlays e feedback */
export const SALVE_OVERLAY = [
  DialogModule,
  PopoverModule,
  MessageModule,
  AccordionModule,
] as const;

/** Conjunto completo para páginas feature-rich */
export const SALVE_ALL = [
  ...SALVE_COMMON,
  ...SALVE_FORMS,
  ...SALVE_DATA,
  ...SALVE_OVERLAY,
] as const;
