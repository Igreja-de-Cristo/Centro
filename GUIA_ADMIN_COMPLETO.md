# 🎯 Guia Completo do Sistema Administrativo
## Igreja de Cristo do Centro - Manaus/AM

---

## 📋 Índice

1. [Introdução](#introdução)
2. [Como Acessar o Painel](#como-acessar-o-painel)
3. [Dashboard Principal](#dashboard-principal)
4. [Gerenciar Vídeos](#gerenciar-vídeos)
5. [Gerenciar Informativos](#gerenciar-informativos)
6. [Gerenciar Banners](#gerenciar-banners)
7. [Galeria de Mídia](#galeria-de-mídia)
8. [API e Integração](#api-e-integração)
9. [Analytics e Relatórios](#analytics-e-relatórios)
10. [Backup e Segurança](#backup-e-segurança)
11. [Resolução de Problemas](#resolução-de-problemas)

---

## 🎯 Introdução

### O que é este sistema?

Este é um **painel administrativo completo** com API REST integrada, criado especialmente para que você possa gerenciar **todo o conteúdo do site** sem precisar de conhecimentos técnicos avançados.

### O que você pode fazer:

✅ **Gerenciar vídeos do YouTube** com analytics  
✅ **Criar e editar informativos** (avisos, eventos, anúncios)  
✅ **Adicionar banners visuais** com imagens para eventos especiais  
✅ **Fazer upload de arquivos** (imagens, PDFs, documentos)  
✅ **Gerenciar conteúdo** de forma visual e intuitiva  
✅ **Acompanhar estatísticas** de visualização  
✅ **Fazer backup** de todos os dados  

### ⚠️ IMPORTANTE:
- Sistema protegido com autenticação JWT
- Backup automático diário
- Analytics de engajamento
- Rate limiting para segurança
- Sanitização automática de dados

---

## 🎥 Gerenciar Vídeos

### Adicionar Novo Vídeo

1. Acesse `admin-videos.html`
2. Clique em "Novo Vídeo"
3. Preencha:
   - **ID do YouTube**: encontrado na URL do vídeo
   - **Título**: nome do vídeo
   - **Categoria**: culto, estudo ou evento
   - **Descrição**: detalhes do conteúdo
   - **Destaque**: marcar se for destaque

### Editar Vídeos

1. Localize o vídeo na lista
2. Clique em "Editar"
3. Modifique os campos necessários
4. Salve as alterações

### Analytics de Vídeos

Na seção de estatísticas você pode ver:
- Total de visualizações
- Tempo médio assistido
- Engajamento por vídeo
- Relatórios por categoria

### API de Vídeos

Endpoints disponíveis:
```
GET    /api/videos          - Lista vídeos
POST   /api/videos          - Adiciona vídeo
PATCH  /api/videos/:id      - Atualiza vídeo
DELETE /api/videos/:id      - Remove vídeo
POST   /api/videos/:id/view - Registra visualização
GET    /api/videos/:id/stats - Estatísticas
```

## � Como Acessar o Painel

### Método 1: Login Seguro (JWT) ⭐

1. Acesse `admin-login.html`
2. Insira suas credenciais
3. O token JWT será armazenado automaticamente
4. Você será redirecionado ao dashboard
4. **Clique no botão** para ir à página de login
5. O botão **desaparece após 10 segundos**

> 💡 **Dica:** Os cliques devem ser rápidos, dentro de 3 segundos!

### Método 2: URL Direta

Se o método secreto não funcionar, acesse diretamente:

```
www.seusite.com/admin-login.html
```

---

## 🔑 Login no Sistema

### Credenciais Padrão:

```
👤 Usuário: admin
🔑 Senha: IgrejaAdmin2025!
```

ou

```
👤 Usuário: lucas
🔑 Senha: MinhaChave2025@
```

### ⚠️ IMPORTANTE - Segurança:
- ✅ Altere essas senhas após o primeiro acesso!
- ✅ Máximo de **3 tentativas** de login
- ✅ **Bloqueio de 30 minutos** após 3 erros
- ✅ Sessão expira em **2 horas** automaticamente
- ✅ Sempre faça **logout** ao terminar

### Como alterar a senha:

1. Contate o desenvolvedor (Lucas)
2. Ou, se souber editar código, abra `admin-login.html`
3. Procure por `this.credentials = {`
4. Altere as senhas lá

---

## 📊 Dashboard Principal

### O que você vê ao fazer login:

![Dashboard](exemplo-dashboard.png)

### Seções do Dashboard:

#### 1️⃣ **Estatísticas Principais**
- 📢 **Informativos**: Total e quantos estão ativos
- 🖼️ **Banners**: Total e quantos estão visíveis
- 📁 **Arquivos**: Quantos arquivos você enviou
- 👥 **Acessos**: Quantas vezes você logou

#### 2️⃣ **Ações Rápidas**
Botões grandes para:
- Criar novo informativo
- Adicionar banner visual
- Fazer upload de arquivo
- Fazer backup completo

#### 3️⃣ **Atividade Recente**
Lista das últimas coisas que você criou ou editou

#### 4️⃣ **Menu Lateral (Esquerda)**
- 📊 Dashboard (início)
- 📢 Informativos
- 🖼️ Banners
- 📁 Galeria de Mídia
- 🏠 Ver Site
- 🚪 Sair

---

## 📢 Gerenciar Informativos

### O que são Informativos?

São avisos, anúncios ou informações importantes que aparecem no **topo do site** em formato de texto.

### Como Criar um Informativo:

1. No menu lateral, clique em **"📢 Informativos"**
2. Preencha o formulário:

#### 📋 **Tipo de Informativo:**
- 🎉 **Evento**: Para cultos especiais, eventos
- 📢 **Anúncio**: Para avisos gerais
- ⚠️ **Aviso Importante**: Para informações urgentes
- 🚨 **Urgente**: Para emergências ou algo muito importante

#### 📝 **Título:**
O texto principal que as pessoas vão ler.  
**Exemplo:** "Culto Especial de Páscoa - Domingo às 10h"

#### 📄 **Descrição (opcional):**
Texto adicional com mais detalhes.  
**Exemplo:** "Teremos louvores especiais e mensagem sobre a ressurreição de Cristo."

#### 📅 **Data do Evento (opcional):**
Se for um evento, coloque a data e hora.

#### ⭐ **Prioridade:**
- 🟢 **Baixa**: Aparece por último
- 🟡 **Média**: Ordem normal
- 🔴 **Alta**: Aparece primeiro

#### 👁️ **Status:**
- ✅ **Ativo**: Visível no site
- ❌ **Inativo**: Oculto (você pode ativar depois)

#### ⏰ **Expira em (opcional):**
Se quiser que o informativo desapareça automaticamente numa data.  
**Exemplo:** Evento passa? Coloque a data de expiração.

3. Clique em **"💾 Salvar Informativo"**
4. **Pronto!** Aparece instantaneamente no site

### Como Editar um Informativo:

1. Role a página até **"Informativos Cadastrados"**
2. Encontre o informativo que quer editar
3. Clique em **"✏️ Editar"**
4. O formulário vai preencher automaticamente
5. Faça as alterações
6. Clique em **"💾 Atualizar Informativo"**

### Como Remover um Informativo:

1. Encontre o informativo na lista
2. Clique em **"🗑️ Remover"**
3. Confirme a remoção
4. **Pronto!** Sumiu do site imediatamente

---

## 🖼️ Gerenciar Banners Visuais

### O que são Banners?

São **imagens grandes e chamativas** que aparecem no site para destacar eventos importantes.

### Quando usar Banners?

- 🎉 Eventos especiais (Páscoa, Natal, Batismos)
- 📢 Campanhas importantes
- ✨ Convites para cultos especiais
- 🚨 Anúncios urgentes com visual impactante

### Como Criar um Banner:

1. No menu lateral, clique em **"🖼️ Banners"**
2. **Escolha ou arraste uma imagem:**
   - Clique na área de upload ou arraste a imagem
   - Formatos aceitos: **JPG, PNG, GIF**
   - Tamanho recomendado: **1200x400 pixels**
   - Tamanho máximo: **5 MB**

3. Preencha as informações:

#### 📋 **Tipo de Banner:**
- 🎉 **Evento Especial**: Eventos da igreja
- 📢 **Anúncio Importante**: Avisos gerais
- ✨ **Promoção/Convite**: Convites especiais
- 🚨 **Urgente**: Situações de emergência

#### 📝 **Título:**
Nome do banner (para sua organização).

#### 📄 **Descrição (opcional):**
Texto que aparece sobre a imagem (opcional).

#### 🔗 **Link (opcional):**
Se quiser que ao clicar no banner abra alguma página.

#### 📍 **Posição no Site:**
- 🔝 **Topo da Página**: Logo após o menu
- 🎯 **Meio da Página**: Entre seções
- ⬇️ **Rodapé**: Final da página

#### 👁️ **Status:**
- ✅ **Ativo**: Visível no site
- ❌ **Inativo**: Oculto

#### ⏰ **Expira em:**
Data para o banner desaparecer automaticamente.

4. Clique em **"💾 Salvar Banner"**
5. **Veja o resultado** no site!

### Dicas para Imagens de Banner:

✅ **Tamanho ideal:** 1200x400 pixels (largura x altura)  
✅ **Qualidade:** Use imagens de boa resolução  
✅ **Texto na imagem:** Letras grandes e legíveis  
✅ **Cores:** Contraste alto para destacar  
✅ **Peso:** Mantenha abaixo de 1 MB para carregar rápido  

### 🎨 Como criar imagens para banner:

**Opção 1 - Canva (Recomendado):**
1. Acesse [www.canva.com](https://www.canva.com)
2. Crie conta grátis
3. Procure por "Banner Web"
4. Use templates prontos ou crie do zero
5. Baixe como JPG ou PNG

**Opção 2 - Designer profissional:**
Contrate alguém para criar banners profissionais.

---

## 📁 Galeria de Mídia

### O que é?

Um local para **armazenar e organizar** todos os seus arquivos (imagens, PDFs, documentos).

### Como Fazer Upload de Arquivos:

1. No menu lateral, clique em **"📁 Galeria de Mídia"**
2. **Arraste arquivos** para a área de upload ou clique para selecionar
3. Você pode enviar **múltiplos arquivos** de uma vez!

### Tipos de Arquivo Aceitos:

- 📷 **Imagens**: JPG, PNG, GIF
- 📄 **PDFs**: Documentos PDF
- 📝 **Documentos**: DOC, DOCX

### Limite de Tamanho:
- **10 MB por arquivo**

### Como Filtrar Arquivos:

Use os botões no topo:
- 🔍 **Todos**: Mostra tudo
- 🖼️ **Imagens**: Só imagens
- 📄 **PDFs**: Só PDFs
- 📝 **Documentos**: Só documentos

### Como Visualizar um Arquivo:

1. Clique no arquivo na galeria
2. Abre uma janela com detalhes
3. Você pode ver:
   - Prévia (se for imagem)
   - Nome do arquivo
   - Tipo e tamanho
   - Data de upload

### Como Baixar um Arquivo:

1. Clique no arquivo
2. Na janela que abre, clique em **"⬇️ Baixar Arquivo"**
3. Ou clique em **"⬇️ Baixar"** direto no card

### Como Remover um Arquivo:

1. Clique no arquivo
2. Clique em **"🗑️ Remover"**
3. Confirme a remoção

---

## 💾 Backup e Restauração

### Por que fazer Backup?

- 🛡️ **Proteção**: Se algo der errado, você tem uma cópia
- 🔄 **Restauração**: Pode voltar ao estado anterior
- 💼 **Segurança**: Seus dados ficam salvos fora do navegador

### Como Fazer Backup Completo:

#### Método 1 - Dashboard:
1. Vá ao **Dashboard**
2. Em "Ações Rápidas", clique em **"💾 Backup Completo"**
3. Um arquivo `.json` será baixado
4. **Guarde este arquivo em local seguro!**

#### Método 2 - Informativos:
1. Vá em **"📢 Informativos"**
2. Clique em **"📤 Exportar Dados"**
3. Baixa só os informativos

#### Método 3 - Manual:
1. Em qualquer página do admin
2. Clique em **"📤 Exportar Dados"** (se disponível)

### O que o Backup Inclui:

- ✅ Todos os informativos
- ✅ Todos os banners
- ✅ Todos os arquivos da galeria
- ✅ Configurações
- ✅ Data do backup

### Como Restaurar um Backup:

⚠️ **ATENÇÃO:** Isso vai **substituir** todos os dados atuais!

1. Abra o console do navegador (F12)
2. Vá na aba "Console"
3. Cole este código:

```javascript
// 1. Abra o arquivo de backup no bloco de notas
// 2. Copie TODO o conteúdo
// 3. Cole aqui entre as { } abaixo

const backup = { 
    // COLE O CONTEÚDO DO BACKUP AQUI
};

// Execute esta linha para restaurar
localStorage.setItem('igreja_informativos', JSON.stringify(backup.informativos));
localStorage.setItem('igreja_banners', JSON.stringify(backup.banners));
localStorage.setItem('igreja_midia', JSON.stringify(backup.midia));

alert('Backup restaurado! Recarregue a página.');
location.reload();
```

### Frequência Recomendada de Backup:

- 📅 **Semanal**: Se atualiza muito o site
- 📅 **Quinzenal**: Se atualiza pouco
- 📅 **Antes de grandes mudanças**: Sempre!

---

## 💡 Dicas e Boas Práticas

### 📝 Informativos:

1. **Seja claro e objetivo** nos títulos
2. **Use emojis** para chamar atenção (opcional)
3. **Defina prioridades** corretamente
4. **Configure expiração** para eventos passados
5. **Revise antes de publicar**
6. **Desative** ao invés de remover (pode precisar depois)

**Exemplo de bom título:**
- ✅ "Culto de Páscoa - Domingo 09/04 às 10h"
- ❌ "culto"

### 🖼️ Banners:

1. **Tamanho correto** (1200x400px) para melhor qualidade
2. **Texto legível** nas imagens
3. **Cores vibrantes** para chamar atenção
4. **Não exagere**: 1-2 banners ativos por vez
5. **Posicione estrategicamente**
6. **Use descrição** se quiser texto sobre a imagem
7. **Teste no celular** depois de publicar

### 📁 Galeria:

1. **Nomes descritivos** nos arquivos antes de enviar
2. **Organize** por tipo usando os filtros
3. **Delete** arquivos antigos que não usa mais
4. **Comprima** imagens grandes antes de enviar
5. **Limite** de 10MB por arquivo

### 🔐 Segurança:

1. **Sempre faça logout** ao terminar
2. **Não compartilhe** sua senha
3. **Acesse apenas** de computadores confiáveis
4. **Faça backup** regularmente
5. **Troque a senha** a cada 3-6 meses

---

## 🔧 Resolução de Problemas

### ❌ Problema: "Sessão Expirada"

**Causa:** Você ficou mais de 2 horas logado sem atividade.

**Solução:**
1. Faça login novamente
2. Continue de onde parou
3. (Os dados não se perdem)

---

### ❌ Problema: "Muitas tentativas falhadas"

**Causa:** Errou a senha 3 vezes.

**Solução:**
1. Aguarde 30 minutos
2. Ou limpe os dados do navegador
3. Tente novamente

---

### ❌ Problema: Imagem não aparece no banner

**Causas possíveis:**
- Arquivo muito grande (>5MB)
- Formato não suportado
- Imagem corrompida

**Solução:**
1. Reduza o tamanho da imagem
2. Use formatos JPG ou PNG
3. Tente outra imagem

---

### ❌ Problema: Informativo não aparece no site

**Verifique:**
- ✅ Status está como "Ativo"?
- ✅ Data de expiração não passou?
- ✅ Salvou corretamente?
- ✅ Limpou o cache do navegador? (Ctrl+F5)

---

### ❌ Problema: Botão de admin não aparece

**Solução:**
1. Clique **exatamente 5 vezes** no logo
2. Cliques devem ser **rápidos** (3 segundos)
3. Se não funcionar, use o acesso direto:
   `www.seusite.com/admin-login.html`

---

### ❌ Problema: Esqueci minha senha

**Solução:**
1. Contate o desenvolvedor (Lucas)
2. Ele vai resetar sua senha
3. Ou, se tiver acesso ao código, pode alterar você mesmo

---

### ❌ Problema: Site está diferente no celular

**Isso é normal!**
- O site se adapta ao tamanho da tela
- Sempre **teste no celular** depois de publicar
- Abra o site no seu smartphone e veja

---

## 🛡️ Segurança

### Sistema de Proteção:

#### 🔒 Tentativas de Login:
- Máximo de **3 tentativas**
- Bloqueio de **30 minutos** após erros
- Logs de acesso registrados

#### ⏰ Sessão:
- Expira em **2 horas**
- Logout automático por segurança
- Precisa fazer login novamente

#### 👁️ Visibilidade:
- **100% invisível** para visitantes
- Sem links públicos para admin
- Acesso secreto pelo logo

#### 📝 Logs:
- Todas as tentativas de login são registradas
- Você pode ver no console do navegador
- Data, hora e resultado (sucesso/falha)

### Como Ver os Logs de Acesso:

1. No Dashboard, clique em **"📋 Logs de Acesso"**
2. Verá uma lista com:
   - ✅ Logins bem-sucedidos
   - ❌ Tentativas falhadas
   - Data e hora de cada acesso

### Boas Práticas de Segurança:

1. ✅ **Sempre faça logout** quando terminar
2. ✅ **Não salve a senha** no navegador
3. ✅ **Use senha forte** (letras, números, símbolos)
4. ✅ **Troque a senha** periodicamente
5. ✅ **Não compartilhe** credenciais
6. ✅ **Acesse apenas** de locais confiáveis
7. ✅ **Faça backup** regularmente

### Sugestões de Senhas Fortes:

- ❌ **Fraca:** "igreja123"
- ✅ **Forte:** "Igreja@Cristo2025!Centro"
- ✅ **Forte:** "MinhaIgreja#2025$Segura"
- ✅ **Forte:** "Adoracao&Louvor2025!"

**Dica:** Use uma frase que você lembra + números + símbolos

---

## 📱 Usando no Celular

### Sim, você pode usar o admin pelo celular!

O sistema é **totalmente responsivo** e funciona perfeitamente em smartphones e tablets.

### Como Acessar:

1. Abra o navegador do celular
2. Digite: `www.seusite.com/admin-login.html`
3. Faça login normalmente
4. Use todas as funções normalmente!

### Funciona Perfeitamente:

- ✅ Criar/editar informativos
- ✅ Fazer upload de fotos do celular
- ✅ Adicionar banners
- ✅ Ver estatísticas
- ✅ Fazer backup

### Dicas para Mobile:

- 📱 Use fotos direto da câmera para banners
- 📱 Interface adapta ao tamanho da tela
- 📱 Todos os botões são tocáveis
- 📱 Arraste para fazer upload funciona!

---

## 🎓 Tutorial Rápido em Vídeo

### Vídeo 1: Como Fazer Login
1. Acesse o site
2. Clique 5x no logo
3. Faça login
4. Veja o dashboard

### Vídeo 2: Criar um Informativo
1. Menu → Informativos
2. Preencha o formulário
3. Salve
4. Veja no site!

### Vídeo 3: Adicionar um Banner
1. Menu → Banners
2. Selecione uma imagem
3. Preencha dados
4. Salve e veja no site!

*(Nota: Peça ao desenvolvedor para gravar vídeos curtos mostrando isso)*

---

## 📞 Precisa de Ajuda?

### Suporte Técnico:

**Developer:** Lucas Souza  
**Função:** Suporte técnico e manutenção

**O que Lucas ajuda:**
- ✅ Problemas técnicos
- ✅ Bugs e erros
- ✅ Senhas perdidas
- ✅ Restauração de backups
- ✅ Atualizações do sistema

**O que VOCÊ faz sozinho:**
- ✅ Criar/editar informativos
- ✅ Adicionar banners
- ✅ Upload de arquivos
- ✅ Fazer backups
- ✅ Gerenciar conteúdo

---

## ✅ Checklist de Uso Regular

### Toda Semana:
- [ ] Verificar informativos ativos
- [ ] Remover/desativar eventos passados
- [ ] Atualizar avisos importantes

### Todo Mês:
- [ ] Fazer backup completo
- [ ] Revisar banners ativos
- [ ] Limpar arquivos antigos da galeria

### A Cada 3-6 Meses:
- [ ] Trocar senha
- [ ] Revisar logs de acesso
- [ ] Verificar espaço usado

---

## 🎉 Pronto!

Agora você tem **controle total** do site da igreja!

Lembre-se:
1. 🔐 **Segurança em primeiro lugar**
2. 💾 **Faça backups regularmente**
3. 📱 **Teste no celular também**
4. ✅ **Revise antes de publicar**
5. 🚪 **Sempre faça logout**

**Bom trabalho! 🙏**

---

*Última atualização: Outubro 2025*  
*Versão do Sistema: 2.0*  
*Desenvolvido com ❤️ para Igreja de Cristo do Centro*

