# 💰 Salve Mais UI

![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=flat&logo=angular&logoColor=white)
![Angular Material](https://img.shields.io/badge/Angular%20Material-009688?style=flat&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

Sistema web para gestão financeira pessoal desenvolvido em Angular com Material Design.

## 📋 Sobre o Projeto

O **Salve Mais** é uma aplicação completa para controle financeiro pessoal que permite gerenciar receitas, despesas, cartões de crédito, compras parceladas e muito mais. Com interface moderna e intuitiva, oferece visualizações detalhadas através de gráficos e dashboards.

## ✨ Principais Funcionalidades

### 💳 Gestão de Cartões e Faturas
- Cadastro e gerenciamento de cartões de crédito
- Geração automática de faturas baseadas em compras
- Preview de faturas antes da geração
- Controle de limites e uso de cartão
- Filtros por período (mês/ano) com paginação
- Exportação de dados para Excel

### 📊 Dashboard Interativo
- Resumo financeiro mensal (saldo, receitas, despesas)
- Gráficos de despesas por categoria
- Gráfico de receitas vs despesas
- Análise de variação mensal
- Filtros de período personalizáveis

### 💵 Controle de Despesas
- **Débitos em Conta**: Despesas fixas e recorrentes
- **Compras Parceladas**: Controle completo de parcelas
- **Compras de Cartão**: Gestão de compras à vista e parceladas
- Categorização de despesas
- Status de pagamento
- Anexação de comprovantes

### 📈 Análises e Relatórios
- Status de pagamentos consolidado
- Notificações de vencimentos
- Histórico de transações
- Exportação para Excel
- Visualização por período

## 🚀 Tecnologias Utilizadas

- **Framework**: Angular 18+
- **UI/UX**: Angular Material
- **Linguagem**: TypeScript
- **Gráficos**: Chart.js
- **HTTP Client**: RxJS
- **Autenticação**: JWT
- **Build**: Angular CLI

## 📦 Requisitos

- Node.js >= 18
- npm >= 9
- Angular CLI >= 18

## 🔧 Instalação

```bash
# Clone o repositório
git clone https://github.com/tallyto/salve-mais-ui.git

# Acesse o diretório
cd salve-mais-ui

# Instale as dependências
npm install
```

## 🎯 Executando o Projeto

### Desenvolvimento
```bash
# Servidor de desenvolvimento
npm start
# ou
ng serve

# Acesse: http://localhost:4200
```

### Ambiente Local
```bash
# Com configuração local
npm run local

# Acesse: http://localhost:4200
```

### Build de Produção
```bash
# Build otimizado
ng build --configuration production

# Arquivos gerados em: dist/
```

## 📜 Scripts Disponíveis

```bash
npm start          # Inicia servidor de desenvolvimento
npm run local      # Inicia com configuração local
npm test           # Executa testes unitários
npm run build      # Build de produção
npm run watch      # Build em modo watch
```

## 🗂️ Estrutura do Projeto

```
salve-mais-ui/
├── src/
│   ├── app/
│   │   ├── components/        # Componentes da aplicação
│   │   │   ├── dashboard/     # Dashboard principal
│   │   │   ├── fatura-form/   # Gestão de faturas
│   │   │   ├── cartao-form/   # Gestão de cartões
│   │   │   ├── compra-parcelada-form/
│   │   │   └── ...
│   │   ├── models/            # Interfaces e modelos
│   │   ├── services/          # Serviços HTTP
│   │   ├── shared/            # Componentes compartilhados
│   │   └── utils/             # Utilitários
│   ├── assets/                # Recursos estáticos
│   ├── environments/          # Configurações de ambiente
│   └── styles.css             # Estilos globais
├── doc/                       # Documentação técnica
└── package.json
```

## ⚙️ Configuração

### Ambientes

O projeto possui três ambientes configurados:

- **Development** (`environment.ts`): Desenvolvimento local
- **Local** (`environment.local.ts`): Backend local na porta 8080
- **Production** (`environment.prod.ts`): Produção

Edite os arquivos em `src/environments/` para configurar as URLs da API.

### Backend

Certifique-se de que o backend esteja rodando:
- **Desenvolvimento**: `http://localhost:8080/api`
- **Produção**: Configure a URL em `environment.prod.ts`

Repositório do backend: [salve-mais](https://github.com/tallyto/salve-mais)

## 🧪 Testes

```bash
# Testes unitários
npm test

# Testes com coverage
ng test --code-coverage
```

## 📝 Changelog

Veja o arquivo [CHANGELOG.md](CHANGELOG.md) para histórico detalhado de versões.

**Versão atual**: 1.18.0

## 🛠️ Extensões Recomendadas (VS Code)

- Angular Language Service (`angular.ng-template`)
- Angular Snippets (`johnpapa.angular2`)
- EditorConfig for VS Code
- Prettier - Code formatter
- ESLint
- Angular Console

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Tallyto Rodrigues**

- GitHub: [@tallyto](https://github.com/tallyto)

## 🔗 Links Relacionados

- [Backend - Salve Mais API](https://github.com/tallyto/salve-mais)
- [Angular Documentation](https://angular.io/docs)
- [Angular Material](https://material.angular.io)

---

Desenvolvido com ❤️ usando Angular

