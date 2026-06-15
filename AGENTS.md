# Salve Mais UI — Guia para Agentes

Este arquivo é o guia operacional para agentes (Codex, Claude Code, etc.) neste repositório.
Antes de qualquer alteração, leia também `CLAUDE.md` — ele é a fonte primária de padrões técnicos e visuais.

## Contexto Atual

- Versão: **2.0.0**
- Branch principal de desenvolvimento: `primeng-migration-checkpoint`
- Migração de Angular Material → PrimeNG 19 **concluída** na v2.0
- O projeto usa exclusivamente PrimeNG 19 + PrimeFlex 3 + PrimeIcons

## Regras de Trabalho

1. Leia `CLAUDE.md` antes de qualquer alteração.
2. Antes de editar, verifique `git status --short --branch`.
3. Para cada tarefa, leia os componentes afetados antes de alterar.
4. Ao terminar uma etapa relevante, execute `npm run build:dev` para validar.
5. **Não commite** `.claude/handoff/` — está no `.gitignore`.
6. Nunca descarte alterações locais sem pedido explícito.

## Dev Server

```bash
# NUNCA usar porta 4200 — reservada para o usuário
npx ng serve --port 4201 --open false
```

## Padrão PrimeNG (resumo)

- `*.component.css` deve permanecer **vazio** — zero CSS local
- Layout: PrimeFlex no template (`grid`, `col-*`, `flex`, `gap-*`, `p-*`, `m-*`, `w-full`)
- Ícones: PrimeIcons (`<i class="pi pi-nome">`)
- `style=""` inline só para valores dinâmicos inevitáveis
- Classes de produto e tokens globais ficam em `src/styles.scss`
- `styleClass="w-full"` em componentes PrimeNG (nunca `class="w-full"`)

## Armadilhas conhecidas

Consulte a seção **"Armadilhas conhecidas"** no `CLAUDE.md` para a lista completa de erros comuns com exemplos CORRETO/ERRADO.

## Validação

```bash
npm run build:dev   # build de desenvolvimento
npm run build       # build de produção
```

## Agentes disponíveis

Prompts especializados em `.claude/agents/`:
- `architect.md` — decisões de arquitetura e módulos
- `frontend.md` — implementação de componentes e UX
- `qa.md` — validação visual e testes
