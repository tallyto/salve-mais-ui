# Salve Mais UI — Guia para Agentes Claude

## O que é este projeto

Plataforma SaaS de gestão financeira pessoal e multi-tenant. Versão atual: **2.0.0**.
O usuário gerencia contas bancárias, cartões de crédito, compras parceladas, despesas fixas/recorrentes, receitas, reserva de emergência e planos de aposentadoria. O produto tem billing próprio com planos de assinatura.

## Stack

- **Angular 19** com TypeScript 5.8
- **PrimeNG 19** + **PrimeFlex 3** + **PrimeIcons** — design system principal (migração de Angular Material concluída na v2.0)
- **ng2-charts / Chart.js 4** — gráficos financeiros no dashboard
- **RxJS 7** — toda reatividade via Observables; **sem NgRx nem Signals**
- **JWT** para autenticação multi-tenant (token em `localStorage`)
- **HttpClient** com dois interceptors: `AuthInterceptor` e `BillingInterceptor`
- Karma + Jasmine para testes

## Estrutura de pastas relevante

```
src/app/
├── components/     # 53+ componentes organizados por feature
├── services/       # 27 serviços, todos providedIn: 'root'
├── models/         # Interfaces/DTOs de domínio
├── directives/     # currency-input.directive
├── guards/         # AuthGuard, NoAuthGuard
└── primeng-theme.ts  # Preset Aura/teal customizado

.claude/
└── agents/         # Prompts dos agentes especializados
```

> `.claude/handoff/` está no `.gitignore` — não versionar arquivos de handoff.

## Padrões obrigatórios

- **Idioma do código:** Português BR para nomes de domínio (ex: `fatura`, `provento`, `reserva`), inglês para padrões técnicos (service, component, guard).
- **Novos componentes:** preferir **standalone** (Angular 19 style).
- **Estado:** sem NgRx. Use serviços RxJS com `BehaviorSubject` quando precisar de estado compartilhado.
- **API:** nunca chame `HttpClient` direto nos componentes — sempre via serviço.
- **Erros HTTP:** use `ErrorHandlerService`; 402 é tratado pelo `BillingInterceptor`.
- **Moeda:** sempre formatar com `currency-input.directive` ou o pipe `currency:'BRL'`.
- **Sem comentários óbvios** — código bem nomeado se explica; comente só o "porquê" não óbvio.

## Padrão visual obrigatório — PrimeNG

O design system usa **PrimeNG 19 (tema Aura/teal)** + **PrimeFlex** para layout.

### Regras inegociáveis

- `*.component.css` permanecem **vazios** — zero CSS local.
- Layout usa PrimeFlex: `grid`, `col-*`, `flex`, `gap-*`, `p-*`, `m-*`, `justify-content-*`, `align-items-*`, `w-full`.
- Ícones: **PrimeIcons** — `<i class="pi pi-nome-icone"></i>`, nunca `mat-icon`.
- Não use emojis.
- `style=""` inline só para valores dinâmicos inevitáveis (cor calculada em runtime).
- Classes de produto (`.kpi-card`, `.kpi-label`, etc.) definidas em `src/styles.scss` — use-as.
- **`class="w-full"` em componentes PrimeNG NÃO funciona** — use sempre `styleClass="w-full"`. Para `p-password` use também `inputStyleClass="w-full"`.

### Armadilhas conhecidas (NÃO repita)

```html
<!-- ERRADO: class em componente PrimeNG não aplica no input interno -->
<p-datepicker class="w-full">
<p-select class="w-full">
<p-password class="w-full">

<!-- CORRETO -->
<p-datepicker styleClass="w-full">
<p-select styleClass="w-full">
<p-password styleClass="w-full" inputStyleClass="w-full">
```

```html
<!-- ERRADO: grid com gap quebra colunas -->
<div class="grid gap-3"><div class="col-6">

<!-- CORRETO -->
<div class="grid"><div class="col-6">
```

```html
<!-- ERRADO: p-button com class não aplica no button interno -->
<p-button class="w-full">

<!-- CORRETO -->
<p-button styleClass="w-full">
```

```html
<!-- ERRADO: floatlabel com placeholder duplica label -->
<p-floatlabel>
  <input placeholder="Ex: João">
  <label>Nome</label>
</p-floatlabel>

<!-- CORRETO: sem placeholder -->
<p-floatlabel>
  <input pInputText id="nome">
  <label for="nome">Nome</label>
</p-floatlabel>
```

```html
<!-- ERRADO: p-table lazy com *ngIf causa loop infinito -->
<div *ngIf="loading"><p-progressspinner></div>
<p-table *ngIf="!loading" [lazy]="true">

<!-- CORRETO -->
<p-table [lazy]="true" [loading]="loading">
```

```typescript
// ERRADO: ícones Material em contexto PrimeNG
getTrendIcon() { return 'keyboard_arrow_up'; }

// CORRETO
getTrendIcon() { return 'pi-arrow-up'; }
```

```typescript
// ERRADO: ícones no menu com prefixo
icon: 'pi-wallet'

// CORRETO: só o sufixo (o template adiciona 'pi-' via [ngClass])
icon: 'wallet'
```

### Padrão de página

```html
<section class="p-4 flex flex-column gap-4">
  <div class="flex align-items-center justify-content-between">
    <div class="flex align-items-center gap-3">
      <i class="pi pi-nome text-3xl text-primary"></i>
      <div>
        <h2 class="m-0 font-bold">Título da Página</h2>
        <span class="text-sm text-color-secondary">Subtítulo opcional</span>
      </div>
    </div>
    <p-button label="Ação principal" icon="pi pi-plus"></p-button>
  </div>

  <!-- conteúdo -->
</section>
```

### KPI Card

```html
<p-card class="kpi-card kpi-positive">
  <div class="flex justify-content-between align-items-start p-2">
    <div>
      <div class="kpi-label">RECEITAS DO MÊS</div>
      <div class="kpi-value">R$ 1.034,57</div>
      <div class="kpi-trend">+12% vs mês anterior</div>
    </div>
    <i class="pi pi-wallet kpi-icon"></i>
  </div>
</p-card>
```

### Tabela padrão

```html
<p-table [value]="items" [paginator]="true" [rows]="10" [loading]="isLoading"
         [globalFilterFields]="['nome']" dataKey="id" styleClass="p-datatable-sm">
  <ng-template pTemplate="header">
    <tr>
      <th pSortableColumn="nome">Nome <p-sortIcon field="nome"></p-sortIcon></th>
      <th>Ações</th>
    </tr>
  </ng-template>
  <ng-template pTemplate="body" let-item>
    <tr>
      <td>{{ item.nome }}</td>
      <td>
        <p-button icon="pi pi-pencil" [rounded]="true" [text]="true" (onClick)="editar(item)"></p-button>
        <p-button icon="pi pi-trash" [rounded]="true" [text]="true" severity="danger" (onClick)="excluir(item)"></p-button>
      </td>
    </tr>
  </ng-template>
  <ng-template pTemplate="emptymessage">
    <tr><td colspan="2">
      <div class="flex flex-column align-items-center gap-2 p-5">
        <i class="pi pi-inbox text-4xl text-color-secondary"></i>
        <span>Nenhum item encontrado.</span>
      </div>
    </td></tr>
  </ng-template>
</p-table>
```

### Formulário padrão

```html
<p-card>
  <form [formGroup]="form" (ngSubmit)="salvar()">
    <div class="grid">
      <div class="col-12 md:col-6 pt-4">
        <p-floatlabel class="w-full">
          <input pInputText id="nome" formControlName="nome" class="w-full">
          <label for="nome">Nome</label>
        </p-floatlabel>
        <small class="p-error" *ngIf="form.get('nome')?.invalid && form.get('nome')?.touched">
          Campo obrigatório
        </small>
      </div>
    </div>
    <div class="flex justify-content-end gap-2 mt-3">
      <p-button label="Cancelar" variant="outlined" type="button" (onClick)="cancelar()"></p-button>
      <p-button label="Salvar" type="submit" [disabled]="form.invalid"></p-button>
    </div>
  </form>
</p-card>
```

### Dialog padrão

```html
<p-dialog [(visible)]="showDialog" header="Título" [modal]="true" [style]="{width:'500px'}">
  <!-- conteúdo -->
  <ng-template pTemplate="footer">
    <div class="flex justify-content-end gap-2">
      <p-button label="Cancelar" variant="outlined" (onClick)="showDialog=false"></p-button>
      <p-button label="Confirmar" (onClick)="confirmar()"></p-button>
    </div>
  </ng-template>
</p-dialog>
```

### Notificações

```typescript
constructor(private messageService: MessageService) {}

this.messageService.add({severity:'success', summary:'Sucesso', detail:'Operação realizada.'});
this.messageService.add({severity:'error', summary:'Erro', detail:'Algo deu errado.'});
```

### Blocos de info (NÃO usar p-card aninhado)

```html
<!-- ERRADO: p-card dentro de p-card -->
<p-card>
  <p-card>KPI</p-card>
</p-card>

<!-- CORRETO: surface-ground para info secundária -->
<div class="surface-ground border-round p-3 flex flex-column gap-2">
  <span class="font-semibold">Label</span>
  <span class="text-color-secondary">Valor</span>
</div>
```

### Componentes standalone — imports necessários

```typescript
imports: [
  CommonModule, FormsModule, ReactiveFormsModule,
  ButtonModule, CardModule, TableModule, DialogModule,
  InputTextModule, FloatLabelModule, SelectModule,
  ToastModule, DividerModule, TagModule, TooltipModule,
  // outros conforme necessário
]
```

### Mapeamento Angular Material → PrimeNG (referência histórica)

| Material | PrimeNG |
|---|---|
| `mat-button` | `<p-button label="X">` |
| `mat-stroked-button` | `<p-button label="X" variant="outlined">` |
| `mat-icon-button` | `<p-button icon="pi pi-x" [rounded]="true" [text]="true">` |
| `mat-card` | `<p-card>` |
| `mat-form-field` + `input matInput` | `<p-floatlabel><input pInputText id="x"><label for="x">Label</label></p-floatlabel>` |
| `mat-select` | `<p-select>` com `styleClass="w-full"` |
| `mat-datepicker` | `<p-datepicker dateFormat="dd/mm/yy" styleClass="w-full">` |
| `mat-table` | `<p-table [value]="items">` |
| `mat-tab-group` | `<p-tabs>` + `<p-tabpanel>` |
| `mat-dialog` | `<p-dialog [(visible)]="show">` |
| `MatSnackBar` | `MessageService.add(...)` |
| `mat-radio-group` | `<p-radiobutton>` por opção |
| `mat-checkbox` | `<p-checkbox [binary]="true">` |
| `matTooltip` | `[pTooltip]="texto" tooltipPosition="top"` |
| `mat-spinner` | `<p-progressspinner>` |
| `mat-progress-bar` | `<p-progressbar [value]="pct" [showValue]="false">` |

### Mapeamento de ícones (Material → PrimeIcons)

| Material | PrimeIcons |
|---|---|
| account_balance | pi-building |
| account_balance_wallet | pi-wallet |
| add / add_circle_outline | pi-plus / pi-plus-circle |
| analytics / show_chart | pi-chart-line |
| attach_money | pi-dollar |
| bar_chart | pi-chart-bar |
| calendar_today | pi-calendar |
| close | pi-times |
| credit_card | pi-credit-card |
| dark_mode / light_mode | pi-moon / pi-sun |
| dashboard | pi-th-large |
| delete | pi-trash |
| edit / create | pi-pencil |
| email | pi-envelope |
| exit_to_app | pi-sign-out |
| filter_list | pi-filter |
| home | pi-home |
| info | pi-info-circle |
| lock | pi-lock |
| menu | pi-bars |
| more_vert | pi-ellipsis-v |
| notifications | pi-bell |
| payments | pi-money-bill |
| people / group | pi-users |
| person | pi-user |
| pie_chart | pi-chart-pie |
| receipt | pi-receipt |
| savings | pi-wallet |
| search | pi-search |
| settings | pi-cog |
| shopping_cart | pi-shopping-cart |
| trending_up / trending_down | pi-arrow-up / pi-arrow-down |
| visibility / visibility_off | pi-eye / pi-eye-slash |
| warning | pi-exclamation-triangle |
| check_circle | pi-check-circle |

### Tokens de design (`src/styles.scss`)

- Paleta primária: Teal (#009688) — via `SalveMaisTheme` em `primeng-theme.ts`
- Dark mode: `html.dark-mode`
- Tokens CSS: `--salve-bg`, `--salve-sidebar-bg`, `--salve-card-border`, `--salve-card-shadow`, `--salve-toolbar-bg`
- Classes produto: `.kpi-card`, `.kpi-label`, `.kpi-value`, `.kpi-trend`, `.kpi-icon`, `.kpi-positive`, `.kpi-negative`, `.kpi-warning`

## Ambientes

| Ambiente | API Base |
|---|---|
| development | `https://salvemais.tallyto.com/api` |
| production  | `https://salvemais.tallyto.com/api` |

## Rotas

### Protegidas por AuthGuard

`/dashboard`, `/account`, `/cartao/*`, `/categoria-form`, `/transacoes`, `/billing`, `/admin-usuarios`, `/relatorio-mensal`, `/comparativo-mensal`, `/reserva-emergencia`, `/minha-conta`, `/tenant-config`

### Lazy-loaded

- `/cartao` → `CartaoModule` (redireciona para `/cartao/form`)
- `/categoria-form` → `CategoriaModule`

### Dev server

```bash
# NUNCA usar porta 4200 — reservada para o usuário
npx ng serve --port 4201 --open false
```

## Como os agentes devem trabalhar

1. **Leia** este `CLAUDE.md` antes de começar.
2. **Execute** o trabalho respeitando os padrões acima.
3. **Build** sempre antes de declarar tarefa concluída: `npx ng build --configuration development`.
4. **Não commite** `.claude/handoff/` — está no `.gitignore`.

Agentes disponíveis e seus focos estão em `.claude/agents/`.
