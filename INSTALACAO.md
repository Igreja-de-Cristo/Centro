# 📦 Instalação Rápida - Sistema de Cursos

## 🚀 Configuração em 5 Minutos

### **Passo 1: Instalar Python (se não tiver)**
```bash
# Verificar se tem Python
python --version

# Se não tiver, baixar em: https://python.org
```

### **Passo 2: Instalar dependências**
```bash
# No terminal, dentro da pasta do projeto:
pip install flask flask-cors
```

### **Passo 3: Iniciar o sistema**
```bash
python sistema_simples.py
```

### **Passo 4: Testar**
1. Abra `index.html` no navegador
2. Vá para "Cursos"
3. Teste uma inscrição
4. Verifique em: `http://localhost:5000/api/admin/inscricoes`

---

## 📁 Adicionando seus PDFs

### **Estrutura necessária:**
```
assets/pdfs/
├── dbf/
│   ├── licao-01.pdf
│   ├── licao-02.pdf
│   └── ... (seus PDFs)
├── biblia-diz/
│   ├── tema-01-igreja.pdf
│   ├── tema-02-batismo.pdf
│   └── ... (seus PDFs)
```

### **Como adicionar:**
1. **Coloque seus PDFs** nas pastas corretas
2. **Use nomes simples** (sem espaços ou acentos)
3. **Reinicie o sistema** (`Ctrl+C` e `python sistema_simples.py`)

---

## 📱 Configuração do WhatsApp

### **No arquivo `cursos.html`, procure por:**
```javascript
// Trocar pelos seus números
const whatsappDBF = '5592991146877';      // ← SEU NÚMERO
const whatsappGeral = '5592991146877';    // ← SEU NÚMERO
```

### **Mensagens automáticas:**
O sistema já cria mensagens prontas como:
```
Nova inscrição - DBF Online

Nome: João Silva
Email: joao@email.com
WhatsApp: (92) 99999-9999
```

---

## 📧 Email Automático (Opcional)

### **Para configurar email:**
1. **Edite `sistema_simples.py`**
2. **Encontre `EMAIL_CONFIG`**
3. **Configure com seus dados:**

```python
EMAIL_CONFIG = {
    'smtp_server': 'smtp.gmail.com',
    'smtp_port': 587,
    'email': 'seu_email@gmail.com',        # ← SEU EMAIL
    'password': 'sua_senha_de_app',        # ← SENHA DE APP
    'from_name': 'Igreja de Cristo do Centro'
}
```

### **Como criar senha de app no Gmail:**
1. Vá em [myaccount.google.com](https://myaccount.google.com)
2. Segurança → Verificação em duas etapas
3. Senhas de app → Gerar nova senha
4. Use essa senha no código

---

## 🎯 Teste Rápido

### **1. Inscrição funciona?**
- Acesse `cursos.html`
- Clique "Inscrever-se" em qualquer curso
- Preencha o formulário
- Deve aparecer mensagem de sucesso

### **2. Backend está funcionando?**
- Abra: `http://localhost:5000`
- Deve mostrar informações da API
- Teste: `http://localhost:5000/api/admin/inscricoes`

### **3. PDFs estão acessíveis?**
- Após inscrição, tente baixar um PDF
- Se der erro, verifique se o arquivo existe na pasta

---

## 🔧 Problemas Comuns

### **"Módulo flask não encontrado"**
```bash
pip install flask flask-cors
```

### **"Arquivo PDF não encontrado"**
1. Verifique se está na pasta correta
2. Confirme o nome exato do arquivo
3. Reinicie o sistema Python

### **"Formulário não envia"**
1. Certifique-se que o backend está rodando
2. Abra F12 no navegador e veja erros
3. Teste a conexão: `http://localhost:5000`

### **"WhatsApp não abre"**
1. Verifique o número no código
2. Teste o link manualmente
3. Confirme formato: 5592XXXXXXXXX

---

## 📊 Acompanhamento

### **Ver inscrições:**
```
http://localhost:5000/api/admin/inscricoes
```

### **Relatório por curso:**
```
http://localhost:5000/api/admin/relatorio/dbf-online
http://localhost:5000/api/admin/relatorio/dbf-presencial
http://localhost:5000/api/admin/relatorio/biblia-diz
```

### **Banco de dados:**
- Arquivo: `igreja_inscricoes.db`
- Pode abrir com: DB Browser for SQLite
- Fazer backup regularmente

---

## ✅ Checklist Final

- [ ] Python instalado
- [ ] Dependências instaladas (`pip install flask flask-cors`)
- [ ] PDFs nas pastas corretas
- [ ] Sistema rodando (`python sistema_simples.py`)
- [ ] Teste de inscrição realizado
- [ ] WhatsApp configurado
- [ ] Email configurado (opcional)
- [ ] Backup do banco criado

---

## 🎉 Pronto!

Agora você tem um sistema completo funcionando! 

**Para usar diariamente:**
1. Execute `python sistema_simples.py`
2. Deixe rodando em segundo plano
3. Monitore inscrições em `/api/admin/inscricoes`
4. Faça follow-up via WhatsApp

**Dúvidas?** Consulte o `GUIA_COMPLETO.md` ou entre em contato!