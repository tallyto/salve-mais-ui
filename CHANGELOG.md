# Changelog - Gestor Financeiro

## [Unreleased]

- Redesign completo do menu lateral para melhor organização e usabilidade
- Adição de categorias visuais no menu lateral para agrupar funcionalidades relacionadas
- Melhoria no design da barra de navegação superior
- Implementação de perfil de usuário com nome e email no menu
- Adição de abertura automática do menu lateral em telas maiores
- Melhorias visuais como sombras, cores e espaçamentos no menu
- Substituição de painéis expansíveis por links diretos para melhor navegação
- Implementação de indicador visual para o item de menu ativo
- Adição de versão do aplicativo no rodapé do menu lateral
- Redesign do componente de categoria para seguir padrão visual do sistema
- Implementação de funcionalidades CRUD completas para categorias
- Correção no serviço de categoria para usar métodos HTTP apropriados (PUT para atualização, POST para criação)
- Adição de ações para edição e exclusão nas tabelas de categorias
- Adição do roadmap de features (`doc/roadmap.md`)

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
