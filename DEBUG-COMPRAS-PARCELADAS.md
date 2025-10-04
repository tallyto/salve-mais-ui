# 🔍 Guia de Debug - Compras Parceladas Não Aparecem

## ✅ Ajustes Realizados

### 1. Logs de Debug Adicionados

**No componente TypeScript:**
- 🔍 "Iniciando carregamento de compras..."
- ✅ "Resposta do serviço"
- ✅ "Compras carregadas"
- ❌ "Erro ao carregar"

**No serviço:**
- 🔧 "Service: listar() chamado"
- 🔧 "Service: URL"
- 🔧 "Service: Params"

**No template HTML:**
- Box amarelo mostrando: Loading | Compras.length | Total

### 2. Verificações a Fazer

#### 📋 Passo 1: Abra o Console do Navegador (F12)
1. Acesse: `http://localhost:4200/#/compras-parceladas`
2. Abra o Console (F12 → Console)
3. Verifique os logs:

**Se aparecer:**
```
🔍 Iniciando carregamento de compras...
🔧 Service: listar() chamado com page: 0 size: 10
🔧 Service: URL: http://localhost:8080/api/compras-parceladas
```
✅ O serviço está sendo chamado

**Se NÃO aparecer nada:**
❌ O componente não está sendo carregado

#### 📋 Passo 2: Verifique a Network (Aba Network no F12)
1. Procure por chamada: `compras-parceladas?page=0&size=10`
2. Verifique o Status Code:
   - ✅ **200**: Sucesso
   - ❌ **401**: Não autenticado
   - ❌ **403**: Sem permissão
   - ❌ **404**: Rota não encontrada
   - ❌ **500**: Erro no servidor

#### 📋 Passo 3: Verifique o Box de Debug na Tela
O box amarelo deve mostrar:
- `Loading: true` → depois → `Loading: false`
- `Compras.length: 0` → depois → `Compras.length: 1` (ou mais)
- `Total: 0` → depois → `Total: 1` (ou mais)

### 3. Possíveis Problemas e Soluções

#### Problema 1: Loading fica `true` para sempre
**Causa**: Erro na chamada HTTP
**Solução**: Verifique o console para erro de CORS, autenticação ou URL

#### Problema 2: Compras.length fica `0`
**Causa**: Backend retorna array vazio
**Solução**: 
1. Verifique se há dados no banco de dados
2. Teste a URL diretamente: `http://localhost:8080/api/compras-parceladas?page=0&size=10`

#### Problema 3: Erro 401 (Não autenticado)
**Causa**: Token JWT expirado ou inválido
**Solução**: Faça logout e login novamente

#### Problema 4: Erro de CORS
**Causa**: Backend não está permitindo requisições do frontend
**Solução**: Verifique configuração de CORS no backend

### 4. URL Esperada da API

```
GET http://localhost:8080/api/compras-parceladas?page=0&size=10

Response esperada:
{
  "content": [
    {
      "id": 1,
      "descricao": "teste",
      "valorTotal": 500,
      ...
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  ...
}
```

### 5. Próximos Passos

1. **Acesse a página** e veja o que aparece no box amarelo de debug
2. **Abra o console** (F12) e copie TODOS os logs que aparecem
3. **Abra a aba Network** e veja se a chamada HTTP foi feita
4. **Me envie**:
   - Screenshot do box amarelo
   - Logs do console
   - Status da requisição HTTP

## 🎯 Debug Rápido no Console

Cole isso no console do navegador:
```javascript
// Verificar se o componente está carregado
console.log('Compras:', document.querySelector('app-list-compras-parceladas'));

// Verificar chamadas HTTP
fetch('http://localhost:8080/api/compras-parceladas?page=0&size=10', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(d => console.log('Dados:', d))
.catch(e => console.error('Erro:', e));
```

## 🔧 Remover Debug Depois

Após resolver o problema, remova:
1. Box amarelo do HTML
2. Console.logs extras do TypeScript
3. Console.logs do serviço
