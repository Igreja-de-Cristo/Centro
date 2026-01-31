// SEO e Meta Tags Padrão
const defaultMeta = {
    title: "Igreja de Cristo do Centro - Manaus/AM",
    description: "Comunidade cristã bíblica em Manaus, oferecendo cursos gratuitos, estudos bíblicos e reuniões baseadas no Novo Testamento.",
    keywords: "igreja, cristo, manaus, cursos bíblicos, reuniões, cristianismo, novo testamento",
    author: "Igreja de Cristo do Centro",
    image: "https://igrejadecristo-centro.netlify.app/assets/images/content/templo-principal.jpeg",
    url: "https://igrejadecristo-centro.netlify.app",
    type: "website"
};

// Dados estruturados padrão (JSON-LD)
const defaultJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Igreja de Cristo do Centro",
    "alternateName": "Igreja de Cristo Manaus Centro",
    "url": "https://igrejadecristo-centro.netlify.app",
    "logo": "https://igrejadecristo-centro.netlify.app/assets/images/icons/logo-igreja.svg",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "Av. Sete de Setembro, 1801",
        "addressLocality": "Manaus",
        "addressRegion": "AM",
        "postalCode": "69005-141",
        "addressCountry": "BR"
    },
    "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+55-92-99114-6877",
        "contactType": "customer service"
    },
    "sameAs": [
        "https://www.instagram.com/igrejadecristodasete/",
        "https://www.youtube.com/@igrejadecristonocentro-manaus"
    ]
};

// Função para gerar meta tags
function generateMetaTags(customMeta = {}) {
    const meta = { ...defaultMeta, ...customMeta };
    return `
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
        <meta name="description" content="${meta.description}">
        <meta name="keywords" content="${meta.keywords}">
        <meta name="author" content="${meta.author}">
        <meta name="robots" content="index, follow">
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="${meta.type}">
        <meta property="og:url" content="${meta.url}">
        <meta property="og:title" content="${meta.title}">
        <meta property="og:description" content="${meta.description}">
        <meta property="og:image" content="${meta.image}">
        
        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${meta.title}">
        <meta name="twitter:description" content="${meta.description}">
        <meta name="twitter:image" content="${meta.image}">
        
        <!-- Canonical -->
        <link rel="canonical" href="${meta.url}">
        
        <!-- Favicons -->
        <link rel="icon" type="image/svg+xml" href="/assets/images/icons/logo-igreja.svg">
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicons/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicons/favicon-16x16.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/favicons/apple-touch-icon.png">
        <link rel="manifest" href="/assets/favicons/site.webmanifest">
    `;
}

// Função para gerar JSON-LD
function generateJsonLd(customData = {}) {
    const jsonLd = { ...defaultJsonLd, ...customData };
    return `
        <script type="application/ld+json">
            ${JSON.stringify(jsonLd, null, 2)}
        </script>
    `;
}

// Exportar funções
module.exports = {
    generateMetaTags,
    generateJsonLd,
    defaultMeta,
    defaultJsonLd
};