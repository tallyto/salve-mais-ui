# Changelog - Salve Mais

## [Unreleased]

## [1.28.0] - 2025-12-07

### Melhorado

- **Menu Lateral com Nova Organização**:
  - Reorganização completa das seções do menu:
    - 💰 Finanças: Contas, Receitas, Reserva de Emergência e Transações
    - 💳 Cartões de Crédito: Cartões, Faturas, Limites e Comprovantes
    - 📊 Despesas: Pagamentos, Fixas, Assinaturas, Parceladas e Débito
    - 📈 Análises e Relatórios: Relatório Mensal e Regra 50/30/20
    - ⚙️ Configurações: Categorias, Usuários, Notificações e Sistema
  - Emojis nos cabeçalhos das seções para melhor identificação visual
  - Ícones atualizados e mais apropriados:
    - `account_balance_wallet` para Contas Bancárias
    - `trending_up` para Receitas
    - `event_repeat` para Despesas Fixas
    - `subscriptions` para Assinaturas e Serviços
    - `pending_actions` para Status de Pagamentos
    - `gpp_maybe` para Limites e Alertas
    - `bar_chart` para Relatório Mensal
    - `label` para Categorias
    - `notifications` para Notificações por Email
  - Melhorias visuais no design:
    - Barra lateral com gradiente sutil de fundo (#fafafa a #ffffff)
    - Borda lateral colorida (3px azul) nos itens ativos
    - Efeito hover suave com fundo translúcido
    - Item ativo com gradiente horizontal e fonte em negrito
    - Scrollbar customizada e discreta (6px, arredondada)
    - Cabeçalhos de seção com fonte menor (0.7rem) e mais peso (600)
    - Espaçamento otimizado entre itens (44px altura)
    - Ícones com tamanho consistente (20px)
    - Rodapé com fundo diferenciado para versão da aplicação
  - Melhor hierarquia visual e navegação mais intuitiva

## [1.27.0] - 2025-12-07

### Adicionado

- **Interface de Compras em Débito**:
  - Novo componente `CompraDebitoFormComponent` para registro e edição:
    - Formulário reativo com validações completas
    - Campos: descrição, categoria, conta, data, valor, observações
    - Modo criação e edição com restrições apropriadas
    - Desabilita edição de valor, conta e data em modo edição
    - Alertas informativos sobre débito automático
    - Validação de saldo insuficiente
    - Integração com directive `CurrencyInput` para formatação monetária
  - Novo componente `ListComprasDebitoComponent` para visualização:
    - Tabela com paginação e ordenação
    - Filtros por mês e ano
    - Navegação rápida entre meses (anterior/próximo)
    - Colunas: descrição, categoria, data, valor, observações, ações
    - Badge visual para categorias
    - Tooltip para observações longas
    - Card de resumo com total de compras e valor total
    - Botão para exportar para Excel (preparado para implementação futura)
  - Service `CompraDebitoService` com métodos:
    - `criarCompraDebito()` - Criar nova compra
    - `listarCompras()` - Listar com paginação e filtros
    - `buscarCompraPorId()` - Buscar compra específica
    - `atualizarCompraDebito()` - Atualizar compra existente
    - `excluirCompraDebito()` - Excluir compra
    - `listarComprasPorCategoria()` - Filtrar por categoria
    - `calcularTotalPorPeriodo()` - Calcular totais
  - Models TypeScript:
    - `CompraDebito` - Interface para dados da compra
    - `CompraDebitoInput` - Interface para criação/edição

### Melhorado

- **Dashboard integrado com Compras em Débito**:
  - Seção "Compras em Débito do Mês" exibe compras do período selecionado
  - Tabela com descrição, categoria, data, valor e observações
  - Badge visual para categorias e tooltip para observações longas
  - Link para navegar para listagem completa
  - Atualiza automaticamente ao mudar mês/ano nos filtros
  - Gráficos (pizza, barras, linha) incluem compras débito nos cálculos
  - Resumo financeiro considera compras débito nas despesas mensais
- **Navegação e Rotas**:
  - Adicionada rota `/compras-debito` para listagem
  - Adicionada rota `/compras-debito/nova` para criação
  - Adicionada rota `/compras-debito/editar/:id` para edição
  - Item de menu "Compras em Débito" com ícone `point_of_sale`
- **Experiência do Usuário**:
  - Mensagens de sucesso/erro com snackbar
  - Confirmação antes de excluir compra
  - Loading states durante operações
  - Design consistente com Angular Material
  - Responsividade para mobile e tablet
  - Navegação intuitiva com botão voltar

### Corrigido

- Mapeamento de coluna `data_compra` no backend (PostgreSQL snake_case)
- Sintaxe de migração PostgreSQL (BIGSERIAL ao invés de AUTO_INCREMENT)
- Expressões de template Angular com múltiplos statements
- Optional chaining desnecessário em acesso a arrays

## [1.26.0] - 2025-12-07

### Adicionado

- **Botões Rápidos no Dashboard**:
  - Nova seção "Ações Rápidas" com 6 botões de acesso direto:
    - Nova Despesa Fixa
    - Nova Receita
    - Compra Parcelada
    - Pagar Fatura
    - Ver Transações
    - Relatório Mensal
  - Grid responsivo (6 colunas desktop, 2 tablet, 1 mobile)
  - Hover effect com elevação dos botões
  - Ícones intuitivos para cada ação
  - CSS otimizado com transições suaves

### Melhorado

- **Nomenclatura do Menu Lateral** - Nomes mais intuitivos e claros:
  - "Débitos em Conta" → "Despesas Fixas"
  - "Gastos Recorrentes no Cartão" → "Assinaturas e Serviços"
  - "Proventos" → "Receitas"
- **Ícones do Menu**:
  - Receitas: `trending_up` → `attach_money` (mais representativo)
  - Assinaturas: `credit_card` → `autorenew` (indica recorrência)
- Experiência do usuário com acesso mais rápido às funcionalidades principais
- Navegação mais intuitiva com termos do dia a dia

## [1.25.0] - 2025-12-07

### Adicionado

- **Interface de Configuração de Notificações por Email**:
  - Novo componente `NotificacoesEmailConfigComponent` completo:
    - Formulário reativo com toggle ativo/inativo
    - Seletor de horário com 9 opções mais comuns (6h-22h)
    - Preview visual do email que será enviado
    - Status badge com indicador visual (Ativo/Inativo/Não Configurado)
    - Botão "Enviar Teste" para validar configurações
    - Botões de ação: Salvar, Enviar Teste, Recarregar, Desabilitar
  - Service `NotificacaoEmailService` com métodos:
    - `obterConfiguracao()` - Buscar configuração atual
    - `salvarConfiguracao()` - Criar/atualizar configuração
    - `desabilitarNotificacao()` - Desativar envio
    - `enviarNotificacaoTeste()` - Testar envio imediato
  - Integração completa com menu lateral (seção Configurações)
  - Rota protegida: `/notificacoes-email-config`
  - CSS responsivo com mais de 300 linhas de estilo profissional
  - Cards informativos explicando funcionamento
  - Feedback visual com loading states e mensagens de sucesso/erro

### Melhorado

- Sistema de notificações expandido com novos tipos
- Template de email com informações mais detalhadas
- Experiência do usuário com validações e hints
- Tratamento de erros específicos (404, validação, etc.)

### Modificado

- Horários disponíveis reduzidos de 24 para 9 opções mais práticas:
  - Manhã: 06:00, 07:00, 08:00 (Recomendado), 09:00
  - Tarde: 12:00, 14:00, 18:00
  - Noite: 20:00, 22:00

## [1.21.0] - 2025-11-25

### Adicionado

- **Diretiva CurrencyInput para formatação automática de valores monetários**:
  - Nova diretiva `appCurrencyInput` para campos de valor
  - Formatação automática com centavos ao digitar
  - Separadores brasileiros (vírgula para decimais, ponto para milhares)
  - Limite de 10 dígitos (até R$ 99.999.999,99)
  - Aplicada em todos os campos de valor monetário:
    - Fatura - Valor Total
    - Compra Parcelada - Valor Total
    - Conta Fixa Recorrente - Valor por Parcela
    - Despesas Fixas - Valor
    - Provento - Valor
    - Reserva de Emergência - Contribuição Mensal e Valor Inicial
    - Reserva de Emergência - Valor a adicionar

### Melhorado

- Experiência do usuário ao inserir valores monetários
- Validação automática de valores dentro de limites realistas
- Consistência na formatação de moeda em toda a aplicação

## [1.20.0] - 2025-11-24

### Adicionado

- **Funcionalidade de exportação Excel do Dashboard**:
  - Botão "Exportar Excel" no header do dashboard
  - Integração com endpoint do backend para geração de Excel
  - Download automático de arquivo Excel (.xlsx) formatado
  - Arquivo com 6 abas organizadas contendo todos os dados do dashboard
  - Nome do arquivo dinâmico baseado no período selecionado
  - Tratamento de erros e feedback visual ao usuário
  - Integração com filtros de mês/ano existentes
  - Tooltip explicativo e botão desabilitado durante carregamento
  - Substituição completa da funcionalidade CSV anterior por Excel profissional

### Melhorado

- Layout do header do dashboard com nova organização visual
- CSS responsivo para botão de exportação
- Experiência do usuário na exportação de dados

## [1.19.0] - 2025-11-20

### Adicionado

- Melhorias gerais no dashboard e filtros

## [1.18.0] - 2025-11-16

### Adicionado

- **Exportação de débitos em conta para Excel**
  - Botão de exportação no componente de débitos em conta
  - Exportação filtrada por mês e ano selecionado
  - Arquivo Excel (.xlsx) com formatação automática
  - Colunas: Nome, Categoria, Conta, Vencimento, Valor e Status
  - Linha de total com soma dos valores
  - Formatação de moeda (R$) e datas (dd/MM/yyyy)
  - Largura de colunas ajustada automaticamente

## [1.17.0] - 2025-11-16

### Adicionado

- **Filtros de período no Dashboard**
  - Seletores de mês e ano para visualizar dados de períodos anteriores e futuros
  - Botões de navegação rápida (mês anterior/próximo)
  - Atalhos rápidos: "Hoje", "Mês Passado" e "Próximo"
  - Design consistente com componente de débito em conta
  - Atualização automática de todos os dados ao alterar o período:
    - Resumo financeiro (saldo, receitas, despesas)
    - Gráficos de despesas por categoria
    - Dados de variação mensal
    - Compras de cartão
  - Interface visual com destaque do período selecionado
  - Suporte completo no backend para filtros de mês/ano

### Backend

- Endpoints do DashboardController atualizados para aceitar parâmetros opcionais de mês e ano:
  - `/api/dashboard/summary?mes={mes}&ano={ano}`
  - `/api/dashboard/expenses-by-category?mes={mes}&ano={ano}`
  - `/api/dashboard/variations?mes={mes}&ano={ano}`
- DashboardService.java modificado para filtrar dados conforme mês/ano especificado
- Manutenção da compatibilidade com requisições sem parâmetros (mês atual como padrão)

## [1.16.0] - 2025-11-02

### Adicionado

- **Nova funcionalidade: Status de Pagamentos**
  - Componente `PagamentosStatusComponent` para visão consolidada de pagamentos
  - Cards de resumo com total pago e total pendente do mês atual
  - Seção de Faturas de Cartão:
    - Tabela de faturas pendentes com destaque visual
    - Tabela de faturas pagas com informações completas
    - Filtro automático por mês/ano atual
  - Seção de Contas Fixas:
    - Tabela de contas pendentes
    - Tabela de contas pagas
    - Badges de categoria para melhor organização
  - Seção de Compras Parceladas:
    - Cards individuais para cada compra
    - Visualização de parcelas pagas e pendentes do mês
    - Barra de progresso do total de parcelas
    - Informações detalhadas: cartão, categoria, valores
  - Rota `/pagamentos-status` adicionada ao sistema
  - Link de acesso no menu lateral sob "Despesas e Pagamentos"
  - Design moderno com efeitos hover e elevação
  - Layout responsivo otimizado para desktop e mobile
  - Empty states para quando não há dados
  - Integração com serviços existentes: FaturaService, ContasFixasService, CompraParceladaService

### Melhorado

- Ícone de "Compras Parceladas" alterado de `payment` para `shopping_cart` no menu lateral para melhor identificação

## [1.15.0] - 2025-10-05

### Adicionado

- Funcionalidade de edição de compras parceladas:
  - Novo endpoint PUT no service para atualizar compras parceladas
  - Suporte para modo de edição no formulário de compra parcelada
  - Detecção automática de modo de criação ou edição via parâmetros de rota
  - Botão de edição na listagem de compras parceladas
  - Nova rota `/compras-parceladas/editar/:id` configurada
  - Carregamento automático dos dados da compra ao abrir em modo de edição
  - Título e botões dinâmicos conforme o modo (criar/editar)
  - Mensagens de feedback diferenciadas para criação e edição

### Melhorado

- Interface do formulário de compra parcelada com suporte a edição
- Validação mantida tanto para criação quanto para edição
- Experiência do usuário com SnackBar ao invés de alerts

## [1.14.0] - 2025-09-12

### Adicionado

- Sistema de comprovantes:
  - Nova interface para visualização de todos os comprovantes
  - Integração no menu lateral para acesso rápido
  - Melhorias no serviço de anexos
- Gerenciamento de contas:
  - Funcionalidade de transferência entre contas
  - Possibilidade de edição do nome do titular na listagem de contas
  - Exibição do tipo de conta como badge visual na listagem
- Melhorias no componente de regra de orçamento 50/30/20:
  - Suporte para ícones do Material Design
  - Layout mais informativo para o card de dicas de orçamento
  - Animações nos gráficos e barras de progresso
  - Mais dicas práticas para cada categoria financeira
  - Atualização para usar PrimeFlex em vez de Bootstrap

### Alterado

- Removida a edição direta de saldo das contas, substituída pela funcionalidade de transferência
- Melhorada a disposição dos gráficos no componente de regra de orçamento
- Padronizado o estilo visual de todos os cards no componente de orçamento

### Corrigido

- Resolvidos problemas de build
- Corrigido alinhamento do card de dicas no componente de regra de orçamento

## [1.13.0] - 2025-08-26

### Adicionado

- Sistema centralizado de tratamento de erros para a aplicação:
  - Novo serviço ErrorHandlerService para processamento consistente de erros HTTP
  - Tratamento específico para diferentes códigos de status HTTP (401, 403, 404, 409, 422, 500+)
  - Extração automática de mensagens de erro do backend para exibição ao usuário
  - Integração com serviços existentes (Categoria, Conta, Cartão)
  - Melhor experiência do usuário com mensagens de erro claras e informativas
  - Suporte para diferentes formatos de resposta de erro do backend

## [1.12.1] - 2025-08-23

### Adicionado

- Sistema completo de Reserva de Emergência:
  - Nova página para visualização de reservas de emergência
  - Formulário para criação e edição de reservas
  - Integração com o backend para cálculo automático de objetivo
  - Interface para gerenciamento de contribuições para a reserva
  - Seleção simplificada de contas para facilitar testes
  - Visualização do progresso da reserva com indicadores visuais
  - Simulação de tempo para completar a reserva baseado na contribuição mensal
- Integração com tipos de conta:
  - Atualização dos modelos para suportar diferentes tipos de conta
  - Suporte a contas com rendimento

### Melhorado

- Flexibilidade na seleção de contas para diferentes funcionalidades
- Interface de usuário intuitiva para gerenciamento financeiro

## [Unreleased]

### Adicionado

- Sistema de anexos de comprovantes para contas fixas:
  - Componente de diálogo para upload, visualização e download de comprovantes
  - Integração com a API de anexos no backend
  - Botão para acesso ao gerenciamento de comprovantes na listagem de contas fixas
  - Interface intuitiva para upload de arquivos com feedback visual
  - Visualização de lista de comprovantes com informações detalhadas
  - Funcionalidade de download de comprovantes via URL assinada
  - Opção para remoção de comprovantes

---

## [1.9.3] - 2025-08-06

### Melhorado

- Design do componente de gerenciamento de categorias atualizado seguindo o novo padrão visual
- Adicionado cabeçalho estilizado com ícones para a página de categorias
- Reformulação do layout de formulário para melhor experiência do usuário
- Aprimoramento visual com ícones informativos para cada campo
- Redesign da tabela de categorias para melhor visualização
- Melhor organização dos botões de ação com ícones correspondentes
- Adicionado suporte para visualização de estado vazio na listagem
- Design responsivo otimizado para dispositivos móveis

---

## [1.9.2] - 2025-08-06

### Melhorado

- Interface do relatório mensal simplificada para uma visualização mais clean
- Removidas animações e efeitos de hover para uma experiência mais leve
- Reduzidos os tamanhos de bordas, padding e espaçamento
- Simplificação dos indicadores visuais mantendo a funcionalidade
- Ajustados tamanhos de fonte e ícones para um visual mais minimalista
- Otimização da experiência em dispositivos móveis com layout mais eficiente
- Redução das sombras e destaque visual apenas em elementos importantes
- Melhorada a hierarquia visual com menos distrações

---

## [1.9.1] - 2025-08-06

### Melhorado

- Design do componente de relatório mensal atualizado seguindo o novo padrão visual
- Adicionado cabeçalho estilizado com ícones para a página de relatório mensal
- Reformulação visual das tabelas com melhor legibilidade e indicadores visuais
- Cards de resumo financeiro aprimorados com codificação de cores e ícones intuitivos
- Melhorias nos painéis expansíveis de cartões com indicadores visuais de status
- Aperfeiçoamento dos badges de status com ícones informativos
- Animações sutis adicionadas para melhorar a experiência do usuário
- Estado vazio para contas vencidas com mensagem positiva
- Design responsivo aprimorado para visualização em dispositivos móveis
- Área de contas vencidas destacada com alerta visual e animação de ícone

---

## [1.9.0] - 2025-08-06

### Melhorado

- Design do componente de faturas atualizado seguindo o novo padrão visual
- Adicionado cabeçalho estilizado com ícones para a página de gerenciamento de faturas
- Aprimoramento visual do formulário de criação de faturas com ícones informativos
- Redesign da listagem de faturas com melhor visualização dos status e valores
- Melhorias visuais nos indicadores de status (pendente/pago) com ícones intuitivos
- Seção de geração automática de faturas reformulada com design mais moderno
- Estado vazio aprimorado para melhor orientação do usuário

---

## [1.8.9] - 2025-08-06

### Melhorado

- Design do componente de limites de cartões atualizado seguindo o novo padrão visual
- Adicionado cabeçalho estilizado com ícones para a página de gestão de limites
- Aprimoramento visual do formulário de configuração de limites com ícones informativos
- Redesign dos cards de alertas para melhor visualização dos cartões em situação crítica
- Melhorias na tabela de status dos limites com indicadores visuais mais claros
- Estado vazio aprimorado para melhor orientação do usuário
- Adicionado cabeçalho estilizado com ícones para a página de cartões de crédito
- Aprimoramento visual do formulário com ícones informativos para cada campo
- Redesign da listagem de cartões com melhor organização e visualização
- Estado vazio aprimorado para melhor orientação do usuário
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
