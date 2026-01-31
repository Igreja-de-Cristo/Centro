#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Iniciando processo de deploy...${NC}"

# Verificar branch atual
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
    echo -e "${RED}Erro: Você deve estar na branch main para fazer deploy${NC}"
    exit 1
fi

# Verificar mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${RED}Erro: Existem mudanças não commitadas${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Branch e status do git verificados${NC}"

# Instalar dependências
echo "Instalando dependências..."
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}Erro: Falha ao instalar dependências${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Dependências instaladas${NC}"

# Otimizar imagens
echo "Otimizando imagens..."
npm run optimize:images
if [ $? -ne 0 ]; then
    echo -e "${RED}Erro: Falha ao otimizar imagens${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Imagens otimizadas${NC}"

# Otimizar CSS
echo "Otimizando CSS..."
npm run optimize:css
if [ $? -ne 0 ]; then
    echo -e "${RED}Erro: Falha ao otimizar CSS${NC}"
    exit 1
fi

echo -e "${GREEN}✓ CSS otimizado${NC}"

# Otimizar JavaScript
echo "Otimizando JavaScript..."
npm run optimize:js
if [ $? -ne 0 ]; then
    echo -e "${RED}Erro: Falha ao otimizar JavaScript${NC}"
    exit 1
fi

echo -e "${GREEN}✓ JavaScript otimizado${NC}"

# Gerar service worker
echo "Gerando service worker..."
node scripts/generate-sw.js
if [ $? -ne 0 ]; then
    echo -e "${RED}Erro: Falha ao gerar service worker${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Service worker gerado${NC}"

# Criar diretório de distribuição
echo "Criando diretório de distribuição..."
rm -rf dist
mkdir dist

# Copiar arquivos otimizados
echo "Copiando arquivos..."
cp -r index.html *.html robots.txt sitemap.xml dist/
cp -r assets/css/dist/* dist/css/
cp -r assets/js/dist/* dist/js/
cp -r assets/images/dist/* dist/images/
cp -r assets/fonts dist/fonts
cp -r assets/favicons dist/favicons

echo -e "${GREEN}✓ Arquivos copiados para diretório de distribuição${NC}"

# Validar HTML
echo "Validando HTML..."
html-validator --file dist/*.html
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠ Avisos na validação HTML${NC}"
fi

echo -e "${GREEN}✓ Validação HTML completa${NC}"

# Verificar links
echo "Verificando links..."
broken-link-checker http://localhost:8080 -r
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠ Links quebrados encontrados${NC}"
fi

echo -e "${GREEN}✓ Verificação de links completa${NC}"

# Deploy para produção
echo "Fazendo deploy para produção..."
git push origin main
if [ $? -ne 0 ]; then
    echo -e "${RED}Erro: Falha ao fazer push para origin/main${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Deploy completado com sucesso!${NC}"

# Sumário
echo -e "\n${YELLOW}Deploy completado:${NC}"
echo -e "- Branch: main"
echo -e "- Commit: $(git rev-parse --short HEAD)"
echo -e "- Data: $(date)"
echo -e "- URL: https://igrejadecristo-centro.netlify.app"