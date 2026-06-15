# Changelog

Todas as mudanças notáveis neste projeto estão documentadas neste arquivo.
O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [2.1.0] - 2026-06-15 - Nomenclatura & Arquitetura

### ✨ Adicionado
- **CONVENTIONS.md**: Guia de convenções de código (12 seções)
- Padronização completa de 12 domínios de negócio

### 🔄 Refatorado

#### 1️⃣ Métodos de Serviços (PT-BR)
Padronização de **8 serviços**, **25+ métodos**:
- `dashboard.service`: `getSummary`→`obterResumo`, `getExpensesByCategory`→`obterDespesasPorCategoria`, etc
- `usuario.service`: `getUsuarioLogado`→`obterLogado`
- `billing.service`: `getStatus`→`obterStatus`, `getPlanos`→`listarPlanos`
- `reserva-emergencia.service`: 6 métodos (get→obter, create→salvar, update→atualizar, delete→excluir)
- `tenant.service`: 8 métodos (get→obter, update→atualizar)
- `gasto-cartao.service`: 3 métodos
- `contas-fixas.service`: 1 método
- `notificacao.service`: 2 métodos

**Impacto**: 30+ componentes atualizados.

#### 2️⃣ Nomes de Componentes
Prefixo `list-` padronizado para **4 componentes**:
- `admin-usuarios` → `admin/list-usuarios`
- `categoria-list` → `categoria/list-categorias`
- `cartao-limites` → `cartao/list-cartao-limites`
- `pagamentos-status` → `despesas/list-pagamentos-status`

**Impacto**: 10+ imports e rotas atualizados.

#### 3️⃣ Imports (Aliases)
Conversão de **50+ arquivos** de imports relativos para aliases:
- `../../environments/` → `@environments/`
- `../models/` → `@models/`
- `../utils/` → `@utils/`
- `../shared/` → `@shared/`
- `../component/` → `@components/domain/component/`

**Benefício**: Imports mais limpos, refatorações futuras não quebram, IDE autocomplete melhorado.

#### 4️⃣ Consolidação de Componentes em Domínios

**Batch 1 - Dashboard**: 4 componentes
- `budget-rule` → `dashboard/budget-rule/`
- `expense-pie-chart` → `dashboard/expense-pie-chart/`
- `income-expense-chart` → `dashboard/income-expense-chart/`
- `spending-trend-chart` → `dashboard/spending-trend-chart/`

**Batch 2 - Auth**: 1 componente
- `criar-usuario` → `auth/criar-usuario/`

**Batch 3 - Consolidação**: 2 componentes
- `notificacoes.component` → `notificacoes/notificacoes/`
- `reserva-emergencia.component` → `reserva-emergencia/reserva-emergencia/`

**Batch 4 - Billing**: 1 componente
- `billing.component` → `billing/billing/`

### 📊 Build Status
- ✅ 0 erros | 0 warnings
- Bundle size: 7.32 MB
- Lazy chunks: 2 (cartao, categoria)

---

## [2.0.0] - 2026-06-14

### Refatoração completa de UI
- Migração de Angular Material para PrimeNG 19 (tema Aura/teal)
- Novo sistema de design com PrimeFlex 3 + PrimeIcons
- Dashboard, sidebar, toolbar e todos os componentes migrados
- Correções de UX: roteamento, formulários, campos de data, tabelas
