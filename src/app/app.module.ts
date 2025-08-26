import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, HttpClientModule } from '@angular/common/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatBadgeModule } from "@angular/material/badge";
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MAT_DATE_LOCALE, MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatChipsModule } from '@angular/material/chips';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from "@angular/router";
import { NgChartsModule } from 'ng2-charts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountComponent } from './components/account/account.component';
import { CartaoFormComponent } from './components/cartao-form/cartao-form.component';
import { CategoriaFormComponent } from './components/categoria-form/categoria-form.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DespesasRecorrentesComponent } from './components/despesas-recorrentes/despesas-recorrentes.component';
import { DespesasFixasComponent } from "./components/despesas-fixas/despesas-fixas.component";
import { ExpensePieChartComponent } from './components/expense-pie-chart/expense-pie-chart.component';
import { IncomeExpenseChartComponent } from './components/income-expense-chart/income-expense-chart.component';
import { ListAccountsComponent } from './components/list-accounts/list-accounts.component';
import { ListContasFixasComponent } from './components/list-contas-fixas/list-contas-fixas.component';
import { ListDespesasRecorrentesComponent } from './components/list-despesas-recorrentes/list-despesas-recorrentes.component';
import { ListProventosComponent } from './components/list-proventos/list-proventos.component';
import { LoginComponent } from './components/login/login.component';
import { MenuLateralComponent } from './components/menu-lateral/menu-lateral.component';
import { ProventoFormComponent } from './components/provento-form/provento-form.component';
import { RedefinirSenhaComponent } from './components/redefinir-senha/redefinir-senha.component';
import { RegisterComponent } from './components/register/register.component';
import { ReservaEmergenciaComponent } from './components/reserva-emergencia/reserva-emergencia.component';
import { ReservaEmergenciaFormComponent } from './components/reserva-emergencia-form/reserva-emergencia-form.component';
import { SpendingTrendChartComponent } from './components/spending-trend-chart/spending-trend-chart.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './components/shared/confirm-dialog/confirm-dialog.component';
import { RelatorioMensalComponent } from './components/relatorio-mensal/relatorio-mensal.component';
import { FaturaFormComponent } from './components/fatura-form/fatura-form.component';
import { LimiteAlertasWidgetComponent } from './components/shared/limite-alertas-widget.component';
import { CartaoLimitesComponent } from './components/cartao-limites/cartao-limites.component';
import { ContaFixaRecorrenteComponent } from './components/conta-fixa-recorrente/conta-fixa-recorrente.component';
import { PagamentoFaturaModalComponent } from './components/pagamento-fatura-modal/pagamento-fatura-modal.component';
import { ComprovantesDialogComponent } from './components/comprovantes-dialog/comprovantes-dialog.component';

import { NotificacoesComponent } from './components/notificacoes/notificacoes.component';
import { NotificacoesWidgetComponent } from './components/notificacoes-widget/notificacoes-widget.component';
import { MinhaContaComponent } from './components/minha-conta/minha-conta.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MenuLateralComponent,
    CartaoFormComponent,
    CategoriaFormComponent,
    ProventoFormComponent,
    DespesasFixasComponent,
    DespesasRecorrentesComponent,
    ListDespesasRecorrentesComponent,
    ListContasFixasComponent,
    ListProventosComponent,
    AccountComponent,
    ListAccountsComponent,
    SpendingTrendChartComponent,
    IncomeExpenseChartComponent,
    ExpensePieChartComponent,
    RedefinirSenhaComponent,
    ConfirmDialogComponent,
    RelatorioMensalComponent,
    FaturaFormComponent,
    PagamentoFaturaModalComponent,
    NotificacoesComponent,
    ContaFixaRecorrenteComponent,
    MinhaContaComponent,
    ComprovantesDialogComponent,
    ReservaEmergenciaComponent,
    ReservaEmergenciaFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatBadgeModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    RouterModule,
    MatIconModule,
    MatExpansionModule,
    MatTooltipModule,
    AppRoutingModule,
    HttpClientModule,
    MatCardModule,
    MatTableModule,
    MatSidenavModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSortModule,
    NgChartsModule,
    MatSlideToggleModule,
    RegisterComponent, // Importa o componente standalone
    LoginComponent,
    MatDialogModule,
    MatChipsModule,
    LimiteAlertasWidgetComponent, // Importa o widget standalone
    CartaoLimitesComponent, // Importa o componente standalone
    NotificacoesWidgetComponent // Importa o widget de notificações standalone
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
