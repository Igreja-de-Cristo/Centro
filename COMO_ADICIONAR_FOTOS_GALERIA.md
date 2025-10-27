# 📸 Como Adicionar Fotos à Galeria do Templo

## 🎯 Passos Rápidos

### 1️⃣ **Prepare as Fotos**

Salve as fotos adicionais na pasta `assets/` com os seguintes nomes:
- `templo-interior.jpg` - Foto do interior da igreja
- `templo-exterior.jpg` - Foto externa adicional
- `templo-detalhe.jpg` - Detalhes arquitetônicos
- (Você pode adicionar mais fotos se quiser)

**Recomendações técnicas:**
- Formato: JPG ou WebP
- Dimensões: 800x600px ou maior
- Peso máximo: 500KB por foto
- Qualidade: Alta, mas otimizada

---

### 2️⃣ **Adicione o Código HTML**

Abra o arquivo `index.html` e localize esta seção:

```html
<!-- Galeria de Fotos (preparada para fotos adicionais) -->
<div class="templo-gallery" id="templo-gallery">
    <!-- As fotos adicionais serão inseridas aqui quando disponíveis -->
```

**Substitua o comentário** por este código:

```html
<div class="templo-gallery" id="templo-gallery">
    <div class="gallery-item">
        <img src="./assets/templo-interior.jpg" 
             alt="Interior da Igreja de Cristo do Centro" 
             onclick="abrirLightbox(this.src, this.alt)">
    </div>
    
    <div class="gallery-item">
        <img src="./assets/templo-exterior.jpg" 
             alt="Vista externa da Igreja" 
             onclick="abrirLightbox(this.src, this.alt)">
    </div>
    
    <div class="gallery-item">
        <img src="./assets/templo-detalhe.jpg" 
             alt="Detalhes do templo" 
             onclick="abrirLightbox(this.src, this.alt)">
    </div>
    
    <!-- Adicione mais fotos seguindo o mesmo padrão -->
</div>
```

---

### 3️⃣ **Para Adicionar Mais Fotos**

Basta copiar e colar este bloco dentro da galeria:

```html
<div class="gallery-item">
    <img src="./assets/NOME-DA-FOTO.jpg" 
         alt="Descrição da foto" 
         onclick="abrirLightbox(this.src, this.alt)">
</div>
```

**Troque:**
- `NOME-DA-FOTO.jpg` pelo nome do arquivo
- `Descrição da foto` por uma descrição clara

---

## ✅ **O Que Já Está Funcionando**

- ✅ Foto principal do templo
- ✅ Mapa interativo do Google Maps
- ✅ Botões "Como Chegar" e "Ver no Mapa"
- ✅ Banner parallax com efeito visual
- ✅ Lightbox (clique na foto para ampliar)
- ✅ Design responsivo para mobile
- ✅ Efeitos hover elegantes

---

## 🎨 **Dicas de Fotos**

### **Boas fotos para galeria:**
1. **Interior durante culto** (mas sem rostos identificáveis)
2. **Púlpito e área de pregação**
3. **Salão de estudos bíblicos**
4. **Entrada principal**
5. **Detalhes arquitetônicos** (vitrais, decorações)
6. **Vista panorâmica externa**

### **Evite:**
- ❌ Fotos muito escuras
- ❌ Imagens borradas
- ❌ Arquivos muito pesados (> 1MB)
- ❌ Fotos com pessoas identificáveis (privacidade)

---

## 🚀 **Depois de Adicionar as Fotos**

1. Salve o arquivo `index.html`
2. Teste localmente abrindo o site no navegador
3. Clique nas fotos para testar o lightbox
4. Faça commit e push:

```bash
git add assets/*.jpg index.html
git commit -m "Adiciona galeria de fotos do templo"
git push
```

---

## 💡 **Recursos Disponíveis**

### **Lightbox (Modal de Zoom):**
- Clique em qualquer foto para ampliar
- Pressione ESC ou clique fora para fechar
- Navegação suave e elegante

### **Google Maps:**
- Mapa interativo embutido
- Botão "Como Chegar" (abre no app de mapas)
- Botão "Ver no Google Maps" (abre no navegador)

### **Banner Parallax:**
- Efeito de profundidade no scroll
- Foto de fundo fixa
- Call-to-action para reuniões

---

## ❓ Dúvidas?

Se precisar de ajuda, me chame! 😊
