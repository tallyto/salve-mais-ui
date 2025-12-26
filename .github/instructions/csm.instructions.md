# Instruções CSM - Frontend (Angular)

Sistema de gestão financeira multi-tenant com Angular 17+ e Material Design.

## 🚀 Implementando Nova Feature

### 1. Preparação
```bash
# Criar branch feature
git checkout master && git pull
git checkout -b feature/nome-da-feature
```

### 2. Desenvolvimento
- **Component**: Usar standalone components quando possível
- **Service**: Injetar via `@Injectable({providedIn: 'root'})`
- **Routing**: Proteger com `AuthGuard` se necessário
- **Styling**: Usar Angular Material + CSS customizado

### 3. Padrões Obrigatórios
- **Multi-tenant**: Header `X-Private-Tenant` via `AuthInterceptor`
- **Autenticação**: JWT token no localStorage
- **Tratamento de erro**: Usar `ErrorHandlerService`
- **Loading states**: Indicar progresso em operações async
- **Validação**: FormGroup com Validators do Angular

### 4. Finalização
```bash
# Atualizar versão no package.json
npm version patch|minor|major

# Commit organizado
git add -A
git commit -m "feat: descrição da feature"

# Push e PR
git push origin feature/nome-da-feature
```

## 📋 Checklist de Feature

### Frontend
- [ ] Component implementado com standalone: true
- [ ] Service com métodos tipados e observables
- [ ] Tratamento de erro com mensagens amigáveis  
- [ ] Loading spinner durante requisições
- [ ] Validação de formulários (se aplicável)
- [ ] Responsividade mobile/desktop
- [ ] Header X-Private-Tenant configurado
- [ ] Navegação/routing funcional

### Qualidade
- [ ] Código TypeScript sem erros
- [ ] Imports organizados e limpos
- [ ] Nomes descritivos para variáveis/métodos
- [ ] Logs removidos (console.log de debug)
- [ ] Performance otimizada (OnPush quando possível)

## 🔧 Configurações Técnicas

### Multi-tenant Setup
```typescript
// AuthInterceptor já configura automaticamente
headers['X-Private-Tenant'] = tenant;

// Extração de domain da URL (recuperação senha)
const urlParams = new URLSearchParams(window.location.search);
const domain = urlParams.get('domain');
```

### Autenticação Flow
```typescript
// Login -> armazenar token
localStorage.setItem('token', response.token);

// Requisições -> interceptor adiciona automaticamente
// Erro 403 -> componente trata localmente (NÃO logout automático)

// Logout manual
this.authService.logout();
this.router.navigate(['/login']);
```

### Tratamento de Erro
```typescript
// No service
return this.http.post(url, data).pipe(
  catchError(error => {
    console.error('Erro na operação:', error);
    return throwError(() => error);
  })
);

// No component
.subscribe({
  next: (data) => this.handleSuccess(data),
  error: (error) => this.showErrorMessage(error)
});
```

## 🛠️ Comandos Essenciais

```bash
# Desenvolvimento
ng serve --configuration=development

# Build produção
ng build --configuration=production

# Análise de bundle
ng build --stats-json
npx webpack-bundle-analyzer dist/salve-mais-ui/stats.json

# Testes
ng test
ng e2e
```

## ⚠️ Regras Críticas

### Git Workflow
- **NUNCA** commit direto na master
- Branch nomenclature: `feature/`, `fix/`, `refactor/`
- Commits descritivos: `feat:`, `fix:`, `docs:`
- PR obrigatório para todas as mudanças

### Multi-tenant
- Todo request DEVE ter header `X-Private-Tenant`
- AuthInterceptor gerencia automaticamente
- Domain extraído da URL quando necessário

### Performance
- Lazy loading para módulos grandes
- OnPush strategy quando possível
- Debounce em searches/inputs
- Virtual scrolling para listas grandes

### Segurança
- JWT no localStorage (AuthInterceptor gerencia)
- Não logar informações sensíveis
- Sanitizar inputs do usuário
- Validar dados do backend

## 🐛 Troubleshooting

### Erro de Tenant
```
1. Verificar se domain está correto na URL
2. Confirmar header X-Private-Tenant na requisição
3. Validar contexto do tenant no backend
```

### Token/Auth Issues
```
1. Verificar token no localStorage
2. Confirmar expiração do JWT
3. Testar login/logout flow
4. Verificar AuthInterceptor
```

### Build/Deploy
```
1. ng build sem erros
2. Assets copiados corretamente
3. Environment variables configuradas
4. Rota base configurada
```