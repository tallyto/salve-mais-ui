# Sistema de Notificações de Contas Atrasadas

## 📋 Visão Geral
Sistema completo de notificações para alertar sobre contas fixas e faturas atrasadas ou próximas do vencimento, integrado ao dashboard principal.

## 🚀 Funcionalidades Implementadas

### **Backend (Java/Spring Boot)**

#### 1. **NotificacaoDTO**
- Record para transporte de dados das notificações
- Enum `Prioridade`: BAIXA, MEDIA, ALTA, CRITICA
- Enum `TipoNotificacao`: Diferentes tipos de notificações
- Campos: tipo, prioridade, título, mensagem, entidadeId, tipoEntidade, diasDiferença

#### 2. **NotificacaoService**
- **`obterNotificacoes()`**: Retorna todas as notificações ativas
- **`obterNotificacaoContasAtrasadas()`**: Contas fixas em atraso
- **`obterNotificacaoContasProximasVencimento()`**: Contas que vencem em 7 dias
- **`obterNotificacaoFaturasAtrasadas()`**: Faturas de cartão em atraso
- **`obterTotalNotificacoes()`**: Contador total de notificações

#### 3. **NotificacaoController**
- **`GET /api/notificacoes`**: Lista todas as notificações
- **`GET /api/notificacoes/contas-atrasadas`**: Apenas contas atrasadas
- **`GET /api/notificacoes/contas-proximas-vencimento`**: Próximas ao vencimento
- **`GET /api/notificacoes/faturas-atrasadas`**: Apenas faturas atrasadas
- **`GET /api/notificacoes/resumo`**: Resumo estatístico das notificações

### **Frontend (Angular/TypeScript)**

#### 1. **NotificacaoService**
- Interface `NotificacaoDTO` e `ResumoNotificacoes`
- Métodos para consumir todas as APIs do backend
- Utilitários: `getCorPrioridade()`, `getIconeTipo()`

#### 2. **NotificacoesComponent** (/notificacoes)
- Página principal de notificações
- **Filtros dinâmicos** por tipo de notificação
- **Cards interativos** com navegação para entidades
- **Estatísticas em tempo real**
- **Estados visuais** diferenciados por prioridade

#### 3. **NotificacoesWidgetComponent**
- **Widget compacto** para o dashboard
- **Resumo visual** com cores e ícones
- **Animação pulsante** quando há notificações críticas
- **Navegação rápida** para página de notificações
- **Estados de carregamento** e vazio

## 🎯 Regras de Negócio

### **Prioridades**
- **CRITICA**: Contas/faturas atrasadas > 15 dias
- **ALTA**: Contas/faturas atrasadas ou que vencem hoje/amanhã
- **MEDIA**: Contas que vencem em 3-7 dias
- **BAIXA**: Contas que vencem em mais de 7 dias

### **Tipos de Notificação**
- **CONTA_ATRASADA**: Contas fixas com vencimento passado
- **CONTA_PROXIMA_VENCIMENTO**: Contas que vencem nos próximos 7 dias
- **FATURA_ATRASADA**: Faturas de cartão com vencimento passado
- **FATURA_PROXIMA_VENCIMENTO**: Faturas próximas do vencimento

## 🔧 Integrações

### **Dashboard Principal**
- Widget de notificações integrado
- Posicionado ao lado do widget de limites de cartão
- Atualização automática ao carregar o dashboard

### **Menu Lateral**
- Link para página de notificações
- Posicionado após Dashboard para fácil acesso

### **Navegação Contextual**
- Click em notificação de conta → vai para /despesas-fixas
- Click em notificação de fatura → vai para /faturas

## 🎨 Interface e UX

### **Cores e Estilos**
- **Verde**: Tudo em dia, sem notificações
- **Vermelho**: Notificações críticas e altas
- **Laranja**: Notificações médias
- **Cinza**: Notificações baixas

### **Responsividade**
- Layout adaptativo para desktop, tablet e mobile
- Cards empilháveis em telas menores
- Botões e textos ajustáveis

### **Feedback Visual**
- Loading states durante carregamento
- Estados vazios com mensagens amigáveis
- Animações suaves e transições

## 📊 Componentes de Interface

### **Cards de Notificação**
```html
[ícone] Título da Notificação [chip-prioridade]
        Mensagem descritiva
        [tempo-atraso] [tipo-entidade] [seta]
```

### **Widget Dashboard**
```html
[ícone-notification] Notificações
                    X pendente(s)
[estatísticas em linha]
- X Críticas
- X Alta Prioridade  
- X Em Atraso

[detalhes]
- X conta(s) atrasada(s)
- X fatura(s) atrasada(s)

[Ver Todas →]
```

## 🔄 Fluxo de Uso

1. **Usuário acessa Dashboard** → Widget mostra resumo de notificações
2. **Click no Widget** → Navega para página completa de notificações
3. **Filtro por tipo** → Usuário pode filtrar notificações específicas
4. **Click em notificação** → Navega para página da entidade (conta/fatura)
5. **Atualização automática** → Dados atualizados a cada carregamento

## 📋 Endpoints API

```http
GET /api/notificacoes                        # Todas as notificações
GET /api/notificacoes/contas-atrasadas       # Contas atrasadas
GET /api/notificacoes/contas-proximas-vencimento # Próximas vencimento
GET /api/notificacoes/faturas-atrasadas      # Faturas atrasadas  
GET /api/notificacoes/resumo                 # Resumo estatístico
```

## 🎉 Benefícios

1. **⚠️ Alertas Proativos**: Usuário é notificado antes das contas vencerem
2. **🎯 Visibilidade Centralizada**: Todas as pendências em um só lugar
3. **📱 Interface Intuitiva**: Fácil navegação e identificação visual
4. **🔄 Atualização Automática**: Sempre sincronizado com o estado atual
5. **📊 Resumo Executivo**: Dashboard widget mostra status geral

## ⚡ Performance

- **Caching**: Notificações calculadas sob demanda
- **Lazy Loading**: Componentes carregados quando necessário  
- **Responsividade**: Interface otimizada para todos os dispositivos
- **Filtros Eficientes**: Filtragem no frontend para melhor UX

Este sistema oferece uma solução completa para gerenciamento proativo de vencimentos, melhorando significativamente a experiência do usuário no controle financeiro.
