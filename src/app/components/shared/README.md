# Shared Components Library

Componentes reutilizáveis em toda a aplicação. Todos são **standalone** e usam **PrimeNG 19**.

## Quick Import

```typescript
import { StatCardComponent, ActionButtonsComponent, EmptyStateComponent } from '@components/shared';
```

## Estrutura

## PageHeaderComponent

Cabeçalho padrão de páginas com ícone, título e ações.

### Uso:
```html
<section class="p-4 flex flex-column gap-4">
  <app-page-header 
    icon="pi-wallet" 
    title="Cartões" 
    subtitle="Gerencie seus cartões">
    <p-button label="Novo" icon="pi pi-plus"></p-button>
  </app-page-header>

  <!-- conteúdo da página -->
</section>
```

### Inputs:
- `icon: string` — Ícone PrimeIcon (ex: "pi-wallet")
- `title: string` — Título principal
- `subtitle: string?` — Subtítulo opcional

### Slot:
- `<ng-content>` — Ações à direita (botões, etc)

---

## EmptyStateComponent

Estado vazio para tabelas e listas.

### Uso:
```html
<ng-template pTemplate="emptymessage">
  <tr><td colspan="4">
    <app-empty-state 
      message="Nenhum item encontrado." 
      icon="pi-inbox">
    </app-empty-state>
  </td></tr>
</ng-template>
```

### Inputs:
- `message: string` — Mensagem exibida
- `icon: string` — Ícone PrimeIcon (padrão: "pi-inbox")

### Slot:
- `<ng-content>` — Conteúdo adicional (botão ação, etc)

---

## ActionButtonsComponent

Botões de ação (editar/excluir) padronizados.

### Uso:
```html
<ng-template pTemplate="body" let-item>
  <tr>
    <td>{{ item.nome }}</td>
    <td>
      <app-action-buttons 
        (edit)="editar(item)" 
        (delete)="excluir(item)">
      </app-action-buttons>
    </td>
  </tr>
</ng-template>
```

### Inputs:
- `disabled: boolean?` — Desabilita os botões

### Outputs:
- `edit: EventEmitter<void>` — Emitido ao clicar editar
- `delete: EventEmitter<void>` — Emitido ao clicar excluir

---

## Benefícios

✅ **Consistência** — visual e comportamento padronizados  
✅ **Redução de código** — menos HTML duplicado  
✅ **Manutenibilidade** — mudanças em um só lugar  
✅ **Acessibilidade** — tooltips e ícones consistentes
