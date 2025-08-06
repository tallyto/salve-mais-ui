# Changelog - Salve Mais

## [1.8.7] - 2025-08-06

### Melhorado

- Design do componente de despesas recorrentes atualizado seguindo o novo padrão visual
- Adicionado cabeçalho estilizado com ícones para a página de despesas recorrentes
- Aprimoramento visual do formulário com ícones informativos para cada campo
- Redesign da listagem de despesas recorrentes com destaque para valores
- Melhor organização dos filtros de período para facilitar a navegação
- Estado vazio aprimorado para melhor orientação do usuário

---

## [1.8.6] - 2025-08-06

### Melhorado

- Design do componente de despesas fixas atualizado seguindo o novo padrão visual
- Adicionado cabeçalho estilizado com ícones para a página de despesas fixas
- Aprimoramento visual do formulário com ícones informativos para cada campo
- Redesign da listagem de despesas fixas com indicadores visuais de status (pago/pendente)
- Melhor visualização de valores com destaque para despesas pagas e pendentes
- Aperfeiçoamento da experiência do usuário com filtros mais intuitivos
- Estado vazio aprimorado para facilitar a orientação do usuário

---

## [1.8.5] - 2025-08-06

### Melhorado

- Design do componente de proventos atualizado seguindo o novo padrão visual
- Adicionado cabeçalho estilizado para a página de receitas
- Aprimoramento visual do formulário com ícones informativos
- Redesign da listagem de proventos com ícones para melhor visualização
- Aperfeiçoamento da experiência do usuário com visual mais atraente e consistente

---

## [1.8.4] - 2025-08-06

### Melhorado

- Design do componente de contas bancárias atualizado seguindo o novo padrão visual
- Adicionado cabeçalho estilizado para a página de contas
- Melhorias visuais no formulário de adição de contas com ícones
- Redesign da listagem de contas com cores de destaque para valores positivos e negativos
- Estado vazio aprimorado para melhor orientação do usuário

---

## [1.8.3] - 2025-08-06

### Melhorado

- Design do dashboard unificado seguindo o padrão visual do componente de notificações
- Centralização de ícones nas transações recentes para melhor visualização
- Aprimoramento no indicador de saúde financeira para melhor legibilidade
- Padronização dos cards com cores e estilos consistentes
- Experiência do usuário com visual mais coeso e profissional

---

## [1.8.2] - 2025-08-05

### Adicionado

- Suporte a notificações de faturas próximas do vencimento
- Novo tipo de filtro para visualização de faturas a vencer
- Endpoint adicional para obtenção de faturas próximas do vencimento

### Melhorado

- Interface de notificações agora exibe alertas para faturas que vencem em breve
- Estilo visual customizado para o novo tipo de notificação
- Experiência do usuário com acompanhamento completo de vencimentos de faturas

---

## [1.8.1] - 2025-08-05

### Melhorado

- Aprimorado o componente de notificações com melhor alinhamento de elementos
- Centralização dos ícones com o texto nos chips de filtro
- Ajuste visual no cabeçalho do card de filtros
- Refinamento da experiência do usuário com elementos visuais mais consistentes

### Alterado

- Melhorias na estrutura do HTML para garantir alinhamento adequado
- Estilização CSS aprimorada para centralização de elementos visuais
- Adicionado contêiner para o conteúdo dos chips de filtro

---

## [1.8.0] - 2025-08-05

### Alterado

- Rebrand completo da aplicação: nome alterado de "Gestor Financeiro" para "Salve Mais"
- Implementação de títulos dinâmicos nas páginas baseados na rota atual
- Atualização do título da página para refletir o contexto de cada seção

### Adicionado

- Sistema automático de atualização de título da página baseado na navegação
- Títulos específicos para cada rota (ex: "Dashboard - Salve Mais", "Login - Salve Mais")

---

## [1.7.0] - 2025-07-22

### Adicionado

- Exibição dinâmica da versão do app no menu lateral, obtida diretamente do package.json
- Suporte à importação de JSON no Angular (ajustes em tsconfig.json)

### Corrigido

- Ajuste de build para permitir importação de arquivos JSON (resolveJsonModule e esModuleInterop)

---

## [1.7.1] - 2025-07-22

### Alterado

- Refatoração: verificação local da validade do token JWT no login (sem chamada ao backend)
- Função `isTokenExpired` movida para `utils/jwt.util.ts` para reutilização

---
## [Unreleased]


## [1.6.1] - 2025-07-17

### Alterado

- Atualiza package.json para versão 1.6.1
- Marca versão 1.6.0 como concluída no roadmap
- Adiciona detalhes das funcionalidades implementadas no roadmap
- Reorganiza roadmap para próximas versões
- Documenta sistema de limites e contas recorrentes

---
## [1.6.0] - 2025-07-17

### Adicionado

- Sistema completo de gerenciamento de faturas manuais:
  - Componente `FaturaFormComponent` para criação e listagem de faturas
  - Formulário reativo com validação para criação de faturas manuais
  - Tabela com visualização de faturas cadastradas
  - Integração com `FaturaService` para operações CRUD
  - Interface para especificar cartão, valor e data de vencimento
  - Badges de status (Pago/Pendente) com design aprimorado
  - Formatação de moeda e data nas listagens

### Melhorado

- Sistema de relatórios mensais completamente reestruturado:
  - Removida seção "Outras Despesas" para simplificar visualização
  - Interface mais limpa e focada nos dados essenciais
  - Badges de status com melhor contraste e legibilidade
  - Badge "Pendente" agora usa esquema de cores amarelo/marrom para melhor UX
- Remoção do componente antigo de fatura (`FaturaComponent`):
  - Simplificado para usar apenas `FaturaFormComponent`
  - Rota `/faturas` agora direciona para funcionalidade completa
  - Menu lateral limpo sem duplicação de opções
  - Redução significativa de código e melhoria na manutenibilidade

### Corrigido

- Layout do formulário de faturas manuais:
  - Removido prefixo "R$" que quebrava o layout
  - Implementado `mat-datepicker` para melhor UX na seleção de datas
  - Validação de formulário aprimorada com mensagens de erro claras
- Arquitetura de componentes simplificada:
  - Removidas dependências não utilizadas
  - Limpeza de imports desnecessários no `app.module.ts`
  - Remoção de rotas duplicadas no sistema de roteamento

## [1.5.0] - 2025-07-06

### Melhorado

- Layout das telas de autenticação (login, registro, recuperação de senha) sem scroll indesejado
- Background das telas de autenticação agora cobre toda a tela corretamente
- Sidebar (menu lateral) com scroll apenas no conteúdo quando necessário
- Preservação da estilização da área do usuário na sidebar
- Comportamento responsivo da sidebar, alternando entre modos side/over conforme tamanho da tela
- Otimização de estilos CSS para melhorar o desempenho e reduzir o tamanho dos arquivos
- Aumento dos limites orçamentários de CSS para componentes maiores

## [1.5.0] - 2025-07-06

### Adicionado

- Implementação da funcionalidade "Lembrar-me" na tela de login
- Link para recuperação de senha na tela de login
- Indicador de carregamento na tela de recuperação de senha
- Suporte a multi-tenancy na tela de recuperação de senha
- Modernização da tela de redefinição de senha com design consistente
- Verificação de validade do token na tela de redefinição de senha
- Cadastro de tenant com confirmação por e-mail
- Validação de domínios empresariais no formulário de cadastro de tenant
- Envio automático do domínio no header durante login (X-Private-Tenant)
- Persistência do domínio no localStorage para uso futuro

### Melhorado

- Interface da tela de login com design moderno e responsivo
- Interface da tela de recuperação de senha com design consistente
- Interface da tela de redefinição de senha com material design
- Adicionado ícones para melhorar usabilidade nos formulários
- Implementação de validação visual para campos de formulário
- Alternância de visibilidade da senha em todos os formulários
- Adicionado logo do Salve Mais em todas as telas de autenticação
- Mensagens informativas nas telas de autenticação
- Navegação melhorada entre telas de autenticação
- Feedback visual durante o processamento de formulários
- Fluxo de cadastro e confirmação de tenant com UX aprimorada
- Regras visuais de validação para domínio de tenant
- Validação de domínios empresariais simplificada e mais robusta

## [1.4.0] - 2025-07-06

### Adicionado

- Implementação de exibição de compras de cartão no dashboard
- Criado modelo genérico Page para manipulação de respostas paginadas da API
- Implementação de indicadores de saúde financeira com dicas personalizadas
- Adição de resumo de contas bancárias diretamente no dashboard

### Melhorado

- Refatoração completa do dashboard com gráficos e visualizações integradas
- Implementação de gráficos nativos (pie, bar, line) para análise financeira
- Padronização visual e aprimoramento do CSS em todo o dashboard
- Melhorada responsividade para visualização em diferentes dispositivos
- Reorganizado CSS para melhor manutenção e consistência

### Corrigido

- Corrigido erro de tipo no ListDespesasRecorrentesComponent onde 'data' poderia ser 'null'
- Melhorado tratamento de erros em listagens para retornar objetos Page vazios
- Tratamento de fallback para quando a API do dashboard não está disponível
- Resolvido problema de carregamento do CSS do dashboard

## [1.3.5] - 2025-07-05

### Melhorado

- Redesign do componente de cadastro de contas para layout minimalista
- Implementação de PrimeFlex para estilização e layout responsivo
- Melhorias de usabilidade no formulário de cadastro de contas

## [1.3.4] - 2025-07-04

### Melhorado

- Adicionado HashLocationStrategy para rotas com hash (compatibilidade com ambientes de hospedagem estática)

## [1.3.3] - 2025-07-03

### Melhorado

- AuthService agora utiliza environment.apiUrl em todos os endpoints, garantindo build correto para produção e desenvolvimento

## [1.3.2] - 2025-07-03

### Melhorado

- Ajuste do limite de tamanho do bundle inicial para 2MB (warning) e 2.5MB (error) no build de produção

## [1.3.1] - 2025-07-03

### Melhorado

- Atualização do environment de produção para usar a URL da API `https://api.myfinance.lyto.com.br`

## [1.3.0] - 2025-07-03

### Adicionado

- Configuração de environments para desenvolvimento e produção
- Scripts npm para build e serve com ambientes distintos
- Ajuste das URLs dos serviços para uso do environment
- Atualização do README com badges e instruções
- Ajuste do angular.json para fileReplacements

### Melhorado

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
