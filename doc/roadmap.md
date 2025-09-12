# Roadmap - Salve Mais

> **Roadmap Estratégico para Equipe de 2 Pessoas (2025-2026)**

Este roadmap foi elaborado considerando uma equipe pequena de dois desenvolvedores, focando em entregas de alto valor com esforço gerenciável. As versões estão organizadas em ordem de prioridade e impacto para os usuários.

## ✅ Versão 1.6.0 - Sistema de Limites e Contas Recorrentes (Q3 2025) - **CONCLUÍDO**

### Objetivos Principais ✅
- ✅ Implementar sistema de limites para cartões de crédito
- ✅ Implementar sistema de contas fixas recorrentes
- ✅ Melhorar controle de gastos e planejamento financeiro

### Funcionalidades Implementadas ✅
- ✅ **Sistema de Limites de Cartão**
  - ✅ Configuração de limite total e percentual de alerta por cartão
  - ✅ Monitoramento em tempo real do uso vs limite disponível
  - ✅ Widget de alertas no dashboard com atualização automática
  - ✅ Validação preventiva em compras que excedem limite
  - ✅ Interface responsiva com indicadores visuais (cores, ícones, barras)

- ✅ **Sistema de Contas Fixas Recorrentes**
  - ✅ Criação automática de múltiplas contas fixas com recorrência
  - ✅ Suporte a 5 tipos: Mensal, Bimensal, Trimestral, Semestral, Anual
  - ✅ Interface moderna com formulário reativo e validações
  - ✅ Cálculos automáticos de datas e valores totais
  - ✅ Card de ajuda com instruções e exemplos práticos
  - ✅ Acesso rápido via toolbar e menu lateral

### Melhorias Técnicas Implementadas ✅
- ✅ Novos DTOs para limites (CartaoLimiteDTO, CartaoLimiteStatusDTO)
- ✅ Expansão do CartaoCreditoService com métodos de limite
- ✅ Novos endpoints REST para gerenciamento de limites
- ✅ Componentes standalone Angular para melhor modularização
- ✅ Validações robustas no frontend e backend
- ✅ Documentação completa das funcionalidades

## ✅ Versão 1.12.0-1.14.0 - Funcionalidades Implementadas (Q3-Q4 2025) - **CONCLUÍDO**

### Objetivos Principais ✅
- ✅ Implementar sistema de reserva de emergência
- ✅ Implementar sistema de comprovantes/anexos
- ✅ Melhorar gerenciamento de contas
- ✅ Aprimorar componente de regras orçamentárias
- ✅ Implementar tratamento centralizado de erros

### Funcionalidades Implementadas ✅
- ✅ **Sistema de Reserva de Emergência**
  - ✅ Nova página para visualização de reservas de emergência
  - ✅ Formulário para criação e edição de reservas
  - ✅ Integração com o backend para cálculo automático de objetivo
  - ✅ Interface para gerenciamento de contribuições para a reserva
  - ✅ Visualização do progresso da reserva com indicadores visuais
  - ✅ Simulação de tempo para completar a reserva baseado na contribuição mensal

- ✅ **Sistema de Comprovantes**
  - ✅ Interface para visualização de todos os comprovantes
  - ✅ Componente de diálogo para upload, visualização e download
  - ✅ Integração com a API de anexos no backend
  - ✅ Funcionalidade de download de comprovantes via URL assinada

- ✅ **Melhorias no Gerenciamento de Contas**
  - ✅ Transferência entre contas
  - ✅ Edição do nome do titular na listagem de contas
  - ✅ Exibição do tipo de conta como badge visual
  - ✅ Suporte a contas com rendimento

- ✅ **Melhorias na Regra de Orçamento 50/30/20**
  - ✅ Suporte para ícones do Material Design
  - ✅ Layout mais informativo para o card de dicas de orçamento
  - ✅ Animações nos gráficos e barras de progresso
  - ✅ Atualização para usar PrimeFlex em vez de Bootstrap

### Melhorias Técnicas Implementadas ✅
- ✅ Sistema centralizado de tratamento de erros
- ✅ Tratamento específico para diferentes códigos de status HTTP
- ✅ Extração automática de mensagens de erro do backend

## Versão 1.15.0 - Metas Financeiras (Q4 2025)

### Objetivos Principais
- Implementar sistema de metas financeiras para usuários
- Melhorar experiência de planejamento financeiro

### Funcionalidades
- [ ] Criação e edição de metas financeiras com valores e prazos
- [ ] Visualização do progresso das metas (% completo, tempo restante)
- [ ] Dashboard com exibição de metas em andamento
- [ ] Notificações de metas próximas de conclusão ou atrasadas
- [ ] Recomendações para atingir metas baseadas no padrão de gastos

### Melhorias Técnicas
- [ ] Refatoração de componentes compartilhados para reduzir duplicação de código
- [ ] Implementação de testes automatizados para os fluxos principais
- [ ] Otimização de queries para melhorar performance

## Versão 1.16.0 - Importação e Análise de Dados (Q1 2026)

### Objetivos Principais
- Facilitar a entrada de dados pelos usuários
- Reduzir o esforço manual para manter o controle financeiro
- Fornecer insights financeiros baseados em dados

### Funcionalidades
- [ ] Importação de extratos bancários via CSV/OFX
- [ ] Categorização semi-automática de transações importadas
- [ ] Detecção de transações duplicadas na importação
- [ ] Assistente de importação guiado passo-a-passo
- [ ] Análise de padrões de gastos com sugestões personalizadas
- [ ] Alertas inteligentes para gastos anormais ou fora do padrão

### Melhorias Técnicas
- [ ] Criação de um módulo separado para processamento de importação
- [ ] API escalável para processamento assíncrono de arquivos grandes
- [ ] Armazenamento seguro de arquivos temporários
- [ ] Implementação de algoritmos de análise de dados

## Versão 1.17.0 - Gerenciamento de Assinaturas (Q2 2026)

### Objetivos Principais
- Ajudar usuários a monitorar e otimizar gastos com assinaturas
- Evitar cobranças indesejadas de serviços esquecidos

### Funcionalidades
- [ ] Detecção automática de transações recorrentes como possíveis assinaturas
- [ ] Cadastro manual de assinaturas com período, valor e data de renovação
- [ ] Dashboard específico para visualização de todas as assinaturas
- [ ] Alertas de renovação próxima para evitar cobranças indesejadas
- [ ] Análise de custo-benefício de assinaturas
- [ ] Sugestões para otimização de gastos com assinaturas

### Melhorias Técnicas
- [ ] Algoritmos de detecção de padrões para identificar assinaturas
- [ ] Sistema de notificações por e-mail/push para alertas de renovação
- [ ] Integração com APIs de serviços populares para dados de preços

## Versão 1.18.0 - Experiência Mobile Otimizada (Q3 2026)

### Objetivos Principais
- Tornar o app completamente utilizável em dispositivos móveis
- Oferecer experiência rica mesmo em conexões lentas

### Funcionalidades
- [ ] Layout adaptativo otimizado para smartphones e tablets
- [ ] PWA (Progressive Web App) com recursos offline básicos
- [ ] Melhorias de performance para conexões móveis
- [ ] Interface simplificada para operações comuns em dispositivos móveis
- [ ] Escaneamento de recibos/notas fiscais via câmera do dispositivo
- [ ] Entrada rápida de despesas via interface mobile-first

### Melhorias Técnicas
- [ ] Implementação de estratégias de cache inteligente
- [ ] Lazy loading de todos os módulos não essenciais
- [ ] Otimização de assets para reduzir tamanho de download
- [ ] Service workers para funcionalidades offline
- [ ] Integração com APIs nativas (câmera, armazenamento)

## Versão 1.19.0 - Finanças Compartilhadas (Q4 2026)

### Objetivos Principais
- Permitir gerenciamento financeiro para famílias ou grupos
- Facilitar divisão de despesas e controle de gastos compartilhados

### Funcionalidades
- [ ] Criação de grupos financeiros (família, casal, república, viagem)
- [ ] Convite de membros para participação em grupos
- [ ] Divisão de despesas entre membros com diferentes percentuais
- [ ] Controle de quem pagou e quem deve
- [ ] Histórico de transações do grupo
- [ ] Dashboard compartilhado com visão consolidada

### Melhorias Técnicas
- [ ] Sistema de permissões por usuário/grupo
- [ ] Notificações em tempo real para atividades do grupo
- [ ] Criptografia de dados compartilhados
- [ ] Mecanismos de sincronização para múltiplos usuários

## Versão 2.0.0 - Inteligência Financeira e Educação (Q1-Q2 2027)

### Objetivos Principais
- Oferecer insights financeiros personalizados com IA
- Promover educação financeira e boas práticas
- Permitir planejamento financeiro a longo prazo

### Funcionalidades
- [ ] Assistente financeiro com IA para recomendações personalizadas
- [ ] Previsões de gastos baseadas em histórico
- [ ] Módulos educativos sobre temas financeiros (investimentos, poupança, dívidas)
- [ ] Simuladores de cenários financeiros (aposentadoria, compra de imóvel)
- [ ] Desafios gamificados para incentivar hábitos financeiros saudáveis
- [ ] Chatbot para dúvidas sobre finanças e uso do aplicativo
- [ ] Relatórios personalizáveis e exportáveis (PDF, Excel)
- [ ] Impacto ambiental de compras e sugestões sustentáveis

### Melhorias Técnicas
- [ ] Integração com APIs de IA para processamento de linguagem natural
- [ ] Implementação de algoritmos de machine learning para previsões
- [ ] Gamificação com sistema de recompensas e conquistas
- [ ] Refatoração do backend para suportar análises complexas
- [ ] Otimização do banco de dados para grandes volumes de dados históricos

## Considerações para Implementação

### Estratégia para Equipe Reduzida
- **Foco em MVP**: Para cada versão, definir o mínimo viável que entrega valor
- **Releases frequentes**: Ciclos de 2-3 meses para manter o momentum
- **Automação**: Investir em CI/CD e testes para reduzir trabalho manual
- **Refatoração constante**: Manter a qualidade do código para facilitar futuras adições

### Priorização
- Priorizar features com maior impacto para os usuários e menor esforço técnico
- Balancear novas funcionalidades com melhorias técnicas para evitar débito técnico
- Coletar feedback dos usuários para ajustar prioridades entre versões

### Técnicas para Otimizar o Desenvolvimento
- Componentização para reuso máximo de código
- Documentação clara de APIs e arquitetura
- Sprints curtos (1-2 semanas) com metas realistas
- Revisão periódica do roadmap para ajustes conforme necessário

## Infraestrutura e DevOps

- [x] Integração com Mailhog para e-mails
- [x] Configuração de e-mail e segurança
- [x] Documentação da API
- [x] Roadmap e changelog organizados
- [x] Ambientes separados para desenvolvimento e produção
- [x] Build otimizado com limites de tamanho configurados
- [x] Script de deploy para ambiente de produção
- [ ] Monitoramento de performance e erros em produção
- [ ] Backup automatizado de dados
- [ ] Implementação de pipeline CI/CD completo
- [ ] Containerização com Docker para facilitar deploy
- [ ] Estratégia de feature flags para lançamentos controlados

## Validação e Testes

- [ ] Validação avançada de formulários
- [ ] Testes unitários no frontend
- [ ] Testes de integração no backend
- [ ] Testes e2e para fluxos principais
- [ ] CI/CD para testes automatizados
- [ ] Testes de usabilidade com usuários reais
- [ ] Testes de performance e carga

---

Última atualização: 12/09/2025
- [ ] Auditoria básica de ações do usuário (histórico de login, etc)
- [ ] Refresh token para manter sessões mais longas de forma segura

### Melhorias Técnicas
- [ ] Criptografia adicional para dados financeiros sensíveis
- [ ] Revisão de segurança geral e correções
- [ ] Implementação de logging e monitoramento avançado

## Versão 2.1.0 - Integração com Serviços Externos (Q3-Q4 2027)

### Objetivos Principais
- Ampliar o ecossistema do aplicativo
- Oferecer integrações com serviços financeiros externos

### Funcionalidades
- [ ] Integração com Open Banking para sincronização automática de transações
- [ ] Integração com carteiras de criptomoedas para rastreamento de ativos digitais
- [ ] Conexão com plataformas de investimentos para visão consolidada
- [ ] Suporte a múltiplas moedas para usuários internacionais ou que viajam
- [ ] API pública para desenvolvedores externos criarem integrações
- [ ] Widget para outros aplicativos/sistemas

### Melhorias Técnicas
- [ ] Implementação de protocolos de autenticação OAuth para integrações
- [ ] Sistema de webhooks para notificações de eventos
- [ ] Cache distribuído para melhorar performance com dados externos
- [ ] Implementação de medidas de segurança adicionais para conexões externas

## Considerações para Implementação

### Estratégia para Equipe Reduzida
- **Foco em MVP**: Para cada versão, definir o mínimo viável que entrega valor
- **Releases frequentes**: Ciclos de 2-3 meses para manter o momentum
- **Automação**: Investir em CI/CD e testes para reduzir trabalho manual
- **Refatoração constante**: Manter a qualidade do código para facilitar futuras adições

### Priorização
- Priorizar features com maior impacto para os usuários e menor esforço técnico
- Balancear novas funcionalidades com melhorias técnicas para evitar débito técnico
- Coletar feedback dos usuários para ajustar prioridades entre versões

### Técnicas para Otimizar o Desenvolvimento
- Componentização para reuso máximo de código
- Documentação clara de APIs e arquitetura
- Sprints curtos (1-2 semanas) com metas realistas
- Revisão periódica do roadmap para ajustes conforme necessário

- [x] Endpoints completos para dashboard
- [x] Endpoints CRUD para todas as entidades principais
- [x] Documentação da API (Swagger/OpenAPI)
- [x] Serviço de cadastro e confirmação de tenant
- [x] Configuração CORS para suportar multi-tenancy
- [ ] Caching para melhorar performance
- [ ] Otimização de consultas ao banco de dados
- [ ] Monitoramento e logging avançados

## Validação e Testes

- [ ] Validação avançada de formulários
- [ ] Testes unitários no frontend
- [ ] Testes de integração no backend
- [ ] Testes e2e para fluxos principais
- [ ] CI/CD para testes automatizados

## Infraestrutura e DevOps

- [x] Integração com Mailhog para e-mails
- [x] Configuração de e-mail e segurança
- [x] Documentação da API
- [x] Roadmap e changelog organizados
- [x] Ambientes separados para desenvolvimento e produção
- [x] Build otimizado com limites de tamanho configurados
- [x] Script de deploy para ambiente de produção
- [ ] Monitoramento de performance e erros em produção
- [ ] Backup automatizado de dados

## Novas Funcionalidades

- [ ] Categorização automática de transações
- [ ] Metas financeiras e tracking de progresso
- [ ] Notificações e lembretes de contas a pagar
- [ ] Importação de transações via CSV/OFX
- [ ] Integração com bancos via Open Banking
- [ ] App mobile com funcionalidades principais

---

Última atualização: 06/07/2025
