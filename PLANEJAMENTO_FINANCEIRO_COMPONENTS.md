# Componentes de Planejamento Financeiro - Frontend

## 📋 Resumo

Foram criados componentes Angular para gerenciar as funcionalidades de **Metas Financeiras** e **Planos de Compra**, permitindo aos usuários planejar suas finanças de forma eficiente.

## 🗂️ Estrutura de Arquivos Criados

### Models
- `src/app/models/meta.model.ts` - Interface e enums para Metas
- `src/app/models/plano-compra.model.ts` - Interface e enums para Planos de Compra  
- `src/app/models/plano-aposentadoria.model.ts` - Interface para Plano de Aposentadoria

### Services
- `src/app/services/meta.service.ts` - Serviço HTTP para Metas
- `src/app/services/plano-compra.service.ts` - Serviço HTTP para Planos de Compra
- `src/app/services/plano-aposentadoria.service.ts` - Serviço HTTP para Plano de Aposentadoria

### Componentes

#### Metas Financeiras
1. **list-metas/** - Listagem de metas
   - `list-metas.component.ts`
   - `list-metas.component.html`
   - `list-metas.component.css`
   - Funcionalidades:
     - Visualização em tabela com paginação e ordenação
     - Filtro por status (Em Andamento, Concluída, Pausada, Cancelada)
     - Barra de progresso visual
     - Ações: Criar, Editar, Atualizar Progresso, Excluir

2. **meta-form/** - Formulário de meta
   - `meta-form.component.ts`
   - `meta-form.component.html`
   - `meta-form.component.css`
   - Funcionalidades:
     - Criação e edição de metas
     - Seleção de ícone e cor personalizados
     - Validação de campos obrigatórios
     - Integração com categorias

3. **meta-progresso/** - Atualização de progresso
   - `meta-progresso.component.ts`
   - `meta-progresso.component.html`
   - `meta-progresso.component.css`
   - Funcionalidades:
     - Adicionar valores à meta
     - Preview do novo progresso
     - Visualização de valores atuais e restantes

#### Planos de Compra
4. **list-planos-compra/** - Listagem de planos
   - `list-planos-compra.component.ts`
   - `list-planos-compra.component.html`
   - `list-planos-compra.component.css`
   - Funcionalidades:
     - Visualização em tabela com paginação e ordenação
     - Filtro por status
     - Exibição de progresso, prioridade e tipo de pagamento
     - Ações: Criar, Editar, Excluir

5. **plano-compra-form/** - Formulário de plano
   - `plano-compra-form.component.ts`
   - `plano-compra-form.component.html`
   - `plano-compra-form.component.css`
   - Funcionalidades:
     - Criação e edição de planos
     - Cálculo automático de parcelas
     - Suporte a diferentes tipos de pagamento (À vista, Parcelado, Financiamento)
     - Cálculo de juros (Tabela Price)
     - Validação dinâmica baseada no tipo de pagamento

#### Dashboard
6. **planejamento-financeiro/** - Dashboard geral
   - `planejamento-financeiro.component.ts`
   - `planejamento-financeiro.component.html`
   - `planejamento-financeiro.component.css`
   - Funcionalidades:
     - Cards estatísticos com totais e concluídos
     - Visualização rápida de metas em andamento
     - Visualização de próximos planos de compra
     - Navegação para páginas detalhadas

## 🎨 Recursos Visuais

### Metas
- **Ícones personalizáveis**: savings, home, flight, directions_car, school, favorite, celebration, laptop
- **Cores personalizáveis**: 8 opções de cores
- **Status visuais**: badges coloridos para cada status
- **Progresso visual**: barras de progresso com cores dinâmicas

### Planos de Compra
- **Badges de prioridade**: Alta (vermelho), Média (laranja), Baixa (verde)
- **Badges de status**: Planejado, Em Andamento, Concluído, Cancelado
- **Cálculos automáticos**: Valor de parcela e total com juros

## 🔗 Integração

### Endpoints da API
```typescript
// Metas
GET    /api/metas
GET    /api/metas/status/{status}
GET    /api/metas/{id}
POST   /api/metas
PUT    /api/metas/{id}
PATCH  /api/metas/{id}/progresso
DELETE /api/metas/{id}

// Planos de Compra
GET    /api/planos-compra
GET    /api/planos-compra/status/{status}
GET    /api/planos-compra/{id}
POST   /api/planos-compra
PUT    /api/planos-compra/{id}
DELETE /api/planos-compra/{id}

// Plano de Aposentadoria
GET    /api/plano-aposentadoria
POST   /api/plano-aposentadoria
PUT    /api/plano-aposentadoria
DELETE /api/plano-aposentadoria
```

## 📝 Próximos Passos

### 1. Registrar os componentes no módulo principal

Adicione ao `app.module.ts`:

```typescript
import { ListMetasComponent } from './components/list-metas/list-metas.component';
import { MetaFormComponent } from './components/meta-form/meta-form.component';
import { MetaProgressoComponent } from './components/meta-progresso/meta-progresso.component';
import { ListPlanosCompraComponent } from './components/list-planos-compra/list-planos-compra.component';
import { PlanoCompraFormComponent } from './components/plano-compra-form/plano-compra-form.component';
import { PlanejamentoFinanceiroComponent } from './components/planejamento-financeiro/planejamento-financeiro.component';

@NgModule({
  declarations: [
    // ... outros componentes
    ListMetasComponent,
    MetaFormComponent,
    MetaProgressoComponent,
    ListPlanosCompraComponent,
    PlanoCompraFormComponent,
    PlanejamentoFinanceiroComponent
  ],
  // ...
})
```

### 2. Adicionar rotas

No arquivo de rotas (`app-routing.module.ts`):

```typescript
const routes: Routes = [
  // ... outras rotas
  { 
    path: 'planejamento', 
    component: PlanejamentoFinanceiroComponent,
    canActivate: [AuthGuard] 
  },
  { 
    path: 'metas', 
    component: ListMetasComponent,
    canActivate: [AuthGuard] 
  },
  { 
    path: 'planos-compra', 
    component: ListPlanosCompraComponent,
    canActivate: [AuthGuard] 
  }
];
```

### 3. Adicionar itens no menu lateral

No componente de menu (`menu-lateral.component.ts`):

```typescript
menuItems = [
  // ... outros itens
  {
    icon: 'trending_up',
    label: 'Planejamento',
    route: '/planejamento'
  },
  {
    icon: 'flag',
    label: 'Metas',
    route: '/metas'
  },
  {
    icon: 'shopping_cart',
    label: 'Planos de Compra',
    route: '/planos-compra'
  }
];
```

## 🎯 Funcionalidades Implementadas

### Metas Financeiras
- ✅ CRUD completo de metas
- ✅ Atualização de progresso
- ✅ Cálculo automático de percentual e valores restantes
- ✅ Filtros por status
- ✅ Personalização visual (ícones e cores)
- ✅ Notificações de progresso (opcional)

### Planos de Compra
- ✅ CRUD completo de planos
- ✅ Suporte a múltiplos tipos de pagamento
- ✅ Cálculo de parcelas e juros (Tabela Price)
- ✅ Sistema de prioridades
- ✅ Acompanhamento de progresso de economia
- ✅ Filtros por status

### Dashboard
- ✅ Estatísticas gerais
- ✅ Visualização rápida de metas em andamento
- ✅ Visualização de próximos planos
- ✅ Navegação integrada

## 🔧 Tecnologias Utilizadas

- **Angular Material**: Componentes UI (Tables, Forms, Cards, Dialogs, Progress Bars)
- **Reactive Forms**: Formulários com validação
- **RxJS**: Gerenciamento de requisições HTTP assíncronas
- **TypeScript**: Tipagem forte e interfaces
- **CSS Grid/Flexbox**: Layouts responsivos

## 📱 Responsividade

Todos os componentes são responsivos e se adaptam a diferentes tamanhos de tela usando:
- CSS Grid com `auto-fit` e `minmax`
- Media queries quando necessário
- Material Design breakpoints

## 🎨 Temas e Customização

Os componentes seguem o padrão Material Design e suportam:
- Temas personalizados do Angular Material
- Cores primárias e de destaque configuráveis
- Ícones e cores personalizáveis para metas
