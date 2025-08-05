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

## Versão 1.7.0 - Metas Financeiras (Q4 2025)

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

## Versão 1.7.0 - Importação de Dados (Q4 2025)

### Objetivos Principais
- Facilitar a entrada de dados pelos usuários
- Reduzir o esforço manual para manter o controle financeiro

### Funcionalidades
- [ ] Importação de extratos bancários via CSV/OFX
- [ ] Categorização semi-automática de transações importadas
- [ ] Detecção de transações duplicadas na importação
- [ ] Assistente de importação guiado passo-a-passo

### Melhorias Técnicas
- [ ] Criação de um módulo separado para processamento de importação
- [ ] API escalável para processamento assíncrono de arquivos grandes
- [ ] Armazenamento seguro de arquivos temporários

## Versão 1.8.0 - Experiência Mobile Otimizada (Q1 2026)

### Objetivos Principais
- Tornar o app completamente utilizável em dispositivos móveis
- Oferecer experiência rica mesmo em conexões lentas

### Funcionalidades
- [ ] Layout adaptativo otimizado para smartphones e tablets
- [ ] PWA (Progressive Web App) com recursos offline básicos
- [ ] Melhorias de performance para conexões móveis
- [ ] Interface simplificada para operações comuns em dispositivos móveis

### Melhorias Técnicas
- [ ] Implementação de estratégias de cache inteligente
- [ ] Lazy loading de todos os módulos não essenciais
- [ ] Otimização de assets para reduzir tamanho de download
- [ ] Service workers para funcionalidades offline

## Versão 1.9.0 - Segurança e Perfil de Usuário (Q2 2026)

### Objetivos Principais
- Aumentar a segurança para dados financeiros sensíveis
- Melhorar a personalização por usuário

### Funcionalidades
- [ ] Autenticação de dois fatores (2FA)
- [ ] Perfil de usuário completo com preferências
- [ ] Configurações de privacidade e segurança
- [ ] Auditoria básica de ações do usuário (histórico de login, etc)
- [ ] Refresh token para manter sessões mais longas de forma segura

### Melhorias Técnicas
- [ ] Criptografia adicional para dados financeiros sensíveis
- [ ] Revisão de segurança geral e correções
- [ ] Implementação de logging e monitoramento avançado

## Versão 2.0.0 - Análise Avançada e Relatórios (Q3-Q4 2026)

### Objetivos Principais
- Oferecer insights financeiros personalizados
- Permitir planejamento financeiro a longo prazo

### Funcionalidades
- [ ] Previsões de gastos baseadas em histórico
- [ ] Relatórios personalizáveis e exportáveis (PDF, Excel)
- [ ] Dashboard analítico com tendências e padrões
- [ ] Comparações com períodos anteriores
- [ ] Alertas inteligentes para gastos anormais ou oportunidades de economia

### Melhorias Técnicas
- [ ] Implementação de algoritmos de análise de dados
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
