# Arquitetura — Salve Mais UI (Frontend)

> Guia de orientação para quem (humano ou agente) for continuar o desenvolvimento.
> Para o backend, ver `ARQUITETURA.md` no repo `salve-mais` (`/home/tallyto/projetos/salve-mais`).
> Para o backlog visual em andamento, ver `BACKLOG_UI_PROFISSIONAL.md`.

## Visão geral

Aplicação Angular (v19, baseada em **NgModules**, não standalone) + **Angular
Material** + PrimeFlex, consumindo a API REST do backend `salve-mais`
(multi-tenant). Tema visual: estilo "fintech/bancário" (referência Nubank/Inter).

## Rodar localmente

```bash
npm install
npm start              # ng serve --configuration=development (aponta para api.salvemais.tallyto.com)
npm run local          # ng serve --configuration=local (aponta para environment.local.ts)
```

> Não há (até o momento) backend acessível localmente nem credenciais de teste
> conhecidas — telas que dependem de API só puderam ser validadas via build de
> produção (AOT) e checagem de que rotas protegidas exigem `AuthGuard`. Se o
> backend ganhar um seed de dev (`DevDataSeeder`, perfil `dev`, usuário
> `teste@salvemais.com.br`/`teste123`), isso destrava testes manuais completos.

## Estrutura

```
src/app/
├── app.module.ts             — módulo raiz; registra todos os MatXxxModule e a maioria dos componentes
├── app-routing.module.ts     — rotas (a maioria eager; cartao/ e categoria/ são lazy modules)
├── components/               — um diretório por feature/tela (43 componentes no momento)
│   └── shared/               — ConfirmDialogComponent, LimiteAlertasWidgetComponent
├── services/                 — um service por domínio (HttpClient + Observable), guards, interceptors
├── models/                   — interfaces/tipos TS compartilhados
├── directives/, utils/
└── environments/             — environment.ts (dev/prod), environment.local.ts
```

A maior parte do app é **eager-loaded** via `app.module.ts` — só `cartao` e
`categoria` viraram lazy modules (`loadChildren`). Ao criar uma feature nova de
porte considerável, prefira seguir o padrão lazy (módulo próprio + rota com
`loadChildren`) em vez de inflar ainda mais o módulo raiz.

## Autenticação e multi-tenant no front

- `AuthService`: login/registro/recuperação de senha — token JWT salvo em
  `localStorage` (`'token'`).
- `AuthGuard` / `NoAuthGuard`: leem o token do `localStorage` e checam expiração
  (decodificando o payload do JWT) antes de liberar rotas protegidas/públicas.
- `AuthInterceptor`: injeta `Authorization: Bearer <token>` em toda requisição HTTP.
- `BillingInterceptor`: captura respostas **HTTP 402** (assinatura
  inadimplente/cancelada — ver `SubscriptionGuardFilter` no backend) e mostra um
  toast persistente (`MatSnackBar`) com ação "Regularizar" → navega para `/billing`.
- O domínio do tenant viaja dentro do JWT (claim) — o front não precisa montar
  cabeçalhos de tenant manualmente no dia a dia; o header `X-Private-Tenant` só
  aparece em fluxos sensíveis específicos como redefinição de senha (ver
  `INSTRUCTIONS.md` para o caso documentado).

## Padrão de tela (CRUD/listagem)

Praticamente toda tela de listagem/formulário segue o mesmo esqueleto de
classes CSS globais definidas em `src/styles.css` (consulte o dashboard como
referência de "telas já no padrão novo"):

- `.page-header` — cabeçalho da página (ícone, título, subtítulo, ações)
- `.content-card` — card branco com sombra leve envolvendo o conteúdo
- `.card-header` / `.section-title`
- `.data-table` — tabela com cabeçalho cinza e hover
- `.empty-state` — estado vazio (ícone + título + texto)
- `.loading-state`, `.form-container`, `.form-actions`, `.info-row` / `.info-label` / `.info-value`

Ao criar/ajustar uma tela, **reaproveite essas classes** em vez de estilizar do
zero — é o que mantém a UI consistente (e é exatamente o que o
`BACKLOG_UI_PROFISSIONAL.md` está tentando estender para todas as telas).

## Sistema de tema (paleta de marca)

Desde a v1.38.0, a paleta "fintech" vive como **variáveis CSS** em `:root`
(`src/styles.css`):

```
--primary-color / --primary-color-rgb / --primary-dark / --primary-light / --primary-border
--accent-color / --accent-light
--success-/--danger-/--warning-/--info-color (+ -light)
--text-color / --text-secondary / --text-muted
--surface-color / --background-color / --border-color
--radius-sm (8px) / --radius-md (12px) / --radius-lg (16px)
--shadow-sm / --shadow-md
--font-family / --font-size-xs..xl / --font-weight-regular/medium/semibold
```

Use **sempre** essas variáveis em CSS novo (cores, raio de borda, tipografia) —
não hex-codes soltos. O tema pré-pronto do Angular Material é o `indigo-pink`
(`angular.json`); ele foi escolhido por ser o mais próximo da nova paleta azul
sem precisar migrar `styles.css` → `.scss` (um tema 100% customizado via
`mat.define-theme`/M3 exige Sass — avaliar se vale a pena no futuro).

> Hex-codes de azul antigos (`#2196f3`, `#1976d2`, `#1565c0`, `#0d47a1`,
> `#e3f2fd`, `#90caf9`) já foram trocados pelas variáveis acima em ~26
> componentes + telas de autenticação. Cores usadas para **categorização
> semântica** (ex.: `.icon-purple`, gráficos, badges de tipo) são intencionais e
> não devem ser confundidas com "cor de marca esquecida".

## Workflow ao concluir uma fase/feature

1. Validar visualmente no navegador (rodar `ng serve`, navegar pelas telas
   afetadas — usar Playwright/headless se não houver display interativo).
2. `git add` + commit descritivo.
3. Atualizar `CHANGELOG.md`.
4. Bump de versão em `package.json`/`package-lock.json`
   (`npm version X.Y.Z --no-git-tag-version`).
5. Marcar item concluído no documento de backlog relevante
   (`BACKLOG_UI_PROFISSIONAL.md` para a reforma visual).

## Backlog ativo

`BACKLOG_UI_PROFISSIONAL.md` lista a reforma visual "fintech" em 6 frentes
(tema global → login → navegação → telas CRUD → componentes compartilhados →
polish). Item 1 (tema global) já está concluído (v1.38.0); siga a ordem
sugerida no arquivo, evitando fazer tudo de uma vez ("big bang") — prefira
sessões curtas por tela/área.
