# Salve Mais UI

Frontend Angular do **Salve Mais** — plataforma SaaS de gestão financeira pessoal e multi-tenant.

Versão atual: `2.0.0`

## O que é

O usuário gerencia contas bancárias, cartões de crédito, compras parceladas, despesas fixas/recorrentes, receitas, reserva de emergência e relatórios. O produto tem billing próprio com planos de assinatura.

## Stack

| Tecnologia | Versão | Papel |
|---|---|---|
| Angular | 19 | Framework principal |
| TypeScript | 5.8 | Linguagem |
| PrimeNG | 19 | Design system (tema Aura/teal) |
| PrimeFlex | 3 | Layout utilitário |
| PrimeIcons | — | Ícones |
| Chart.js / ng2-charts | 4 | Gráficos do dashboard |
| RxJS | 7 | Reatividade (sem NgRx) |
| Karma + Jasmine | — | Testes |

## Como rodar

```bash
npm install
npm start          # dev server → http://localhost:4200
npm run local      # usa environment.local.ts
npm run build      # build de produção
npm run build:dev  # build de desenvolvimento
```

## Ambientes

| Ambiente | API Base |
|---|---|
| development / production | `https://salvemais.tallyto.com/api` |
| local | configurável em `src/environments/environment.local.ts` |

## Estrutura

```
src/app/
├── components/        # 53+ componentes organizados por feature
│   ├── dashboard/     # Dashboard principal + widgets
│   ├── cartao/        # Módulo lazy: CartaoModule
│   ├── categoria/     # Módulo lazy: CategoriaModule
│   ├── billing/       # Plano & Cobrança
│   ├── admin-usuarios/
│   ├── menu-lateral/
│   └── shared/
├── services/          # 27 serviços (providedIn: 'root')
├── models/            # Interfaces e DTOs de domínio
├── directives/        # currency-input.directive
├── guards/            # AuthGuard, NoAuthGuard
└── primeng-theme.ts   # Preset Aura/teal customizado
```

## Autenticação e Multi-Tenant

- Token JWT salvo em `localStorage` com chave `token`
- `AuthInterceptor` injeta `Authorization: Bearer <token>` em todas as requisições
- `BillingInterceptor` trata HTTP 402 e redireciona para `/billing`
- `AuthGuard` / `NoAuthGuard` protegem as rotas

## Rotas protegidas

```
/dashboard  /account  /cartao/*  /categoria-form  /transacoes
/billing    /admin-usuarios      /relatorio-mensal
/comparativo-mensal              /reserva-emergencia
/minha-conta  /tenant-config
```

## Design System

O projeto usa **PrimeNG 19 com tema Aura/teal**. Consulte `CLAUDE.md` para os padrões completos de componentes, ícones e layout.

Classes globais de produto definidas em `src/styles.scss`:
`.kpi-card`, `.kpi-label`, `.kpi-value`, `.kpi-trend`, `.kpi-icon`, `.kpi-positive`, `.kpi-negative`, `.kpi-warning`

## Links

- Backend: `https://github.com/tallyto/salve-mais`
- Changelog: [CHANGELOG.md](CHANGELOG.md)
- Angular: `https://angular.dev`
- PrimeNG: `https://primeng.org`
