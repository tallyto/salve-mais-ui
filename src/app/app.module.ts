import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import localePt from '@angular/common/locales/pt';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// PrimeNG
import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DrawerModule } from 'primeng/drawer';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IftaLabelModule } from 'primeng/iftalabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { MenuModule } from 'primeng/menu';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PanelModule } from 'primeng/panel';
import { PasswordModule } from 'primeng/password';
import { PopoverModule } from 'primeng/popover';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { providePrimeNG } from 'primeng/config';
import { SalveMaisTheme } from './primeng-theme';

// ng2-charts
import { NgChartsModule } from 'ng2-charts';

// Routing
import { AppRoutingModule } from './app-routing.module';

// Interceptors
import { AuthInterceptor } from './services/auth.interceptor';
import { BillingInterceptor } from './services/billing.interceptor';

// Directive
import { CurrencyInputDirective } from './directives/currency-input.directive';

// Components (module-based)
import { AppComponent } from './app.component';
import { AccountComponent } from './components/account/account.component';
import { ComparativoMensalComponent } from './components/comparativo-mensal/comparativo-mensal.component';
import { CompraDebitoFormComponent } from './components/compra-debito-form/compra-debito-form.component';
import { ContaFixaRecorrenteComponent } from './components/conta-fixa-recorrente/conta-fixa-recorrente.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DespesasFixasComponent } from './components/despesas-fixas/despesas-fixas.component';
import { DespesasRecorrentesComponent } from './components/despesas-recorrentes/despesas-recorrentes.component';
import { ExpensePieChartComponent } from './components/expense-pie-chart/expense-pie-chart.component';
import { HomeComponent } from './components/home/home.component';
import { IncomeExpenseChartComponent } from './components/income-expense-chart/income-expense-chart.component';
import { ListAccountsComponent } from './components/list-accounts/list-accounts.component';
import { ListComprasDebitoComponent } from './components/list-compras-debito/list-compras-debito.component';
import { ListContasFixasComponent } from './components/list-contas-fixas/list-contas-fixas.component';
import { ListDespesasRecorrentesComponent } from './components/list-despesas-recorrentes/list-despesas-recorrentes.component';
import { ListProventosComponent } from './components/list-proventos/list-proventos.component';
import { MenuLateralComponent } from './components/menu-lateral/menu-lateral.component';
import { NotificacoesComponent } from './components/notificacoes/notificacoes.component';
import { NotificacoesEmailConfigComponent } from './components/notificacoes-email-config/notificacoes-email-config.component';
import { PagamentosStatusComponent } from './components/pagamentos-status/pagamentos-status.component';
import { ProventoFormComponent } from './components/provento-form/provento-form.component';
import { RelatorioMensalComponent } from './components/relatorio-mensal/relatorio-mensal.component';
import { ReservaEmergenciaComponent } from './components/reserva-emergencia/reserva-emergencia.component';
import { ReservaEmergenciaFormComponent } from './components/reserva-emergencia-form/reserva-emergencia-form.component';
import { SpendingTrendChartComponent } from './components/spending-trend-chart/spending-trend-chart.component';
import { TenantConfigComponent } from './components/tenant-config/tenant-config.component';
import { TransacaoDetalheComponent } from './components/transacao-detalhe/transacao-detalhe.component';
import { TransferenciaModalComponent } from './components/transferencia-modal/transferencia-modal.component';
// Standalone components
import { BillingCanceladoComponent } from './components/billing/billing-cancelado/billing-cancelado.component';
import { BillingComponent } from './components/billing/billing.component';
import { BillingSucessoComponent } from './components/billing/billing-sucesso/billing-sucesso.component';
import { CompraParceladaFormComponent } from './components/compra-parcelada-form/compra-parcelada-form.component';
import { ComprovantesListComponent } from './components/cartao/comprovantes-list/comprovantes-list.component';
import { FinancialHealthCardComponent } from './components/dashboard/financial-health-card/financial-health-card.component';
import { LimiteAlertasWidgetComponent } from './components/shared/limite-alertas-widget.component';
import { ActionButtonsComponent, PageHeaderComponent, EmptyStateComponent } from './components/shared';
import { ListComprasParceladasComponent } from './components/list-compras-parceladas/list-compras-parceladas.component';
import { ListTransacoesComponent } from './components/list-transacoes/list-transacoes.component';
import { LoginComponent } from './components/login/login.component';
import { MinhaContaComponent } from './components/minha-conta/minha-conta.component';
import { MonthYearFilterComponent } from './components/dashboard/month-year-filter/month-year-filter.component';
import { NotificacoesWidgetComponent } from './components/notificacoes-widget/notificacoes-widget.component';
import { RedefinirSenhaComponent } from './components/redefinir-senha/redefinir-senha.component';
import { RegisterComponent } from './components/register/register.component';
import { ReservaEmergenciaCardComponent } from './components/dashboard/reserva-emergencia-card/reserva-emergencia-card.component';
import { VariationTableComponent } from './components/dashboard/variation-table/variation-table.component';

registerLocaleData(localePt, 'pt-BR');

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MenuLateralComponent,
    ProventoFormComponent,
    DespesasFixasComponent,
    DespesasRecorrentesComponent,
    ListDespesasRecorrentesComponent,
    ListContasFixasComponent,
    ListProventosComponent,
    SpendingTrendChartComponent,
    IncomeExpenseChartComponent,
    ExpensePieChartComponent,
    RelatorioMensalComponent,
    NotificacoesEmailConfigComponent,
    ContaFixaRecorrenteComponent,
    ReservaEmergenciaComponent,
    ReservaEmergenciaFormComponent,
    TransferenciaModalComponent,
    TransacaoDetalheComponent,
    PagamentosStatusComponent,
    HomeComponent,
    CompraDebitoFormComponent,
    ListComprasDebitoComponent,
    ComparativoMensalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgChartsModule,
    CurrencyInputDirective,
    // PrimeNG
    AccordionModule,
    AutoCompleteModule,
    AvatarModule,
    BadgeModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    ChipModule,
    ConfirmDialogModule,
    DatePickerModule,
    DialogModule,
    DividerModule,
    DrawerModule,
    DynamicDialogModule,
    FloatLabelModule,
    IftaLabelModule,
    IconFieldModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputIconModule,
    InputNumberModule,
    InputTextModule,
    ListboxModule,
    MenuModule,
    MessageModule,
    MultiSelectModule,
    PaginatorModule,
    PanelMenuModule,
    PanelModule,
    PasswordModule,
    PopoverModule,
    ProgressBarModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    SelectModule,
    SelectButtonModule,
    SkeletonModule,
    TableModule,
    TabsModule,
    TagModule,
    TextareaModule,
    ToastModule,
    ToggleSwitchModule,
    ToolbarModule,
    TooltipModule,
    // Newly standalone components (Phase 5)
    TenantConfigComponent,
    NotificacoesComponent,
    // Newly standalone components (Phase 6) - Conversion of EventEmitter → BehaviorSubject
    AccountComponent,
    ListAccountsComponent,
    // Other standalone components
    RegisterComponent,
    LoginComponent,
    RedefinirSenhaComponent,
    BillingComponent,
    BillingSucessoComponent,
    BillingCanceladoComponent,
    LimiteAlertasWidgetComponent,
    NotificacoesWidgetComponent,
    MonthYearFilterComponent,
    FinancialHealthCardComponent,
    ReservaEmergenciaCardComponent,
    VariationTableComponent,
    ListTransacoesComponent,
    CompraParceladaFormComponent,
    ListComprasParceladasComponent,
    ComprovantesListComponent,
    MinhaContaComponent,
    // Shared UI components
    ActionButtonsComponent,
    PageHeaderComponent,
    EmptyStateComponent,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: BillingInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    provideHttpClient(withInterceptorsFromDi()),
    providePrimeNG({
      theme: {
        preset: SalveMaisTheme,
        options: {
          darkModeSelector: 'html.dark-mode',
          cssLayer: false
        }
      }
    }),
    MessageService,
    ConfirmationService,
    DialogService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
