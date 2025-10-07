# 🔐 Sistema Administrativo - Igreja de Cristo do Centro

## 🎯 Acesso Restrito

O sistema administrativo foi projetado para ser **completamente invisível** aos visitantes normais do site. Apenas você, como administrador, tem acesso.

---

## 🚪 Como Acessar o Painel Administrativo

### **Método 1: Acesso Secreto pelo Logo** ⭐
1. **Vá para:** Página inicial do site (`index.html`)
2. **Clique 5 vezes** no logo da igreja (rapidamente)
3. **Aparecerá** um botão "🔐 Acesso Admin" no canto inferior direito
4. **Clique no botão** para ir à página de login
5. **O botão desaparece** após 10 segundos

### **Método 2: URL Direta**
- **Login:** `https://seusite.com/admin-login.html`
- **Painel:** `https://seusite.com/admin-informativos.html` (só funciona se logado)

---

## 🔑 Credenciais de Login

### **Usuários Administrativos:**
```
Usuário: admin
Senha: IgrejaAdmin2025!

Usuário: lucas  
Senha: MinhaChave2025@
```

> ⚠️ **IMPORTANTE:** Altere essas senhas após o primeiro acesso!

---

## 🛡️ Recursos de Segurança

### **Proteção de Acesso:**
- ✅ **Máximo 3 tentativas** de login por sessão
- ✅ **Bloqueio de 30 minutos** após 3 tentativas falhadas
- ✅ **Sessão expira** em 2 horas automaticamente
- ✅ **Log de acessos** para auditoria
- ✅ **Redirecionamento automático** se não logado

### **Medidas Preventivas:**
- ✅ **Menu Admin removido** do site público
- ✅ **URL não indexável** pelos buscadores
- ✅ **Proteção básica** contra F12/DevTools
- ✅ **Acesso apenas via** métodos secretos

---

## 📱 Uso Mobile

### **Login pelo Celular:**
1. **Acesse:** `seusite.com/admin-login.html`
2. **Digite** suas credenciais
3. **Interface** totalmente responsiva
4. **Mesmo nível** de segurança

### **Painel Mobile:**
- ✅ **Interface otimizada** para touch
- ✅ **Formulários responsivos**
- ✅ **Notificações visuais**
- ✅ **Logout fácil**

---

## 🔧 Alterando Credenciais

### **Para Mudar Senhas:**
1. **Abra:** `admin-login.html` em editor
2. **Encontre** a seção `this.credentials = {`
3. **Altere** as senhas:
```javascript
this.credentials = {
    'admin': 'SuaNovaSenha123!',
    'lucas': 'OutraSenhaSegura456@'
};
```
4. **Salve** e faça deploy

### **Para Adicionar Usuários:**
```javascript
this.credentials = {
    'admin': 'IgrejaAdmin2025!',
    'lucas': 'MinhaChave2025@',
    'novousuario': 'NovaSenha789#'
};
```

---

## 📊 Logs de Acesso

### **Visualizar Logs:**
No console do navegador (F12), execute:
```javascript
console.table(JSON.parse(localStorage.getItem('admin_access_logs')));
```

### **Informações Registradas:**
- ✅ **Username** usado na tentativa
- ✅ **Sucesso/Falha** do login
- ✅ **Data e hora** exatas
- ✅ **Navegador** utilizado
- ✅ **IP local**

---

## ⚠️ Problemas Comuns

### **"Acesso Negado"**
- ✅ Verifique se está usando as credenciais corretas
- ✅ Aguarde 30 min se houve muitas tentativas
- ✅ Limpe cache e cookies do navegador

### **"Sessão Expirada"**
- ✅ Faça login novamente
- ✅ Sessões duram apenas 2 horas por segurança

### **Botão de Admin não aparece**
- ✅ Clique no logo **exatamente 5 vezes**
- ✅ Cliques devem ser **rápidos** (dentro de 3 segundos)
- ✅ Use o acesso direto via URL se necessário

---

## 🚀 Backup e Segurança

### **Fazer Backup dos Informativos:**
1. **Acesse** o painel administrativo
2. **Clique** em "📤 Exportar Dados"
3. **Salve** o arquivo JSON
4. **Guarde** em local seguro

### **Restaurar Backup:**
1. **Abra** o console (F12)
2. **Cole** o código:
```javascript
// Colar conteúdo do arquivo de backup
const backup = { /* dados do backup */ };
localStorage.setItem('igreja_informativos', JSON.stringify(backup.informativos));
location.reload();
```

---

## 🔒 Recomendações de Segurança

### **Para Maior Segurança:**

1. **Altere senhas** regularmente
2. **Use senhas fortes** (maiúscula, minúscula, números, símbolos)
3. **Não compartilhe** credenciais
4. **Acesse apenas** de dispositivos confiáveis
5. **Faça logout** sempre após usar
6. **Backup regular** dos informativos

### **Senhas Recomendadas:**
- ✅ Mínimo 12 caracteres
- ✅ Misture letras, números e símbolos
- ✅ Evite informações pessoais
- ✅ Use frases com números: `MinhaIgreja2025!`

---

## 📞 Suporte

Em caso de problemas:
1. **Primeiro:** Tente os métodos de solução acima
2. **Backup:** Sempre mantenha backup dos informativos
3. **Reset:** Em último caso, limpe `localStorage` do navegador

**Lembre-se:** O sistema foi projetado para ser simples e seguro. Mantenha as credenciais em local seguro! 🔐✨