# 📢 Sistema de Informativos da Igreja

## 🎯 Visão Geral

O Sistema de Informativos permite gerenciar facilmente eventos, avisos, anúncios e informativos urgentes da igreja. O sistema foi projetado para ser simples, não requer login e funciona perfeitamente em dispositivos móveis e desktop.

## ✨ Características Principais

### 🔧 **Sem Login Necessário**
- Sistema completamente aberto
- Acesso direto pelo navegador
- Dados salvos localmente no dispositivo

### 📱 **Responsivo e Mobile-First**
- Interface otimizada para celular
- Design adaptável para tablets e desktop
- Funciona offline após primeiro acesso

### 🎨 **Interface Intuitiva**
- Design moderno com emojis visuais
- Cores organizadas por prioridade
- Feedback visual em tempo real

## 📋 Tipos de Informativos

| Tipo | Ícone | Uso Recomendado |
|------|--------|-----------------|
| **🎉 Evento** | Festas, cultos especiais, atividades | Programações da igreja |
| **📢 Anúncio** | Comunicados gerais | Informações importantes |
| **⚠️ Aviso** | Alertas importantes | Mudanças de horário, local |
| **🚨 Urgente** | Questões críticas | Emergências, cancelamentos |

## 🚀 Como Usar o Sistema

### 1. **Acessar o Painel Administrativo**
```
https://seusite.com/admin-informativos.html
```
Ou clique no link "📢 Admin" no menu do site.

### 2. **Adicionar Novo Informativo**
1. Preencha o formulário com:
   - **Tipo**: Escolha entre Evento, Anúncio, Aviso ou Urgente
   - **Título**: Máximo 100 caracteres
   - **Descrição**: Máximo 500 caracteres (opcional)
   - **Data do Evento**: Data e hora específicas (opcional)
   - **Prioridade**: Alta (🔴), Média (🟡) ou Baixa (🟢)
   - **Status**: Ativo (visível) ou Inativo (oculto)
   - **Data de Expiração**: Quando deve parar de aparecer (opcional)

2. Clique em "💾 Salvar Informativo"

### 3. **Gerenciar Informativos Existentes**
- **✏️ Editar**: Modifica informações existentes
- **🗑️ Remover**: Exclui permanentemente
- **👁️ Status**: Ativa/desativa visualização no site

## 🌐 Como Aparecem no Site

### **Banner Principal**
- Aparece no topo da página inicial
- Exibe informativos ativos por ordem de prioridade
- Usuários podem fechar o banner (reaparece após 1 hora)

### **Ordenação Automática**
1. **Prioridade**: Alta → Média → Baixa
2. **Data de Criação**: Mais recentes primeiro
3. **Informativos Expirados**: Não aparecem

### **Design Responsivo**
- **Desktop**: Grade com múltiplas colunas
- **Mobile**: Lista vertical otimizada
- **Cores por Prioridade**: Vermelho (alta), Laranja (média), Verde (baixa)

## 📱 Uso no Celular

### **Adicionar Informativos pelo Smartphone**
1. Abra o navegador
2. Acesse: `seusite.com/admin-informativos.html`
3. Preencha o formulário (interface otimizada para touch)
4. Salve o informativo

### **Vantagens Mobile**
- ✅ Interface adaptada para dedos
- ✅ Campos grandes e fáceis de tocar
- ✅ Validação em tempo real
- ✅ Notificações visuais de sucesso/erro

## 💾 Armazenamento de Dados

### **LocalStorage**
- Dados salvos no navegador
- Persistem entre sessões
- Não requer servidor

### **Backup e Exportação**
- Botão "📤 Exportar Dados" gera arquivo JSON
- Contém todos os informativos com timestamps
- Permite backup manual dos dados

### **Sincronização**
⚠️ **Importante**: Dados são salvos localmente no dispositivo que criou. Para uso em múltiplos dispositivos, considere:
- Usar sempre o mesmo dispositivo para administração
- Exportar dados periodicamente como backup
- Compartilhar arquivo JSON entre dispositivos se necessário

## 🔧 Configurações Avançadas

### **Personalizar Tempos de Exibição**
```javascript
// No código JavaScript (linha ~65 do index.html)
const umaHora = 1000 * 60 * 60; // Modificar para alterar tempo de reexibição
```

### **Modificar Cores e Estilos**
Edite o arquivo `style.css` nas seções:
- `.informativos-banner` - Banner principal
- `.prioridade-alta/media/baixa` - Cores por prioridade
- `.informativo-item` - Cartões individuais

### **Adicionar Novos Tipos**
1. Modifique o formulário em `admin-informativos.html`
2. Adicione novo `<option>` no select de tipo
3. Adicione novo ícone na função `getTipoIcon()`

## 🛠️ Estrutura de Arquivos

```
projeto/
├── admin-informativos.html    # Painel administrativo
├── index.html                 # Página principal (exibe informativos)
├── style.css                  # Estilos (inclui CSS do banner)
└── README.md                  # Esta documentação
```

## 🚨 Solução de Problemas

### **Informativos não aparecem no site**
1. ✅ Verifique se estão marcados como "Ativo"
2. ✅ Confirme se não estão expirados
3. ✅ Teste em modo privado do navegador
4. ✅ Limpe cache se necessário

### **Banner não aparece**
1. ✅ Verifique se há informativos ativos
2. ✅ Confirme se não foi fechado recentemente (aguarde 1 hora)
3. ✅ Teste `localStorage.removeItem('banner_fechado')`

### **Dados perdidos**
1. ✅ Verifique se está no mesmo navegador/dispositivo
2. ✅ Restaure de backup JSON se disponível
3. ✅ Evite usar modo privado para administração

## 🎯 Melhores Práticas

### **📝 Criação de Conteúdo**
- Use títulos claros e diretos
- Mantenha descrições concisas
- Defina datas de expiração para eventos
- Prefira prioridade "média" como padrão

### **🕒 Gestão de Tempo**
- Publique eventos com antecedência
- Remove informativos antigos regularmente
- Use data de expiração para limpeza automática

### **📱 Administração**
- Use sempre o mesmo dispositivo para gerenciar
- Faça backup dos dados periodicamente
- Teste visualização no site após adicionar

### **🎨 Design e UX**
- Não abuse de informativos urgentes
- Mantenha máximo de 3-5 informativos ativos
- Use tipos apropriados para cada situação

## 🔮 Expansões Futuras Possíveis

- 🌟 Sistema de notificações push
- 🌟 Sincronização em nuvem
- 🌟 Agenda visual de eventos
- 🌟 Sistema de categorias
- 🌟 Templates de informativos
- 🌟 Analytics de visualização

---

**💡 Dica**: Mantenha este arquivo sempre atualizado conforme modificações no sistema!