# Gerenciamento de Usuários - Admin

## Descrição

Funcionalidade que permite aos administradores do tenant gerenciar usuários dentro do sistema. Os admins podem listar, criar e deletar usuários de forma centralizada.

## Componentes Criados

### Frontend (Angular)

#### 1. AdminUsuariosComponent
- **Localização**: `src/app/components/admin-usuarios/`
- **Função**: Listagem de todos os usuários do tenant com opções de gerenciamento
- **Funcionalidades**:
  - Listar usuários em tabela com informações de nome, email, data de criação e último acesso
  - Botão para criar novo usuário (abre dialog)
  - Botão para deletar usuário (com confirmação)
  - Loading state durante requisições
  - Estado vazio quando não há usuários

#### 2. NovoUsuarioDialogComponent
- **Localização**: `src/app/components/admin-usuarios/novo-usuario-dialog/`
- **Função**: Modal para criação de novos usuários
- **Funcionalidades**:
  - Formulário com validação para nome, email e senha
  - Validação de senhas iguais
  - Toggle para mostrar/ocultar senha
  - Feedback visual de erros
  - Loading state durante criação

### Backend (Java/Spring Boot)

#### 1. UsuarioController - Novos Endpoints
- **GET** `/api/usuarios/admin/listar` - Lista todos os usuários do tenant
- **POST** `/api/usuarios/admin/criar` - Cria novo usuário (usa o mesmo DTO de cadastro)
- **DELETE** `/api/usuarios/admin/{id}` - Deleta um usuário por ID

#### 2. UsuarioService - Novos Métodos
- `listarTodosUsuarios()` - Retorna lista de todos os usuários
- `deletarUsuario(Long id)` - Deleta usuário por ID com validação

## Modelos e DTOs

### Usuario Model (TypeScript)
```typescript
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  criadoEm: string;
  ultimoAcesso?: string;
  tenantId?: string;
}
```

### UsuarioService (Angular)
Novos métodos adicionados:
- `listarUsuarios()` - Lista usuários
- `criarUsuario(usuario)` - Cria usuário
- `deletarUsuario(id)` - Deleta usuário

## Rotas

### Rota adicionada ao app-routing.module.ts:
```typescript
{path: 'admin-usuarios', component: AdminUsuariosComponent, canActivate: [AuthGuard]}
```

### Menu Lateral
Adicionado link "Gerenciar Usuários" na seção de Configurações do menu lateral

## Funcionalidades

### 1. Listar Usuários
- Exibe tabela com todos os usuários do tenant
- Mostra informações: nome, email, data de criação e último acesso
- Formatação de datas em padrão brasileiro (dd/MM/yyyy HH:mm)
- Estado "Nunca" para usuários que nunca acessaram

### 2. Criar Usuário
- Modal com formulário completo
- Validações:
  - Nome: obrigatório, mínimo 3 caracteres
  - Email: obrigatório, formato válido
  - Senha: obrigatória, mínimo 6 caracteres
  - Confirmação de senha: obrigatória, deve ser igual à senha
- Feedback de sucesso/erro via SnackBar
- Recarrega lista após criação

### 3. Deletar Usuário
- Confirmação antes de deletar
- **Proteção contra auto-exclusão**: Usuário não pode deletar a si mesmo
- Botão desabilitado visualmente quando é o próprio usuário
- Tooltip explicativo sobre a restrição
- Validação tanto no frontend quanto no backend
- Feedback de sucesso/erro
- Recarrega lista após deleção

## Segurança

### Proteções Implementadas:
✅ **Proteção contra auto-exclusão**: Usuário não pode deletar sua própria conta
- Validação no backend (`UsuarioService.deletarUsuario()`)
- Validação no frontend (botão desabilitado)
- Mensagem de erro clara ao tentar

### Considerações Importantes:
⚠️ **ATENÇÃO**: Os endpoints de administração ainda não possuem controle de permissões específicas. Recomenda-se implementar:

1. **Sistema de Roles/Permissões**: Criar roles como ADMIN, USER, etc.
2. **Anotações de Segurança**: Usar `@PreAuthorize("hasRole('ADMIN')")` nos endpoints
3. **Validação de Tenant**: Garantir que admins só gerenciem usuários do próprio tenant
4. **Auditoria**: Registrar todas as ações de criação/deleção de usuários

### Implementação Futura Recomendada:
```java
@GetMapping("/admin/listar")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<List<UsuarioResponseDTO>> listarUsuarios() {
    // ...
}
```

## Uso

### Acessar a Tela de Gerenciamento:
1. Faça login no sistema
2. No menu lateral, clique em "Gerenciar Usuários" (seção Configurações)
3. Você verá a lista de todos os usuários

### Criar Novo Usuário:
1. Na tela de gerenciamento, clique em "Novo Usuário"
2. Preencha o formulário:
   - Nome completo
   - Email
   - Senha (mínimo 6 caracteres)
   - Confirme a senha
3. Clique em "Criar Usuário"

### Deletar Usuário:
1. Na lista de usuários, clique no ícone de lixeira
   - **Observação**: O botão ficará desabilitado se for sua própria conta
2. Confirme a ação no dialog
3. O usuário será removido

**Restrições:**
- Você não pode deletar sua própria conta
- Se tentar, receberá uma mensagem de erro

## Melhorias Futuras

1. **Paginação**: Adicionar paginação para grandes volumes de usuários
2. **Filtros**: Implementar filtros de busca por nome/email
3. **Edição**: Adicionar funcionalidade de edição de usuários
4. **Ativar/Desativar**: Ao invés de deletar, permitir desativar usuários
5. **Roles**: Implementar sistema de permissões/roles
6. **Histórico**: Registrar histórico de alterações
7. **Export**: Permitir exportar lista de usuários (CSV/Excel)
8. **Envio de Email**: Enviar email de boas-vindas ao criar usuário
9. **Reset de Senha**: Permitir admin resetar senha de usuários
10. **Indicador de Admin**: Mostrar visualmente quais usuários são admins

## Dependências

### Material Angular Modules:
- MatCardModule
- MatTableModule
- MatButtonModule
- MatIconModule
- MatProgressSpinnerModule
- MatSnackBarModule
- MatDialogModule
- MatFormFieldModule
- MatInputModule

Todas já estão incluídas nos componentes standalone.

## Testes

### Testes Recomendados:
1. Criar usuário com dados válidos
2. Tentar criar usuário com email duplicado
3. Validação de formulário (campos vazios, email inválido)
4. Validação de senhas diferentes
5. Deletar usuário
6. Verificar isolamento de tenant (usuários de um tenant não veem outros)

## Notas de Desenvolvimento

- Os componentes são **standalone** (não precisam de módulo)
- Usa **Reactive Forms** para validação
- Formatação de datas com `toLocaleDateString`
- Uso de **MatDialog** para modal de criação
- **MatSnackBar** para feedbacks ao usuário
- Guards de autenticação já aplicados na rota
