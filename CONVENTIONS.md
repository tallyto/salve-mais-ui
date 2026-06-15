# Convenções de Código — Salve Mais UI v2.0

> Documento de referência para nomenclatura, padrões e organização. **Todas as novas funcionalidades devem seguir estas convenções.**

---

## 1. Idioma

### Princípio
- **Nomes de domínio e conceitos**: Português BR (ex: `conta`, `fatura`, `provento`, `reserva`)
- **Padrões técnicos**: Inglês (ex: `component`, `service`, `guard`, `model`)
- **Métodos públicos**: Português BR (ex: `listar()`, `salvar()`, `obter()`)
- **Variáveis e propriedades**: Português BR (ex: `saldoTotal`, `dataVencimento`, `usuarioLogado`)

### Exemplo correto
```typescript
// ✅ Bom
export class ContasFixasService {
  listar(page: number, size: number): Observable<Page<ContaFixa>> { }
  salvar(contaFixa: ContaFixa): Observable<ContaFixa> { }
  obter(id: number): Observable<ContaFixa> { }
}

// ❌ Evitar
export class ContasFixasService {
  getContas(page: number, size: number): Observable<Page<ContaFixa>> { }
  createConta(contaFixa: ContaFixa): Observable<ContaFixa> { }
}
```

---

## 2. Componentes

### Nomenclatura de pastas e classes

**Padrão**: `kebab-case` para pastas, `PascalCase` para classes

```
src/app/components/
├── contas/
│   ├── account/                      # ✅ Pasta em kebab-case
│   │   └── account.component.ts      # Classe: AccountComponent
│   ├── list-accounts/
│   │   └── list-accounts.component.ts # Classe: ListAccountsComponent
│   └── transferencia-modal/
│       └── transferencia-modal.component.ts # Classe: TransferenciaModalComponent
```

### Padrões de sufixo (prefixo vs sufixo para listas)

**Padrão**: Use **prefixo `list-`** para componentes que exibem listas

```typescript
// ✅ Correto
list-contas-fixas/
list-despesas-recorrentes/
list-compras-debito/
list-proventos/

// ❌ Evitar
contas-fixas-list/
categoria-list/
```

### Modal vs Dialog

**Padrão**: 
- Use **`-modal`** para diálogos abertos via `DialogService.open()` que precisam passar dados
- Use **`-dialog`** para diálogos inline simples (menos comum)

```typescript
// ✅ Padrão modal (aberto via DialogService)
transferencia-modal/TransferenciaModalComponent
pagamento-fatura-modal/PagamentoFaturaModalComponent

// ⚠️ Aceitável (diálogos simples)
comprovantes-dialog/ComprovantesDialogComponent
```

### Standalone e Imports

**Padrão**: Todos os **novos** componentes devem ser `standalone: true`

```typescript
@Component({
  selector: 'app-list-contas',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    ...SALVE_COMMON, ...SALVE_FORMS, ...SALVE_DATA, ...SALVE_OVERLAY,
    ActionButtonsComponent, StatCardComponent
  ]
})
```

---

## 3. Serviços

### Nomenclatura

**Padrão**: `kebab-case` para arquivo, `PascalCase` + `Service` para classe

```
src/app/services/
├── contas-fixas.service.ts  # Classe: ContasFixasService (não Financa!)
├── gasto-cartao.service.ts  # Classe: GastoCartaoService
├── reserva-emergencia.service.ts # Classe: ReservaEmergenciaService
```

### Métodos CRUD — Padrão em Português BR

```typescript
export class ContasFixasService {
  // Listar com paginação
  listar(page: number, size: number, sort: string): Observable<Page<ContaFixa>> { }

  // Listar tudo
  listarTodas(): Observable<ContaFixa[]> { }

  // Obter um
  obter(id: number): Observable<ContaFixa> { }

  // Salvar (novo ou editar — POST ou PUT)
  salvar(contaFixa: ContaFixa): Observable<ContaFixa> { }

  // Atualizar (PUT)
  atualizar(contaFixa: ContaFixa): Observable<ContaFixa> { }

  // Excluir
  excluir(id: number): Observable<void> { }

  // Operações específicas (ex: transferência, backup)
  transferir(origem: number, destino: number, valor: number): Observable<void> { }
}
```

### ❌ Métodos EVITAR

```typescript
// ❌ Nunca misture idiomas no mesmo serviço
getContas()     // Inglês
salvarConta()   // Português misturado
createConta()   // Inglês novamente

// ❌ Abreviaturas vagas
getAll()        // Use: listarTodas()
getOne()        // Use: obter()
add()           // Use: salvar()
del()           // Use: excluir()
```

### State Management em Serviço

```typescript
export class ContasFixasService {
  private contasChanged$ = new BehaviorSubject<void>(undefined);

  constructor(private http: HttpClient) { }

  listar(): Observable<ContaFixa[]> { }

  salvar(contaFixa: ContaFixa): Observable<ContaFixa> {
    return this.http.post(...).pipe(
      tap(() => this.contasChanged$.next(undefined))
    );
  }

  // Exposição readonly para subscribers
  getContasChanged(): Observable<void> {
    return this.contasChanged$.asObservable();
  }
}
```

---

## 4. Modelos / DTOs / Interfaces

### Nomenclatura

**Padrão**: `PascalCase` para interfaces, `kebab-case` para arquivo

```
src/app/models/
├── conta.model.ts
│   export interface Conta { }
│   export interface ContaFixa extends Conta { }
│   export enum TipoConta { CORRENTE, POUPANCA, INVESTIMENTO }
│
├── fatura.model.ts
│   export interface Fatura { }
│   export interface ItemFatura { }
│
├── reserva-emergencia.model.ts
│   export interface ReservaEmergencia { }
│   export interface HistoricoContribuicao { }
```

### DTOs — Sufixo claro

```typescript
// Input (criação/edição)
export interface ContaFixaCriacaoDTO {
  nome: string;
  valor: number;
  dataVencimento: Date;
}

// Response (listagem com metadados)
export interface Page<T> {
  content: T[];
  totalElements: number;
  page: number;
  size: number;
}
```

### ❌ Evitar

```typescript
// ❌ Nomes genéricos/vagos
export interface Financa { }      // Use: ContaFixa
export interface Response { }     // Use: Page<T> ou XyzResponse
export interface Result { }       // Seja específico
export interface Data { }         // Genérico demais

// ❌ Mistura de idiomas no mesmo arquivo
export interface Conta { }
export interface GastoCartao { }  // Inconsistente — use: CompraCartao
```

---

## 5. Pastas e Domínios

### Estrutura por Domínio (12 domínios de negócio)

```
src/app/components/
├── auth/              # login, register, recuperar-senha, redefinir-senha
├── contas/            # account, list-accounts, transferencia-modal
├── compras/           # compra-parcelada-form, list-compras-parceladas, etc
├── despesas/          # despesas-fixas, list-contas-fixas, pagamentos-status
├── proventos/         # provento-form, list-proventos
├── transacoes/        # list-transacoes, transacao-detalhe
├── reserva-emergencia/# reserva-emergencia, reserva-emergencia-form
├── relatorios/        # relatorio-mensal, comparativo-mensal
├── admin/             # admin-usuarios, tenant-config, minha-conta
├── notificacoes/      # notificacoes, notificacoes-widget, notificacoes-email-config
├── shell/             # menu-lateral, home, not-found
├── legal/             # politica-privacidade, termos-uso
├── cartao/            # [lazy CartaoModule]
├── categoria/         # [lazy CategoriaModule]
├── billing/           # [lazy BillingModule]
├── dashboard/         # dashboard, financial-health-card, month-year-filter, etc
└── shared/            # page-header, action-buttons, empty-state, skeleton-loaders
```

### Imports entre domínios

**Padrão**: Use path aliases `@components/dominio/componente`

```typescript
// ✅ Correto
import { ContaFixaComponent } from '@components/despesas/conta-fixa-recorrente/conta-fixa-recorrente.component';

// ❌ Evitar (relativo)
import { ContaFixaComponent } from '../../despesas/conta-fixa-recorrente/conta-fixa-recorrente.component';
```

---

## 6. Guards, Directives, Pipes

### Nomenclatura

```
src/app/guards/
├── auth.guard.ts         # Classe: AuthGuard
└── no-auth.guard.ts      # Classe: NoAuthGuard

src/app/directives/
└── currency-input.directive.ts  # Classe: CurrencyInputDirective

src/app/pipes/
└── mask-cpf.pipe.ts      # Classe: MaskCpfPipe
```

---

## 7. Exports e Barrel Imports

### Shared Components — Barrel Export

```typescript
// src/app/components/shared/index.ts
export { PageHeaderComponent } from './page-header.component';
export { ActionButtonsComponent } from './action-buttons.component';
export { EmptyStateComponent } from './empty-state.component';
export { StatCardComponent } from './stat-card/stat-card.component';
export { SkeletonKpiComponent } from './skeleton-loaders/skeleton-kpi.component';
// ... etc
```

**Uso nos componentes:**
```typescript
// ✅ Correto
import { ActionButtonsComponent, EmptyStateComponent } from '@components/shared';

// ❌ Evitar
import { ActionButtonsComponent } from '@components/shared/action-buttons.component';
```

---

## 8. Path Aliases (tsconfig.json)

**Padrão consolidado:**

```json
"paths": {
  "@app/*": ["src/app/*"],
  "@components/*": ["src/app/components/*"],
  "@services/*": ["src/app/services/*"],
  "@models/*": ["src/app/models/*"],
  "@directives/*": ["src/app/directives/*"],
  "@guards/*": ["src/app/guards/*"],
  "@shared/*": ["src/app/shared/*"],
  "@utils/*": ["src/app/utils/*"],
  "@environments/*": ["src/environments/*"]
}
```

---

## 9. Checklist para Novos Componentes

- [ ] Pasta em `kebab-case`, classe em `PascalCase`
- [ ] `standalone: true` com imports adequados
- [ ] Nomes de negócio em PT-BR (ex: `conta`, não `account`)
- [ ] Se for lista, prefix `list-` (ex: `list-contas-fixas`)
- [ ] Se for modal, suffix `-modal` (ex: `transferencia-modal`)
- [ ] Zero CSS local (use PrimeFlex + design tokens)
- [ ] `styleClass` em PrimeNG (não `class`)
- [ ] Injete serviços, não chame HttpClient direto
- [ ] Use `@shared`, `@components/*` path aliases

---

## 10. Checklist para Novos Serviços

- [ ] Arquivo em `kebab-case`, classe em `PascalCase`
- [ ] Métodos em PT-BR: `listar()`, `obter()`, `salvar()`, `atualizar()`, `excluir()`
- [ ] `providedIn: 'root'`
- [ ] Nenhuma chamada direta de HttpClient fora do serviço
- [ ] Use `BehaviorSubject` para state compartilhado
- [ ] Expor state via `asObservable()`
- [ ] Erro handling via `ErrorHandlerService`

---

## 11. Situações de Ambiguidade — Decisões Documentadas

### `ContaFixa` vs `GastoCartao` vs `Compra`

| Conceito | Uso | Serviço | Componente |
|---|---|---|---|
| **ContaFixa** | Débito automático mensal em conta bancária | `ContasFixasService` | `despesas/` |
| **GastoCartao** | Compra no cartão de crédito (parcelado/à vista) | `GastoCartaoService` | `compras/` |
| **Compra** (genérica) | Transação de compra (débito ou cartão) | — | — |

**Decisão**: Manter ambos os modelos, pois representam fluxos diferentes no negócio.

### Duplicação: `AccountService` vs `ContaService` ❌

**Resolvido em v2.0.2**: Consolidado em `AccountService` apenas, com métodos em PT-BR.

---

## 12. Histórico de Mudanças

| Versão | Mudança | Status |
|---|---|---|
| v2.0.0 | Migração PrimeNG, componentes standalone iniciados | ✅ |
| v2.0.1 | Reorganização em 12 domínios (Phase 3) | ✅ |
| v2.0.2 | Nomenclatura crítica (guards, services) | ✅ |
| v2.0.3 | **TBD**: Padronizar métodos serviços, consolidar modelos | ⏳ |

