# Funcionalidade: Alteração de Domínio no Login

## Descrição

Adicionada funcionalidade que permite ao usuário alterar manualmente o domínio/tenant durante o login, especialmente útil quando o mesmo email é compartilhado entre múltiplos domínios/tenants.

## Como Funciona

### Detecção Automática de Domínio

O sistema detecta automaticamente o domínio baseado no email:

1. **Email Corporativo** (ex: `usuario@minhaempresa.com.br`)
   - Extrai o domínio do email (`minhaempresa.com.br`)
   - Usa automaticamente como tenant
   - Exibe checkbox "Alterar domínio" caso o usuário queira mudar

2. **Email Público** (Gmail, Hotmail, Outlook, Yahoo, iCloud)
   - Solicita obrigatoriamente o domínio da empresa
   - Campo de domínio sempre visível
   - Usa último tenant salvo como sugestão

### Checkbox "Alterar Domínio"

Quando o sistema detecta automaticamente um domínio (email corporativo), aparece um checkbox:

```
☐ Alterar domínio (usando: minhaempresa.com.br)
```

**Comportamento:**
- **Desmarcado (padrão)**: Usa o domínio detectado automaticamente
- **Marcado**: Exibe campo de domínio para edição manual

## Casos de Uso

### Caso 1: Usuário com Email em Múltiplos Tenants
```
Email: joao@consultoria.com.br
Tenants: consultoria.com.br, cliente1.com.br, cliente2.com.br

1. Digite o email: joao@consultoria.com.br
2. Sistema detecta: consultoria.com.br
3. Marque "Alterar domínio" para escolher outro tenant
4. Digite manualmente: cliente1.com.br
```

### Caso 2: Email Pessoal em Múltiplos Tenants
```
Email: joao.silva@gmail.com
Tenants: empresa-a.com.br, empresa-b.com.br

1. Digite o email: joao.silva@gmail.com
2. Sistema solicita domínio (sempre visível para emails públicos)
3. Digite o domínio desejado: empresa-a.com.br
4. Sistema lembra o último domínio usado
```

### Caso 3: Email Corporativo - Domínio Automático
```
Email: maria@empresa.com.br
Tenant: empresa.com.br

1. Digite o email: maria@empresa.com.br
2. Sistema detecta automaticamente: empresa.com.br
3. Faça login normalmente (sem precisar alterar)
```

## Implementação Técnica

### Frontend (Angular)

**Propriedades Adicionadas:**
```typescript
alterarDominioManualmente: boolean = false;
dominioDetectado: string = '';
```

**Controle de Formulário:**
```typescript
alterarDominio: [false] // Checkbox para alteração manual
```

**Método Principal:**
```typescript
onAlterarDominioChange() {
  // Controla visibilidade e validação do campo domínio
  // Permite ou bloqueia edição manual
}
```

### Validações

1. **Emails Corporativos**:
   - Domínio extraído e aplicado automaticamente
   - Campo oculto por padrão
   - Checkbox disponível para alteração

2. **Emails Públicos**:
   - Campo de domínio sempre obrigatório
   - Validação: `Validators.required`
   - Sugestão do último tenant usado

3. **Campo Vazio**:
   - Verifica tenant salvo no localStorage
   - Solicita domínio se não encontrado

## Interface do Usuário

### Estados Visuais

**Estado 1: Email Corporativo (Padrão)**
```
Email: [joao@empresa.com.br]
Senha: [******]
☐ Alterar domínio (usando: empresa.com.br)
☐ Lembrar-me    Esqueceu a senha?
[ENTRAR]
```

**Estado 2: Alteração Manual Ativa**
```
Email: [joao@empresa.com.br]
Senha: [******]
Domínio: [empresa.com.br]  ← Campo editável
☑ Alterar domínio (usando: empresa.com.br)
☐ Lembrar-me    Esqueceu a senha?
[ENTRAR]
```

**Estado 3: Email Público**
```
Email: [joao@gmail.com]
Senha: [******]
Domínio: [minhaempresa.com.br]  ← Sempre visível
☐ Lembrar-me    Esqueceu a senha?
[ENTRAR]
```

## Estilos CSS

```css
.checkbox-row {
  margin-bottom: 16px;
  padding-left: 4px;
}

.checkbox-row mat-checkbox {
  font-size: 14px;
  color: #555;
}
```

## Persistência

O sistema salva o último domínio/tenant usado:
- Armazenado no `localStorage` via `TenantService`
- Reutilizado automaticamente em logins futuros
- Pode ser sobrescrito manualmente

## Fluxo de Validação

```
1. Usuário digita email
   ↓
2. onEmailBlur() é chamado
   ↓
3. Sistema verifica tipo de domínio
   ↓
4. Se corporativo:
   - Extrai domínio
   - Define como tenant
   - Esconde campo
   - Mostra checkbox
   ↓
5. Se público:
   - Mostra campo obrigatório
   - Sugere último tenant
   ↓
6. Usuário pode marcar "Alterar domínio"
   ↓
7. Campo se torna editável
   ↓
8. No submit, usa domínio escolhido
```

## Mensagens de Erro

- **Campo vazio**: "Domínio é obrigatório"
- **Sem tenant**: "É necessário informar um domínio válido"
- **Login falhou**: "Usuário ou senha inválidos"

## Benefícios

✅ **Flexibilidade**: Permite login em múltiplos tenants com mesmo email  
✅ **Usabilidade**: Detecção automática reduz atrito  
✅ **Transparência**: Checkbox mostra qual domínio está sendo usado  
✅ **Controle**: Usuário pode sempre sobrescrever detecção automática  
✅ **Memória**: Sistema lembra último tenant usado  

## Segurança

- Validação no backend continua necessária
- Tenant é enviado no header `X-Private-Tenant`
- Autenticação verifica credenciais no contexto do tenant correto
- Não há bypass de segurança - apenas facilita seleção do tenant

## Compatibilidade

- ✅ Funciona com emails corporativos
- ✅ Funciona com emails públicos (Gmail, etc.)
- ✅ Compatível com "Lembrar-me"
- ✅ Mantém compatibilidade com fluxo anterior
- ✅ Não quebra funcionalidade existente

## Próximas Melhorias

1. **Dropdown de Tenants**: Mostrar lista de tenants associados ao email
2. **Busca de Tenants**: API para listar tenants do usuário
3. **Último Tenant**: Destacar visualmente o último tenant usado
4. **Avatar/Logo**: Mostrar logo do tenant selecionado
5. **Validação Prévia**: Verificar se email existe no tenant antes do login
