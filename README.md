# 🏛️ Igreja de Cristo do Centro - Website

> **⚠️ AVISO:** Este site está atualmente **suspenso** por decisão institucional da igreja. A página principal exibe uma mensagem de manutenção.

## 📋 Sobre o Projeto

Website institucional desenvolvido para a Igreja de Cristo do Centro, contendo:

- 📖 Biblioteca Digital de estudos bíblicos
- 🎥 Galeria de vídeos e pregações
- 📅 Calendário de eventos
- 👥 Informações sobre a igreja
- 📚 Cursos bíblicos online

## 🚀 Demonstração

**Site em Produção:** [https://lucasrsouza.github.io/Projeto_ICS/](https://lucasrsouza.github.io/Projeto_ICS/)

> O site exibe uma mensagem de suspensão. Para ver o projeto funcionando, acesse: [https://lucasrsouza.github.io/Projeto_ICS/index-original.html](https://lucasrsouza.github.io/Projeto_ICS/index-original.html)

## 🛠️ Tecnologias Utilizadas

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Design responsivo mobile-first
- Animações CSS e Intersection Observer
- LocalStorage para persistência de dados

### Backend (Opcional)
- Node.js + Express
- MongoDB (para versão com banco de dados)
- JWT para autenticação

### Utilitários
- Módulos de segurança (XSS prevention)
- Performance utilities (throttle/debounce)
- DOM manipulation helpers

## 📁 Estrutura do Projeto

```
Projeto_ICS/
├── index.html              # Redirect para manutenção
├── index-original.html     # Site completo (demonstração)
├── maintenance.html        # Página de suspensão
├── assets/
│   ├── css/               # Estilos modulares
│   ├── js/
│   │   ├── utils/         # Utilitários (security, performance, dom)
│   │   └── *.js           # Scripts específicos
│   ├── images/            # Imagens e logos
│   └── pdfs/              # Biblioteca digital
├── server/                # Backend Node.js
│   ├── index.js
│   ├── routes/
│   ├── models/
│   └── services/
└── admin/                 # Painel administrativo
```

## 🔧 Como Executar Localmente

### Versão Estática (Apenas Frontend)

```bash
# Clone o repositório
git clone https://github.com/lucasrsouza/Projeto_ICS.git
cd Projeto_ICS

# Abra com um servidor local
python3 -m http.server 8000
# ou
npx serve

# Acesse http://localhost:8000/index-original.html
```

### Versão com Backend

```bash
# Entre na pasta do servidor
cd server

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações

# Inicie o servidor
npm start
```

## 🔒 Segurança

Este projeto implementa várias camadas de segurança:

- ✅ Sanitização de HTML (prevenção XSS)
- ✅ Validação de URLs
- ✅ Content Security Policy
- ✅ Rate limiting
- ✅ CORS configurado
- ✅ Helmet.js para headers seguros

## 📊 Code Review

O projeto passou por um code review técnico completo. Veja os relatórios:

- [Code Review Report](./docs/code_review_report.md) - Análise detalhada
- [Implementation Plan](./docs/implementation_plan.md) - Plano de correções

## 🎯 Roadmap

- [x] Code review e identificação de problemas
- [x] Criação de módulos de utilitários
- [x] Correção de vulnerabilidades XSS
- [/] Migração progressiva para código refatorado
- [ ] Implementação de testes unitários
- [ ] CI/CD com GitHub Actions
- [ ] PWA (Progressive Web App)

## 👨‍💻 Desenvolvimento

### Abordagem de Refatoração

Estamos usando a **Abordagem 2 - Migração Progressiva**:

1. Manter código original funcionando
2. Criar versões refatoradas (`*-refactored.js`)
3. Testar isoladamente
4. Substituir gradualmente

### Padrões de Código

- ES6+ modules
- Nomenclatura em português (contexto brasileiro)
- Comentários explicativos
- JSDoc para funções públicas

## 📝 Licença

Este projeto é de propriedade da Igreja de Cristo do Centro e está disponível apenas para fins de portfólio e demonstração.

## 📧 Contato

- **Desenvolvedor:** Lucas Souza
- **GitHub:** [@lucasrsouza](https://github.com/lucasrsouza)

---

## ⚙️ Configuração GitHub Pages

Este site está configurado para GitHub Pages:

1. Acesse: Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` / `root`
4. URL: `https://lucasrsouza.github.io/Projeto_ICS/`

### Arquivos Importantes

- `.nojekyll` - Desabilita processamento Jekyll
- `CNAME` - (Opcional) Para domínio customizado

---

**Última atualização:** Janeiro 2026