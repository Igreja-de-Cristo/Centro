#!/bin/bash

# Criar estrutura de diretórios
mkdir -p assets/{css,js}/{components,pages} \
       assets/{images/{icons,content},fonts,favicons,uploads} \
       components \
       pages \
       public \
       admin/{css,js} \
       docs

# Mover ícones para pasta correta
mv assets/*.svg assets/images/icons/

# Mover imagens para pasta correta
mv assets/*.{jpg,jpeg,png} assets/images/content/

# Reorganizar arquivos CSS
mv assets/css/mobile-nav-combined.css assets/css/components/mobile-nav.css
mv assets/css/cookie-consent.css assets/css/components/cookie-consent.css
mv admin/css/components/* assets/css/components/
mv style.css assets/css/style.css

# Reorganizar arquivos JS
mv assets/js/mobile-nav.js assets/js/components/
mv assets/js/cookie-consent.js assets/js/components/
mv assets/js/video-player.js assets/js/components/
mv assets/js/{biblioteca,eventos}.js assets/js/pages/

# Reorganizar arquivos do Admin
mv admin.html admin/index.html
mv admin-login.html admin/login.html
mv admin/css/* admin/css/
mv admin/js/* admin/js/

# Mover guias para docs
mv *.md docs/

# Criar arquivo .gitignore adequado
echo "node_modules/
.DS_Store
*.log
.env
dist/
tmp/
.cache/
.vscode/" > .gitignore

# Atualizar package.json
echo '{
  "name": "igreja-de-cristo-centro",
  "version": "2.0.0",
  "description": "Site da Igreja de Cristo do Centro - Manaus",
  "private": true,
  "scripts": {
    "dev": "live-server",
    "build": "npm run optimize",
    "optimize": "npm run optimize:images && npm run optimize:css && npm run optimize:js",
    "optimize:images": "imagemin assets/images/* --out-dir=dist/images",
    "optimize:css": "postcss assets/css/*.css --dir dist/css",
    "optimize:js": "uglifyjs assets/js/**/*.js --compress --mangle --output dist/js/bundle.min.js"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.0",
    "cssnano": "^5.0.0",
    "imagemin-cli": "^7.0.0",
    "live-server": "^1.2.1",
    "postcss-cli": "^8.3.1",
    "uglify-js": "^3.14.0"
  }
}' > package.json

# Criar arquivo de configuração PostCSS
echo "module.exports = {
  plugins: [
    require('autoprefixer'),
    require('cssnano')
  ]
}" > postcss.config.js