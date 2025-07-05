# Changelog - Gestor Financeiro

## [Unreleased]

- Adição do roadmap de features (`doc/roadmap.md`)
- Implementação de autenticação JWT (login, cadastro, interceptor)
- Proteção de rotas com AuthGuard
- Criação das telas de login e cadastro
- Integração do front-end com o backend para autenticação
- Estruturação inicial do projeto Angular
- Implementada funcionalidade de edição de provento (API, serviço, formulário e listagem)
- Redesign do componente de cartão de crédito para seguir padrão visual do sistema
- Implementação de funcionalidades CRUD completas para cartões de crédito
- Adição de seletor de data para vencimento de cartões
- Redesign do componente de despesas fixas para seguir padrão visual do sistema
- Melhoria na visualização de status de pagamento com indicadores visuais coloridos
- Adição de ações para edição e exclusão nas tabelas de despesas
- Implementação de edição inline para despesas fixas
- Aprimoramento do formulário de despesas fixas para tratar corretamente operações de edição
- Adicionada comunicação entre componentes para edição de despesas fixas
- Redesign do componente de despesas recorrentes para seguir padrão visual do sistema
- Implementação de funcionalidades CRUD completas para despesas recorrentes
- Adicionada comunicação entre componentes para edição de despesas recorrentes
- Redesign do componente de faturas para seguir padrão visual do sistema
- Implementação da funcionalidade de pagamento de faturas
- Adição de feedback visual para indicar status de pagamento de faturas
- Melhoria na exibição das compras em faturas com detalhes expandíveis
- Adicionados indicadores de carregamento para melhorar experiência do usuário
- Substituição de diálogos confirm nativos por diálogos Angular Material para melhor experiência do usuário
- Adicionado componente reutilizável ConfirmDialogComponent para confirmações no sistema

## [1.3.5] - 2025-07-05

### Alterado

- Redesign do componente de cadastro de contas para layout minimalista
- Implementação de PrimeFlex para estilização e layout responsivo
- Melhorias de usabilidade no formulário de cadastro de contas

## [1.3.4] - 2025-07-04

### Alterado

- Adicionado HashLocationStrategy para rotas com hash (compatibilidade com ambientes de hospedagem estática)

## [1.3.3] - 2025-07-03

### Refatorado

- AuthService agora utiliza environment.apiUrl em todos os endpoints, garantindo build correto para produção e desenvolvimento

## [1.3.2] - 2025-07-03

### Alterado

- Ajuste do limite de tamanho do bundle inicial para 2MB (warning) e 2.5MB (error) no build de produção

## [1.3.1] - 2025-07-03

### Alterado

- Atualização do environment de produção para usar a URL da API `https://api.myfinance.lyto.com.br`

## [1.3.0] - 2025-07-03

### Adicionado

- Configuração de environments para desenvolvimento e produção
- Scripts npm para build e serve com ambientes distintos
- Ajuste das URLs dos serviços para uso do environment
- Atualização do README com badges e instruções
- Ajuste do angular.json para fileReplacements

### Alterado

- Versão do projeto para 1.3.0

## [1.2.0] - 2025-07-01

### Adicionado

- Redefinição de senha completa (backend e frontend)
- Persistência de tokens de redefinição no banco de dados
- Migration para tabela de tokens
- Feedback visual na redefinição de senha

### Corrigido
- Erro de transação ao remover token

## [1.1.0] - 2025-06-30
### Adicionado
- Recuperação de senha (envio de e-mail)
- Integração com Mailhog

## [1.0.0] - 2025-06-28
### Adicionado
- Cadastro, login, JWT, guard, logout, feedback visual
- Roadmap e changelog iniciais
