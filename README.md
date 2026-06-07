# Salve Mais UI

![Salve Mais UI](src/assets/images/brand-hero-v1.png)

Frontend Angular do Salve Mais, uma plataforma de gestao financeira pessoal e
multi-tenant para controlar receitas, despesas, contas, cartoes, faturas,
compras parceladas, notificacoes, billing e relatorios.

Versao atual: `1.41.0`

## Stack

- Angular 19
- Angular Material
- TypeScript
- Chart.js / ng2-charts
- RxJS
- PrimeFlex

## Funcionalidades

- Dashboard financeiro mensal com indicadores, graficos e comparativos.
- Gestao de contas bancarias, receitas, despesas fixas e recorrentes.
- Cartoes de credito, faturas, compras no credito/debito e compras parceladas.
- Categorias, transacoes, comprovantes, reserva de emergencia e relatorios.
- Notificacoes de vencimentos e configuracao de notificacoes por email.
- Autenticacao JWT, recuperacao/redefinicao de senha e fluxo multi-tenant.
- Billing SaaS com status de assinatura, planos e retorno de checkout.

## Como Rodar

```bash
npm install
npm start
```

O comando `npm start` executa `ng serve --configuration=development` e usa
`src/environments/environment.ts`, que aponta para:

```text
https://api.salvemais.tallyto.com/api
```

Para usar a configuracao local:

```bash
npm run local
```

Esse comando usa `src/environments/environment.local.ts`.

## Scripts

```bash
npm start       # servidor de desenvolvimento
npm run local   # servidor usando environment.local.ts
npm run build   # build de producao
npm run build:dev
npm run watch
npm test
```

Build validado no ambiente atual:

```bash
./node_modules/.bin/ng build
```

## Ambientes

- `environment.ts`: desenvolvimento apontando para API remota.
- `environment.local.ts`: configuracao local.
- `environment.prod.ts`: producao em `https://salvemais.tallyto.com/api`.

Backend:

- Repositorio: `https://github.com/tallyto/salve-mais`
- Projeto local esperado: `/home/tallyto/projetos/salve-mais`

## Estrutura

```text
src/app/
├── app.module.ts
├── app-routing.module.ts
├── components/
│   ├── dashboard/
│   ├── menu-lateral/
│   ├── login/
│   ├── register/
│   ├── billing/
│   ├── cartao/
│   ├── categoria/
│   └── shared/
├── services/
├── models/
├── directives/
├── utils/
└── environments/
```

A maior parte do app ainda e carregada via `app.module.ts`. Features maiores
devem preferir modulos lazy-loaded, seguindo o padrao ja usado em `cartao` e
`categoria`.

## Autenticacao e Multi-Tenant

- `AuthService` centraliza login, registro, recuperacao e redefinicao de senha.
- O token JWT e salvo em `localStorage` com a chave `token`.
- `AuthGuard` e `NoAuthGuard` validam rotas protegidas/publicas.
- `AuthInterceptor` injeta `Authorization: Bearer <token>` nas requisicoes.
- `BillingInterceptor` trata HTTP 402 e direciona o usuario para `/billing`.
- O tenant vem no JWT no uso normal do app.
- Em fluxos sensiveis, como redefinicao de senha, o dominio pode ser extraido da
  URL e enviado no header `X-Private-Tenant`.

## Padroes de UI

O visual atual segue uma linha fintech/bancaria. CSS novo deve reutilizar as
variaveis globais em `src/styles.css`, evitando hex-codes soltos para cores de
marca, raio, tipografia e sombras.

Variaveis principais:

```text
--primary-color
--primary-color-rgb
--primary-dark
--primary-light
--accent-color
--success-color
--danger-color
--warning-color
--info-color
--text-color
--text-secondary
--surface-color
--background-color
--border-color
--radius-sm
--radius-md
--radius-lg
--shadow-sm
--shadow-md
```

Classes globais de tela:

- `.page-header`
- `.content-card`
- `.card-header`
- `.section-title`
- `.data-table`
- `.empty-state`
- `.loading-state`
- `.form-container`
- `.form-actions`

Use o dashboard e as telas publicas de autenticacao como referencia para o
padrao visual mais recente.

## Roadmap de UI

Concluido:

- Tema global: paleta, tipografia, radius, sombras e troca gradual de cores
  antigas para variaveis CSS.
- Telas publicas: login, cadastro de tenant, recuperacao e redefinicao de senha.
- Menu lateral: marca, hierarquia visual, estados ativos e area de usuario no
  rodape.

Proximos focos sugeridos:

- Avaliar topbar fixa com breadcrumb, busca rapida e avatar.
- Padronizar `page-header` nas telas que ainda usam variacoes proprias.
- Evoluir listagens/CRUDs: contas, cartoes, transacoes, despesas, compras,
  receitas, categorias, reserva, relatorios, pagamentos, notificacoes e admin.
- Padronizar tabelas, badges, dialogs, empty states e responsividade mobile.

## Workflow de Desenvolvimento

1. Fazer a alteracao em escopo pequeno.
2. Validar com build e, quando possivel, no navegador.
3. Atualizar `CHANGELOG.md`.
4. Incrementar `package.json` e `package-lock.json` quando a mudanca for
   versionavel.
5. Criar commit descritivo.
6. Fazer push para o GitHub.

## Changelog

O historico de versoes fica somente em [CHANGELOG.md](CHANGELOG.md).

## Links

- Backend: `https://github.com/tallyto/salve-mais`
- Angular: `https://angular.dev`
- Angular Material: `https://material.angular.dev`
