# Melhorias na Funcionalidade de Faturas

## 📋 Resumo

Esta atualização adiciona um **sistema de preview de faturas** que permite visualizar exatamente quais compras e parcelas serão incluídas em uma fatura antes de criá-la, tornando o processo de geração de faturas muito mais transparente e fácil de usar.

## ✨ Funcionalidades Adicionadas

### 1. **Preview da Fatura** 
- Nova seção no frontend que permite visualizar o conteúdo da fatura antes de gerá-la
- Mostra **compras à vista** e **parcelas de compras parceladas** que seriam incluídas
- Calcula e exibe valores separados e total da fatura
- Interface intuitiva com cards visuais para cada item

### 2. **Backend - Novo Endpoint**
- `GET /api/faturas/preview/{cartaoCreditoId}?dataVencimento=yyyy-MM-dd`
- Retorna preview sem criar a fatura
- Inclui informações detalhadas de compras e parcelas

### 3. **Melhorias no Layout**
- Design moderno com cards para cada compra/parcela
- Separação visual clara entre compras à vista e parcelas
- Resumo de valores destacado
- Responsivo para mobile

## 🔧 Arquivos Modificados

### Backend (Java/Spring Boot)

#### 1. **FaturaPreviewDTO.java** (Novo)
```java
/home/tallyto/projetos/salve-mais/src/main/java/com/tallyto/gestorfinanceiro/api/dto/FaturaPreviewDTO.java
```
- DTO para retornar preview da fatura
- Contém listas de compras e parcelas
- Valores separados e total

#### 2. **FaturaService.java**
```java
/home/tallyto/projetos/salve-mais/src/main/java/com/tallyto/gestorfinanceiro/core/application/services/FaturaService.java
```
- Novo método: `gerarPreviewFatura()`
- Classe interna: `PreviewResult` para encapsular resultado
- Lógica para calcular período de fechamento e buscar compras/parcelas

#### 3. **FaturaController.java**
```java
/home/tallyto/projetos/salve-mais/src/main/java/com/tallyto/gestorfinanceiro/api/controllers/FaturaController.java
```
- Novo endpoint: `GET /api/faturas/preview/{cartaoCreditoId}`
- Documentação Swagger completa
- Conversão de entidades para DTOs

### Frontend (Angular)

#### 1. **fatura.model.ts**
```typescript
/home/tallyto/projetos/salve-mais-ui/src/app/models/fatura.model.ts
```
- Nova interface: `FaturaPreviewDTO`
- Nova interface: `CompraPreviewDTO`
- Nova interface: `ParcelaPreviewDTO`

#### 2. **fatura.service.ts**
```typescript
/home/tallyto/projetos/salve-mais-ui/src/app/services/fatura.service.ts
```
- Novo método: `buscarPreviewFatura()`
- Integração com novo endpoint do backend

#### 3. **fatura-form.component.ts**
```typescript
/home/tallyto/projetos/salve-mais-ui/src/app/components/fatura-form/fatura-form.component.ts
```
- Novo formulário: `previewForm`
- Variáveis de estado: `mostrarPreview`, `loadingPreview`, `preview`
- Novos métodos:
  - `togglePreview()`: Abre/fecha seção de preview
  - `buscarPreview()`: Busca dados do preview
  - `gerarFaturaDaPreview()`: Gera fatura a partir do preview

#### 4. **fatura-form.component.html**
```html
/home/tallyto/projetos/salve-mais-ui/src/app/components/fatura-form/fatura-form.component.html
```
- Nova seção de preview com formulário
- Cards visuais para compras e parcelas
- Resumo de valores destacado
- Botão para gerar fatura diretamente do preview

#### 5. **fatura-form.component.css**
```css
/home/tallyto/projetos/salve-mais-ui/src/app/components/fatura-form/fatura-form.component.css
```
- Estilos para seção de preview
- Cards de compras e parcelas
- Resumo de valores
- Responsividade mobile

## 🎯 Como Usar

### 1. **Acessar Preview da Fatura**
1. Na página de Faturas, clique em **"Preview da Fatura"**
2. Selecione o **cartão de crédito**
   - ✨ **Novo**: A data de vencimento é preenchida automaticamente!
   - O dia de vencimento é exibido junto ao nome do cartão
3. Clique em **"Buscar Preview"**

### 2. **Visualizar Detalhes**
O preview mostrará:
- **Compras à Vista**: Todas as compras feitas no cartão até a data
- **Parcelas**: Parcelas de compras parceladas que vencem no período
- **Resumo**:
  - Valor total das compras
  - Valor total das parcelas
  - **Valor Total da Fatura**

### 3. **Gerar Fatura**
- Se estiver satisfeito com o preview, clique em **"Gerar Fatura"**
- A fatura será criada com os valores mostrados

## 📊 Exemplo de Uso

**Cenário**: Você quer saber quanto vai pagar na fatura do cartão que vence dia 10/10/2025

**Antes desta atualização**:
- Você tinha que gerar a fatura "às cegas"
- Não sabia quais compras seriam incluídas
- Não tinha certeza do valor total

**Agora com o Preview**:
```
Preview da Fatura - Cartão Nubank
Vencimento: 10/10/2025

Resumo:
├─ Compras à vista: R$ 350,00
├─ Parcelas: R$ 150,00
└─ Valor Total: R$ 500,00

Compras à Vista (3):
• Supermercado - Alimentação - R$ 200,00 (05/10/2025)
• Uber - Transporte - R$ 50,00 (07/10/2025)
• Netflix - Entretenimento - R$ 100,00 (08/10/2025)

Parcelas (2):
• Notebook Dell - Parcela 3/12 - R$ 100,00 (Vence em: 10/10/2025)
• Mouse Gamer - Parcela 1/3 - R$ 50,00 (Vence em: 10/10/2025)
```

## 🔍 Detalhes Técnicos

### Lógica de Cálculo do Período

O sistema calcula o período de fechamento da fatura da seguinte forma:

```java
// Data de fechamento = 10 dias antes do vencimento
LocalDate dataFechamento = dataVencimento.minusDays(10);

// Período de compras: primeiro dia do mês do fechamento até o fechamento
LocalDate primeiroDia = dataFechamento.withDayOfMonth(1);
```

**Exemplo**:
- Data de vencimento: **10/10/2025**
- Data de fechamento: **30/09/2025** (10 dias antes)
- Período de compras: **01/09/2025** a **30/09/2025**

### Integração com Parcelas

As parcelas são incluídas na fatura se:
1. Pertencem ao cartão de crédito selecionado
2. Têm data de vencimento dentro do período de fechamento
3. Não estão marcadas como pagas

## 🎨 Benefícios

1. **Transparência**: Ver exatamente o que será cobrado
2. **Controle**: Decidir se quer gerar a fatura ou não
3. **Planejamento**: Saber o valor total antes de gerar
4. **Confiança**: Validar se todas as compras/parcelas estão corretas
5. **UX Melhorada**: Interface moderna e intuitiva
6. **Automação**: Data de vencimento preenchida automaticamente do cartão

## ⚡ Melhorias de UX (Última Atualização)

### Preenchimento Automático da Data
- ✨ Ao selecionar um cartão, a data de vencimento é **preenchida automaticamente**
- 📅 Campo de data marcado como **readonly** para evitar edições acidentais
- 👁️ Dia de vencimento exibido junto ao nome do cartão (ex: "Nubank - Vence dia 10")
- 💡 Hint informativo: "Data preenchida automaticamente do cartão"

**Benefícios:**
- ⚡ Mais rápido - apenas 2 cliques para ver o preview
- 🎯 Mais preciso - usa a data correta do cartão
- 🚫 Sem erros - não há como digitar data errada
- 💚 Melhor experiência do usuário

## 🚀 Próximos Passos (Sugestões)

1. Adicionar filtros no preview (por categoria, valor, etc.)
2. Permitir excluir compras específicas do preview
3. Exportar preview em PDF
4. Notificações quando uma fatura grande for detectada
5. Comparação com faturas anteriores

## 📝 Notas

- O preview **não cria** a fatura, apenas mostra o que seria incluído
- Você pode buscar o preview quantas vezes quiser
- A geração da fatura automática continua funcionando normalmente
- Compatível com o sistema de compras parceladas existente

---

**Data**: 05/10/2025
**Versão**: 1.0.0
**Autor**: Sistema de Gestão Financeira
