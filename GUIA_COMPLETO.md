# 🎓 Guia Completo: Sistema de Cursos sem Login

## 📋 Visão Geral

Criamos um sistema **super simples** onde as pessoas podem se inscrever nos cursos apenas com **email e WhatsApp**, sem precisar criar conta ou fazer login. O sistema funciona assim:

1. **Usuário** → Acessa página de cursos
2. **Clica** → "Inscrever-se" no curso desejado
3. **Preenche** → Apenas nome, email e WhatsApp
4. **Confirma** → Recebe acesso aos materiais
5. **Estuda** → Baixa PDFs e recebe acompanhamento via WhatsApp

---

## 🚀 Como Funciona na Prática

### 1. **No Site (para os usuários):**
- Visitam `cursos.html`
- Veem os cursos disponíveis
- Clicam em "Inscrever-se"
- Preenchem formulário simples
- Recebem confirmação instantânea

### 2. **Para Você (administração):**
- Adiciona PDFs nas pastas corretas
- Acompanha inscrições pelo painel admin
- Faz follow-up via WhatsApp
- Gera relatórios de progresso

---

## 📁 Como Adicionar PDFs

### **Passo 1: Organize seus arquivos**
```
assets/pdfs/
├── dbf/                    
│   ├── licao-01.pdf       ← Seus PDFs aqui
│   ├── licao-02.pdf
│   ├── licao-03.pdf
│   └── ...
│
├── biblia-diz/            
│   ├── tema-01-igreja.pdf ← Seus PDFs aqui
│   ├── tema-02-batismo.pdf
│   └── ...
```

### **Passo 2: Nomeação dos arquivos**
✅ **Use nomes sem espaços:**
- `licao-01-introducao-biblia.pdf`
- `tema-05-musica-adoracao.pdf`

❌ **Evite:**
- `Lição 1 - Introdução à Bíblia.pdf`
- `Tema 5: Música na Adoração.pdf`

### **Passo 3: Tamanho recomendado**
- Máximo **5MB** por arquivo
- Otimize para carregamento rápido no celular

---

## 🖥️ Como Usar o Sistema Backend

### **Instalação (uma vez só):**
```bash
# 1. Instalar dependências
pip install flask flask-cors

# 2. Iniciar o sistema
python sistema_simples.py
```

### **Acessar o sistema:**
- **Site principal:** `http://localhost:5000` (informações da API)
- **Ver inscrições:** `http://localhost:5000/api/admin/inscricoes`
- **Relatório DBF:** `http://localhost:5000/api/admin/relatorio/dbf-online`

---

## 📊 Painel de Administração

### **Ver todas as inscrições:**
```
GET http://localhost:5000/api/admin/inscricoes
```

**Retorna:**
```json
[
  {
    "nome": "João Silva",
    "email": "joao@email.com",
    "whatsapp": "(92) 99999-9999",
    "curso": "dbf-online",
    "data_inscricao": "2025-01-15 14:30:00",
    "status": "ativo"
  }
]
```

### **Relatório por curso:**
```
GET http://localhost:5000/api/admin/relatorio/dbf-online
```

**Retorna:**
```json
{
  "curso": "dbf-online",
  "total_inscricoes": 25,
  "inscricoes_ativas": 23,
  "downloads_populares": [
    {"arquivo": "licao-01.pdf", "count": 20},
    {"arquivo": "licao-02.pdf", "count": 15}
  ]
}
```

---

## 📱 Fluxo de Acompanhamento via WhatsApp

### **Quando alguém se inscreve:**
1. Sistema registra a inscrição
2. (Opcional) Envia email automático
3. **Você recebe notificação** para fazer contato

### **Mensagem sugerida para primeiro contato:**
```
Olá [Nome]! 👋

Obrigado por se inscrever no curso [Nome do Curso]!

📚 Você já pode acessar os materiais pelo site
📱 Vou te acompanhar durante todo o curso
❓ Pode mandar suas dúvidas a qualquer hora

Vamos começar? 🙂
```

### **Acompanhamento semanal:**
```
Oi [Nome]! 📖

Como estão os estudos da semana?
- Conseguiu ler a lição X?
- Tem alguma dúvida?
- Quer conversar sobre o tema?

Estou aqui para ajudar! 😊
```

---

## 🔧 Configurações Avançadas

### **1. Email Automático (opcional):**
Edite `sistema_simples.py`:
```python
EMAIL_CONFIG = {
    'smtp_server': 'smtp.gmail.com',
    'smtp_port': 587,
    'email': 'seuemail@gmail.com',      # ← Seu email
    'password': 'suasenhaapp',          # ← Senha de app do Gmail
    'from_name': 'Igreja de Cristo do Centro'
}
```

### **2. Personalizar cursos:**
No arquivo `cursos.html`, você pode:
- Adicionar novos cursos
- Modificar descrições
- Alterar números de WhatsApp

### **3. Modificar formulários:**
- Adicionar campos (idade, cidade, etc.)
- Remover campos opcionais
- Personalizar mensagens

---

## 📈 Relatórios e Métricas

### **O que você pode acompanhar:**
- ✅ Quantas pessoas se inscreveram
- ✅ Quais PDFs são mais baixados
- ✅ Progresso de cada estudante
- ✅ Dados de contato para follow-up
- ✅ Tendências por período

### **Exportar dados:**
```python
# Conectar ao banco de dados
import sqlite3
conn = sqlite3.connect('igreja_inscricoes.db')

# Exportar para Excel (opcional)
import pandas as pd
df = pd.read_sql_query("SELECT * FROM inscricoes", conn)
df.to_excel('relatorio_inscricoes.xlsx', index=False)
```

---

## 🎯 Dicas de Sucesso

### **1. Para aumentar inscrições:**
- ✅ Formulários simples (só o essencial)
- ✅ Promessas claras (certificado, suporte)
- ✅ Call-to-actions claros
- ✅ Depoimentos de ex-alunos

### **2. Para manter engajamento:**
- ✅ Contato regular via WhatsApp
- ✅ Resposta rápida às dúvidas
- ✅ Materiais complementares
- ✅ Reconhecimento do progresso

### **3. Para organização:**
- ✅ Nomeação consistente dos PDFs
- ✅ Backup regular do banco de dados
- ✅ Acompanhamento semanal das métricas

---

## 🚨 Solução de Problemas

### **PDF não aparece no site:**
1. Verifique se está na pasta correta
2. Confirme o nome do arquivo
3. Reinicie o sistema backend

### **Formulário não funciona:**
1. Verifique se o backend está rodando
2. Abra console do navegador (F12)
3. Verifique mensagens de erro

### **Email não envia:**
1. Configure EMAIL_CONFIG corretamente
2. Use senha de app do Gmail
3. Verifique configurações de segurança

---

## 📞 Próximos Passos

### **Imediato (hoje):**
1. ✅ Adicione seus PDFs nas pastas
2. ✅ Teste uma inscrição
3. ✅ Configure mensagens do WhatsApp

### **Esta semana:**
1. 🔄 Configure email automático
2. 🔄 Personalize formulários
3. 🔄 Teste com grupo pequeno

### **Próximo mês:**
1. 📊 Analise relatórios
2. 🎯 Otimize processo
3. 📈 Expanda para mais cursos

---

## 🎉 Parabéns!

Agora você tem um **sistema completo** para gerenciar cursos bíblicos sem complicações! O sistema é:

- ✅ **Simples** para os usuários
- ✅ **Fácil** de administrar
- ✅ **Eficiente** para acompanhamento
- ✅ **Escalável** para crescer

**Qualquer dúvida, é só chamar!** 😊