# Changelog - Gestor Financeiro

## [Unreleased]
- Adição do roadmap de features (`doc/roadmap.md`)
- Implementação de autenticação JWT (login, cadastro, interceptor)
- Proteção de rotas com AuthGuard
- Criação das telas de login e cadastro
- Integração do front-end com o backend para autenticação
- Estruturação inicial do projeto Angular

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
