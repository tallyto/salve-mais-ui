# Funcionalidade de Compras Parceladas - Frontend

## Visão Geral

Esta documentação descreve a implementação completa do frontend para o sistema de compras parceladas, que permite aos usuários registrar e gerenciar compras parceladas em seus cartões de crédito.

## Arquitetura

### Estrutura de Arquivos

```
src/app/
├── models/
│   └── compra-parcelada.model.ts       # Modelos de dados TypeScript
├── services/
│   └── compra-parcelada.service.ts     # Service para comunicação com a API
└── components/
    ├── compra-parcelada-form/          # Formulário de cadastro
    │   ├── compra-parcelada-form.component.ts
    │   ├── compra-parcelada-form.component.html
    │   └── compra-parcelada-form.component.css
    └── list-compras-parceladas/        # Listagem e gerenciamento
        ├── list-compras-parceladas.component.ts
        ├── list-compras-parceladas.component.html
        └── list-compras-parceladas.component.css
```

## Componentes

### 1. CompraParceladaFormComponent

**Rota:** `/compras-parceladas/nova`

**Funcionalidades:**
- Cadastro de novas compras parceladas
- Seleção de cartão de crédito
- Seleção de categoria
- Cálculo automático do valor da parcela
- Cálculo automático de parcelas restantes
- Validação de campos obrigatórios
- Feedback visual de validação

**Campos do Formulário:**
- **Descrição** (obrigatório): Descrição da compra
- **Valor Total** (obrigatório): Valor total da compra
- **Cartão** (obrigatório): Cartão de crédito onde a compra foi realizada
- **Categoria** (obrigatório): Categoria da despesa
- **Parcela Inicial** (obrigatório): Número da primeira parcela (1-60)
- **Total de Parcelas** (obrigatório): Quantidade total de parcelas (1-60)

**Validações:**
- Parcela inicial deve ser menor ou igual ao total de parcelas
- Valores devem ser positivos
- Todos os campos obrigatórios devem ser preenchidos

**Cálculos Automáticos:**
```typescript
// Valor de cada parcela
valorParcela = valorTotal / (totalParcelas - parcelaInicial + 1)

// Parcelas restantes
parcelasRestantes = totalParcelas - parcelaInicial + 1
```

### 2. ListComprasParceladasComponent

**Rota:** `/compras-parceladas`

**Funcionalidades:**
- Listagem de todas as compras parceladas
- Visualização expandível de parcelas
- Marcar parcelas como pagas/não pagas
- Excluir compras parceladas
- Paginação
- Indicador visual de progresso de pagamento
- Cálculo de parcelas pagas vs total

**Informações Exibidas:**
- Descrição da compra
- Cartão de crédito utilizado
- Categoria
- Valor total
- Número de parcelas
- Progresso de pagamento (barra de progresso)
- Status de cada parcela individual

**Ações Disponíveis:**
- **Expandir/Recolher:** Visualizar detalhes das parcelas
- **Marcar Paga:** Marcar uma parcela específica como paga
- **Marcar Não Paga:** Desmarcar uma parcela como paga
- **Excluir:** Remover a compra parcelada (com confirmação)

## Modelos de Dados

### CompraParceladaRequest
```typescript
interface CompraParceladaRequest {
  descricao: string;
  valorTotal: number;
  cartaoId: number;
  categoriaId: number;
  parcelaInicial: number;
  totalParcelas: number;
}
```

### CompraParcelada
```typescript
interface CompraParcelada {
  id: number;
  descricao: string;
  valorTotal: number;
  cartaoId: number;
  nomeCartao?: string;
  categoriaId: number;
  nomeCategoria?: string;
  parcelaInicial: number;
  totalParcelas: number;
  dataCriacao: Date;
  parcelas: Parcela[];
}
```

### Parcela
```typescript
interface Parcela {
  id: number;
  numeroParcela: number;
  valor: number;
  dataVencimento: Date;
  paga: boolean;
  compraParceladaId: number;
}
```

## Service - CompraParceladaService

### Métodos Disponíveis

#### Operações CRUD
```typescript
// Criar nova compra parcelada
criar(request: CompraParceladaRequest): Observable<CompraParcelada>

// Listar todas as compras parceladas (com paginação)
listar(page: number = 0, size: number = 10): Observable<any>

// Buscar compra parcelada por ID
buscarPorId(id: number): Observable<CompraParcelada>

// Excluir compra parcelada
excluir(id: number): Observable<void>

// Marcar parcela como paga/não paga
marcarParcelaComoPaga(parcelaId: number, paga: boolean): Observable<Parcela>
```

#### Métodos Auxiliares
```typescript
// Calcular parcelas restantes
calcularParcelasRestantes(parcelaInicial: number, totalParcelas: number): number

// Calcular valor de cada parcela
calcularValorParcela(valorTotal: number, parcelaInicial: number, totalParcelas: number): number
```

## Integração com a API

### Endpoints Utilizados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/compras-parceladas` | Criar compra parcelada |
| GET | `/api/compras-parceladas?page=0&size=10` | Listar com paginação |
| GET | `/api/compras-parceladas/{id}` | Buscar por ID |
| DELETE | `/api/compras-parceladas/{id}` | Excluir compra |
| PATCH | `/api/compras-parceladas/parcelas/{id}/paga?paga=true` | Marcar parcela |

## Roteamento

### Rotas Configuradas

```typescript
{
  path: 'compras-parceladas', 
  component: ListComprasParceladasComponent, 
  canActivate: [AuthGuard]
},
{
  path: 'compras-parceladas/nova', 
  component: CompraParceladaFormComponent, 
  canActivate: [AuthGuard]
}
```

Ambas as rotas são protegidas por `AuthGuard`, exigindo autenticação.

## Menu Lateral

Item adicionado na seção **"Cartões e Faturas"**:

```html
<a mat-list-item routerLink="/compras-parceladas" routerLinkActive="active-link">
  <mat-icon>payment</mat-icon>
  <span>Compras Parceladas</span>
</a>
```

## Fluxo de Uso

### Cadastrar Nova Compra Parcelada

1. Usuário acessa o menu "Compras Parceladas"
2. Clica no botão "Nova Compra Parcelada"
3. Preenche o formulário com:
   - Descrição da compra
   - Valor total
   - Seleciona o cartão
   - Seleciona a categoria
   - Define a parcela inicial
   - Define o total de parcelas
4. Sistema calcula automaticamente:
   - Valor de cada parcela
   - Quantidade de parcelas restantes
5. Usuário clica em "Cadastrar"
6. Sistema cria a compra e todas as parcelas automaticamente
7. Redireciona para a listagem

### Gerenciar Compras Parceladas

1. Usuário acessa a listagem de compras parceladas
2. Visualiza todas as compras com:
   - Informações gerais
   - Barra de progresso de pagamento
3. Pode expandir uma compra para ver todas as parcelas
4. Para cada parcela, pode:
   - Marcar como paga (checkbox)
   - Visualizar data de vencimento
   - Ver valor da parcela
5. Pode excluir a compra completa (se necessário)

## Estilos e UI

### CompraParceladaFormComponent
- Card centralizado com sombra
- Campos de formulário com validação visual (Material Design)
- Indicadores de campo obrigatório (*)
- Mensagens de erro contextuais
- Cálculos exibidos em tempo real
- Botões de ação: Cadastrar e Cancelar

### ListComprasParceladasComponent
- Tabela responsiva com Material Design
- Linhas expansíveis para visualizar parcelas
- Barra de progresso visual (mat-progress-bar)
- Ícones de ação (expandir, excluir)
- Checkboxes para marcar parcelas como pagas
- Paginador no rodapé
- Estado vazio quando não há compras

## Integração com Faturas

As parcelas de compras parceladas são automaticamente incluídas no cálculo das faturas dos cartões de crédito. O `FaturaService` no backend foi atualizado para:

1. Buscar todas as compras diretas no cartão
2. Buscar todas as parcelas que vencem no período da fatura
3. Somar: `valorTotal = valorCompras + valorParcelas`

Isso garante que as faturas reflitam tanto as compras à vista quanto as parcelas das compras parceladas.

## Dependências

### Angular Material Modules
- MatCardModule
- MatFormFieldModule
- MatInputModule
- MatSelectModule
- MatButtonModule
- MatTableModule
- MatCheckboxModule
- MatIconModule
- MatProgressBarModule
- MatPaginatorModule
- MatTooltipModule
- MatSnackBarModule

### Outros
- ReactiveFormsModule (para formulários reativos)
- CommonModule (para diretivas comuns)
- HttpClientModule (para chamadas HTTP)

## Melhorias Futuras

1. **Filtros Avançados**
   - Filtrar por cartão
   - Filtrar por categoria
   - Filtrar por período
   - Busca por descrição

2. **Relatórios**
   - Gráfico de parcelas pagas vs pendentes
   - Projeção de gastos futuros
   - Análise por categoria

3. **Notificações**
   - Alertas de parcelas próximas do vencimento
   - Resumo mensal de parcelas

4. **Edição**
   - Permitir editar descrição e categoria
   - Ajustar valores de parcelas individuais

5. **Exportação**
   - Exportar para PDF
   - Exportar para Excel

## Testes

Para testar a funcionalidade:

1. Inicie o backend: `cd salve-mais && ./mvnw spring-boot:run`
2. Inicie o frontend: `cd salve-mais-ui && npm start`
3. Acesse: `http://localhost:4200`
4. Faça login com suas credenciais
5. Navegue para "Compras Parceladas" no menu
6. Teste criar, visualizar, marcar como paga e excluir compras

## Conclusão

A funcionalidade de compras parceladas está completamente implementada no frontend, integrada com o backend, e pronta para uso. O sistema permite um controle completo sobre compras parceladas, com interface intuitiva e cálculos automáticos.
