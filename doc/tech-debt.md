# Débitos Técnicos - Gestor Financeiro UI

Este documento lista os débitos técnicos identificados no frontend do projeto Gestor Financeiro. Estes são itens que podem ser trabalhados quando o backlog de funcionalidades não estiver pronto ou durante períodos de menor carga de desenvolvimento.

## Testes

1. **Cobertura de Testes Insuficiente** - Prioridade: Alta
   - Problema: Poucos componentes possuem testes unitários implementados.
   - Solução: Implementar testes para componentes críticos (autenticação, dashboard, formulários principais).
   - Benefício: Redução de regressões, maior confiabilidade e facilidade para refatorações futuras.
   - Esforço estimado: 3-4 dias.

2. **Testes E2E Ausentes** - Prioridade: Baixa
   - Problema: Sem testes end-to-end para fluxos críticos.
   - Solução: Implementar testes E2E com Cypress ou Playwright para fluxos principais.
   - Esforço estimado: 2-3 dias.

## Arquitetura e Código

3. **Versões Diferentes de Angular Material** - Prioridade: Alta
   - Problema: Material na versão 16.x enquanto Angular está na 17.x, causando potenciais incompatibilidades.
   - Solução: Atualizar Angular Material para a versão compatível com o Angular 17.
   - Esforço estimado: 1-2 dias.

4. **Componentes com Muitas Responsabilidades** - Prioridade: Média
   - Problema: Alguns componentes estão muito grandes e com múltiplas responsabilidades.
   - Solução: Refatorar aplicando princípio de responsabilidade única, extraindo componentes menores.
   - Esforço estimado: 3-4 dias.

5. **Falta de Componentização de Elementos Comuns** - Prioridade: Média
   - Problema: Duplicação de código em componentes de formulário e listagens.
   - Solução: Criar componentes reutilizáveis para padrões comuns (formulários, tabelas, cards, etc).
   - Esforço estimado: 2-3 dias.

6. **Serviços com Lógica Duplicada** - Prioridade: Média
   - Problema: Alguns serviços têm lógica similar para operações CRUD.
   - Solução: Criar um serviço base genérico para operações CRUD comuns.
   - Esforço estimado: 2 dias.

## Performance

7. **Lazy Loading de Módulos** - Prioridade: Média
   - Problema: A aplicação não está utilizando lazy loading para todos os módulos.
   - Solução: Implementar lazy loading para melhorar o tempo de carregamento inicial.
   - Esforço estimado: 1-2 dias.

8. **Otimização de Assets** - Prioridade: Baixa
   - Problema: Imagens e outros assets podem não estar otimizados para web.
   - Solução: Otimizar imagens, implementar lazy loading para imagens, e reduzir tamanho de bundle.
   - Esforço estimado: 1 dia.

9. **Uso Excessivo de Observables sem Unsubscribe** - Prioridade: Alta
   - Problema: Potenciais memory leaks por falta de cancelamento de subscriptions.
   - Solução: Implementar padrão takeUntil ou usar async pipe de forma consistente.
   - Esforço estimado: 2 dias.

## UX/UI

10. **Inconsistências Visuais entre Componentes** - Prioridade: Média
    - Problema: Alguns componentes não seguem o mesmo padrão visual.
    - Solução: Criar e aplicar um design system consistente com variáveis CSS/SCSS.
    - Esforço estimado: 2-3 dias.

11. **Melhorias de Acessibilidade** - Prioridade: Baixa
    - Problema: Falta de conformidade com diretrizes de acessibilidade WCAG.
    - Solução: Implementar melhorias de acessibilidade (contraste, textos alternativos, navegação por teclado).
    - Esforço estimado: 2-3 dias.

12. **Feedback Visual para Operações Longas** - Prioridade: Média
    - Problema: Alguns processos não mostram feedback adequado durante operações longas.
    - Solução: Implementar indicadores de carregamento consistentes e feedback de sucesso/erro.
    - Esforço estimado: 1-2 dias.

13. **Experiência Mobile Inconsistente** - Prioridade: Alta
    - Problema: Algumas telas não estão completamente otimizadas para dispositivos móveis.
    - Solução: Revisar e melhorar a responsividade de todas as telas.
    - Esforço estimado: 3-4 dias.

## Internacionalização

14. **Suporte a Múltiplos Idiomas** - Prioridade: Baixa
    - Problema: Aplicação está hardcoded para português.
    - Solução: Implementar i18n para permitir adição de outros idiomas no futuro.
    - Esforço estimado: 2-3 dias.

## Segurança

15. **Armazenamento Seguro de Tokens** - Prioridade: Alta
    - Problema: Tokens JWT armazenados em localStorage são vulneráveis a XSS.
    - Solução: Migrar para armazenamento em httpOnly cookies ou implementar medidas adicionais de segurança.
    - Esforço estimado: 1-2 dias.

16. **Validação de Entrada nos Formulários** - Prioridade: Média
    - Problema: Algumas validações são feitas apenas no backend.
    - Solução: Implementar validação completa no frontend com feedback imediato.
    - Esforço estimado: 2 dias.

## DevOps

17. **CI/CD para Frontend** - Prioridade: Média
    - Problema: Deploy manual do frontend.
    - Solução: Configurar pipeline CI/CD com GitHub Actions para testes, build e deploy.
    - Esforço estimado: 1 dia.

## Plano de Ação Recomendado

Para trabalhar nesses débitos técnicos de maneira eficiente, recomendamos priorizar da seguinte forma:

### Prioridade Imediata (Sprint 1)
1. Versões Diferentes de Angular Material (item 3)
2. Uso Excessivo de Observables sem Unsubscribe (item 9)
3. Experiência Mobile Inconsistente (item 13)
4. Armazenamento Seguro de Tokens (item 15)

### Prioridade Secundária (Sprint 2)
5. Cobertura de Testes Insuficiente (item 1)
6. Componentes com Muitas Responsabilidades (item 4)
7. Lazy Loading de Módulos (item 7)
8. Feedback Visual para Operações Longas (item 12)

### Próximos Passos (Sprints Futuros)
9. Falta de Componentização de Elementos Comuns (item 5)
10. Inconsistências Visuais entre Componentes (item 10)
11. Validação de Entrada nos Formulários (item 16)
12. CI/CD para Frontend (item 17)

Este documento deve ser revisado e atualizado periodicamente à medida que novos débitos técnicos são identificados ou itens existentes são resolvidos.
