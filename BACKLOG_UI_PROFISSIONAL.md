# Backlog — Plataforma com aspecto mais profissional

Objetivo: elevar o visual da plataforma inteira para um padrão "fintech/bancário"
(referência: Nubank, Inter) — cards arredondados, paleta com cor de marca mais viva,
identidade visual consistente entre todas as telas.

> Itens em ordem sugerida de execução (do que tem mais alavancagem para o que é
> mais pontual). Cada item pode virar uma sessão de trabalho separada.

---

## 1. Tema global (cores, tipografia, espaçamento) — alta prioridade

Hoje o app usa o tema pré-pronto `deeppurple-amber` do Angular Material
(`angular.json`), mas praticamente todas as telas sobrescrevem as cores na mão
com azul (`#2196f3`). Isso gera inconsistência entre componentes Material
(botões, selects, datepickers) e o restante da UI.

- [x] Definir paleta de marca "fintech" (cor primária + variações, cor de destaque,
      tons neutros) e documentar como variáveis CSS em `:root` (`src/styles.css`)
- [x] Substituir o tema pré-pronto do Material por um mais alinhado à paleta
      (trocado `deeppurple-amber` → `indigo-pink`; tema custom via `mat.define-theme`
      exigiria migrar `styles.css` → `.scss` — avaliar depois se o prebuilt não bastar)
- [x] Padronizar tipografia (família, pesos, escala de tamanhos) num único lugar
      (variáveis `--font-*` em `:root`, aplicadas ao padrão global)
- [x] Padronizar `border-radius` dos cards/botões/inputs (hoje varia entre 6px, 8px e 12px)
      (`--radius-sm/md/lg`, aplicado em ~39 arquivos)
- [x] Trocar gradualmente os hex-codes espalhados pelos componentes pelas variáveis CSS
      (azuis `#2196f3`/`#1976d2`/etc. em ~26 componentes + gradientes das telas de
      autenticação alinhados à nova paleta — itens 2-6 ainda usam cores antigas em
      outros contextos, ex. categorias/gráficos coloridos, que são intencionais)

## 2. Login / autenticação — alta prioridade (primeira impressão)

- [ ] Repaginar tela de login (`login`) com visual mais moderno (split screen,
      ilustração ou gradiente de marca, formulário mais leve)
- [ ] Aplicar o mesmo tratamento em cadastro (`register`), recuperação de senha
      (`recuperar-senha`) e redefinição (`redefinir-senha`)
- [ ] Garantir estados de erro/loading consistentes nesses formulários

## 3. Navegação e layout geral — alta prioridade

- [ ] Revisar menu lateral (`menu-lateral`): espaçamento, hierarquia visual das
      seções, indicador de item ativo, área do usuário/tenant no rodapé
- [ ] Avaliar adicionar uma topbar fixa (breadcrumb, busca rápida, avatar do usuário)
- [ ] Padronizar o `page-header` (já existe um padrão em `styles.css`, mas nem
      todas as telas o usam da mesma forma)

## 4. Telas de listagem/CRUD — prioridade média

Padronizar usando como referência o que já foi feito no dashboard
(cards brancos com sombra leve, classes semânticas de cor, sem estilos inline):

- [ ] Contas bancárias (`account` / `list-accounts`)
- [ ] Cartões e faturas (`cartao`)
- [ ] Transações (`list-transacoes`)
- [ ] Despesas fixas / recorrentes (`despesas-fixas`, `despesas-recorrentes`,
      `conta-fixa-recorrente`, `list-contas-fixas`, `list-despesas-recorrentes`)
- [ ] Compras parceladas / débito (`compra-parcelada-form`, `compra-debito-form`,
      `list-compras-parceladas`, `list-compras-debito`)
- [ ] Receitas (`provento-form`, `list-proventos`)
- [ ] Categorias (`categoria`)
- [ ] Reserva de emergência (`reserva-emergencia`, `reserva-emergencia-form`)
- [ ] Relatórios e comparativos (`relatorio-mensal`, `comparativo-mensal`, `budget-rule`)
- [ ] Status de pagamentos (`pagamentos-status`)
- [ ] Notificações (`notificacoes`, `notificacoes-email-config`)
- [ ] Administração (`admin-usuarios`, `minha-conta`, `criar-usuario`)

## 5. Componentes compartilhados — prioridade média

- [ ] Revisar tabelas (`mat-table` / tabelas HTML cruas) para um estilo único
      (zebra, hover, paginação, estados vazios)
- [ ] Padronizar badges/tags de status (hoje cada tela define as suas)
- [ ] Padronizar modais/diálogos (`mat-dialog`) — header, ações, espaçamento
- [ ] Revisar componentes em `shared/` e gráficos (`expense-pie-chart`,
      `income-expense-chart`, `spending-trend-chart`) para usar a nova paleta

## 6. Polish geral — prioridade baixa

- [ ] Microanimações/transições consistentes (hover de cards, troca de seção)
- [ ] Estados vazios ("empty states") com ilustração/texto padronizados em todas
      as listagens (hoje só o dashboard tem)
- [ ] Revisão de responsividade mobile nas telas fora do dashboard
- [ ] Favicon / branding (logo, nome) consistente entre telas públicas e internas

---

## Observações

- O dashboard já passou por esse tratamento (cards com `border-top` colorido,
  classes `.accent-*`/`.icon-*`, ações rápidas) — pode servir de referência de
  padrão visual para o restante das telas.
- Sugestão: iterar tela por tela em sessões curtas, evitando uma reforma "big bang"
  que aumente o risco de regressões.
