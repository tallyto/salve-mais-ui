# Instruções para IA - Custom Software Management (CSM)

## Contexto do Projeto
Este é um sistema de gestão financeira multi-tenant desenvolvido em Angular (frontend) e Spring Boot (backend). O sistema possui autenticação baseada em JWT e isolamento de dados por tenant.

## Padrões e Convenções

### 1. Estrutura de Arquivos
- **Frontend**: Angular standalone components, services injetáveis
- **Backend**: Spring Boot com arquitetura em camadas (Controller → Service → Repository)
- **Multi-tenant**: Header `X-Private-Tenant` para isolamento de dados

### 2. Autenticação e Segurança
- JWT tokens armazenados no localStorage
- Logout automático em erro 403 (token inválido/expirado)
- Interceptors HTTP para adicionar headers automaticamente
- Guards para proteger rotas

### 3. Tratamento de Erros
- Status codes apropriados: 403 (Forbidden), 404 (Not Found), 500 (Internal Error)
- Messages amigáveis para usuário final
- Logs estruturados para debugging

## Fluxos Principais

### Recuperação de Senha com Tenant
1. Usuário solicita recuperação via email
2. Sistema busca tenant do usuário ou contexto atual
3. Link gerado inclui token + domain: `?token=xxx&domain=tenant.com`
4. Frontend extrai domain e adiciona ao header `X-Private-Tenant`
5. Redefinição de senha executada no contexto correto do tenant

### Logout Automático (403)
1. AuthInterceptor captura erro 403 em qualquer requisição
2. Remove todos os tokens do localStorage
3. Redireciona para `/login?sessionExpired=true`
4. LoginComponent mostra mensagem de sessão expirada

## Comandos Úteis

### Frontend (Angular)
```bash
# Desenvolvimento
ng serve --configuration=development

# Build produção  
ng build --configuration=production

# Testes
ng test
```

### Backend (Spring Boot)
```bash
# Executar aplicação
./mvnw spring-boot:run

# Testes
./mvnw test

# Build
./mvnw clean package
```

## Versionamento e Deploy

### Git Workflow
1. Criar branch feature a partir de master
2. Fazer alterações e commits
3. Atualizar CHANGELOG.md com mudanças
4. Incrementar versão (semântica)
5. Abrir PR para revisão
6. Merge após aprovação

### Versionamento Semântico
- `MAJOR.MINOR.PATCH` (ex: 1.32.0)
- **MAJOR**: Breaking changes
- **MINOR**: Novas funcionalidades
- **PATCH**: Bug fixes

## Tecnologias Utilizadas

### Frontend
- Angular 17+
- Angular Material (UI components)
- RxJS (programação reativa)
- TypeScript

### Backend  
- Spring Boot 3.x
- Spring Security (JWT)
- JPA/Hibernate
- PostgreSQL
- Maven

## Debugging e Logs

### Frontend
- Console do navegador para erros JS/TS
- Network tab para requisições HTTP
- Angular DevTools para debug de componentes

### Backend
- Logs estruturados com SLF4J
- Níveis: ERROR (crítico), WARN (atenção), INFO (informativo)
- Stack traces apenas para erros inesperados

## Regras de Negócio Importantes

### Multi-Tenancy
- Cada tenant tem dados isolados
- Domain do tenant usado como identificador
- Headers HTTP obrigatórios para isolamento

### Segurança
- Tokens JWT com expiração
- Logout automático em caso de token inválido
- Não expor informações sensíveis em logs

### UX/UI
- Mensagens claras para usuário
- Loading states durante requisições
- Tratamento graceful de erros

## Quando Implementar Novas Features

1. **Análise**: Entender requisitos e impacto
2. **Design**: Planejar arquitetura e fluxos
3. **Implementação**: Seguir padrões estabelecidos
4. **Testes**: Validar funcionamento
5. **Documentação**: Atualizar instruções e changelog
6. **Review**: PR para revisão por pares

## Troubleshooting Comum

### Erro 403 Inesperado
- Verificar se token está sendo enviado
- Verificar se header X-Private-Tenant está correto
- Verificar expiração do JWT

### Problemas de Tenant
- Confirmar contexto do tenant no backend
- Verificar se usuário pertence ao tenant correto
- Validar domain/header nas requisições

### Performance
- Otimizar queries no backend
- Lazy loading no frontend
- Cache adequado para dados estáticos