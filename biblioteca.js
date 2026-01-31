// ===== BIBLIOTECA.JS REFATORADO - VERSÃO SEGURA =====
// Correções aplicadas:
// 1. XSS: innerHTML substituído por createElement
// 2. Performance: Event delegation implementado
// 3. Memory: Listeners únicos ao invés de N listeners

// Configuração do localStorage
const STORAGE_KEY = 'igreja_biblioteca';
const FAVORITOS_KEY = 'igreja_biblioteca_favoritos';
const HISTORICO_KEY = 'igreja_biblioteca_historico';

// Estado global
let todosLivros = [];
let livrosFiltrados = [];
let favoritos = [];
let historico = [];
let categoriaAtual = 'todas';
let ordenacaoAtual = 'recente';

// ========================================
// INICIALIZAÇÃO
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('📚 Sistema de Biblioteca Iniciado');

    // Carregar dados
    carregarLivros();
    carregarFavoritos();
    carregarHistorico();

    // Configurar event listeners
    setupEventListeners();

    // Renderizar
    aplicarFiltros();
    atualizarEstatisticas();
    renderizarFavoritos();
    renderizarHistorico();
});

// ========================================
// CARREGAR DADOS
// ========================================

function carregarLivros() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            todosLivros = JSON.parse(stored);
        } else {
            todosLivros = [];
        }
    } catch (error) {
        console.error('❌ Erro ao carregar livros:', error);
        todosLivros = [];
    }
}

function carregarFavoritos() {
    try {
        const stored = localStorage.getItem(FAVORITOS_KEY);
        favoritos = stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('❌ Erro ao carregar favoritos:', error);
        favoritos = [];
    }
}

function carregarHistorico() {
    try {
        const stored = localStorage.getItem(HISTORICO_KEY);
        historico = stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('❌ Erro ao carregar histórico:', error);
        historico = [];
    }
}

// ========================================
// EVENT LISTENERS
// ========================================

function setupEventListeners() {
    // Busca
    const inputBusca = document.getElementById('busca-livros');
    const btnBuscar = document.getElementById('btn-buscar');

    if (inputBusca) {
        inputBusca.addEventListener('input', debounce(aplicarFiltros, 300));
        inputBusca.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') aplicarFiltros();
        });
    }

    if (btnBuscar) {
        btnBuscar.addEventListener('click', aplicarFiltros);
    }

    // Accordion de categorias
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', function () {
            const accordionItem = this.closest('.accordion-item');
            const isActive = accordionItem.classList.contains('active');

            // Fechar todos os accordions
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
                const content = item.querySelector('.accordion-content');
                const arrow = item.querySelector('.accordion-arrow');
                if (content) content.classList.remove('active');
                if (arrow) arrow.textContent = '▶';
            });

            // Abrir o accordion clicado se não estava aberto
            if (!isActive) {
                accordionItem.classList.add('active');
                const content = accordionItem.querySelector('.accordion-content');
                const arrow = accordionItem.querySelector('.accordion-arrow');
                if (content) content.classList.add('active');
                if (arrow) arrow.textContent = '▼';

                // Atualizar categoria atual
                categoriaAtual = accordionItem.dataset.categoria;
                aplicarFiltros();
            } else {
                // Se estava aberto, fecha e mostra todos
                categoriaAtual = 'todas';
                aplicarFiltros();
            }
        });
    });

    // Ordenação
    const selectOrdenacao = document.getElementById('ordenacao');
    if (selectOrdenacao) {
        selectOrdenacao.addEventListener('change', function () {
            ordenacaoAtual = this.value;
            aplicarFiltros();
        });
    }

    // Modal
    const closeModal = document.getElementById('close-pdf-modal');
    if (closeModal) {
        closeModal.addEventListener('click', fecharModal);
    }

    // Fechar modal ao clicar fora
    const modal = document.getElementById('pdf-modal');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) fecharModal();
        });
    }

    // EVENT DELEGATION para botões dos cards
    setupEventDelegation();
}

// ========================================
// EVENT DELEGATION (CORREÇÃO DE PERFORMANCE)
// ========================================

function setupEventDelegation() {
    const grid = document.getElementById('livros-grid');
    if (grid && !grid._delegationSetup) {
        grid._delegationSetup = true;

        grid.addEventListener('click', function (e) {
            const target = e.target.closest('[data-action]');
            if (!target) return;

            const action = target.dataset.action;
            const id = target.dataset.id;

            switch (action) {
                case 'ler':
                    abrirLivro(id);
                    break;
                case 'download':
                    registrarDownload(id);
                    break;
                case 'favoritar':
                    toggleFavorito(id);
                    break;
            }
        });
    }

    // Event delegation para accordions
    document.querySelectorAll('.accordion-content').forEach(accordion => {
        if (accordion._delegationSetup) return;
        accordion._delegationSetup = true;

        accordion.addEventListener('click', function (e) {
            const target = e.target.closest('[data-action]');
            if (!target) return;

            const action = target.dataset.action;
            const id = target.dataset.id;

            switch (action) {
                case 'ler':
                    abrirLivro(id);
                    break;
                case 'download':
                    registrarDownload(id);
                    break;
                case 'favoritar':
                    toggleFavorito(id);
                    break;
            }
        });
    });
}

// ========================================
// FILTROS E BUSCA
// ========================================

function aplicarFiltros() {
    const termoBusca = document.getElementById('busca-livros')?.value.toLowerCase() || '';

    // Filtrar por categoria
    livrosFiltrados = categoriaAtual === 'todas'
        ? [...todosLivros]
        : todosLivros.filter(livro => livro.categoria === categoriaAtual);

    // Filtrar por busca
    if (termoBusca) {
        livrosFiltrados = livrosFiltrados.filter(livro => {
            const titulo = (livro.titulo || '').toLowerCase();
            const autor = (livro.autor || '').toLowerCase();
            const descricao = (livro.descricao || '').toLowerCase();
            const tags = (livro.tags || []).join(' ').toLowerCase();

            return titulo.includes(termoBusca) ||
                autor.includes(termoBusca) ||
                descricao.includes(termoBusca) ||
                tags.includes(termoBusca);
        });
    }

    // Ordenar
    ordenarLivros();

    // Renderizar
    renderizarLivros();
}

function ordenarLivros() {
    switch (ordenacaoAtual) {
        case 'recente':
            livrosFiltrados.sort((a, b) => new Date(b.dataCadastro) - new Date(a.dataCadastro));
            break;
        case 'antigo':
            livrosFiltrados.sort((a, b) => new Date(a.dataCadastro) - new Date(b.dataCadastro));
            break;
        case 'titulo':
            livrosFiltrados.sort((a, b) => a.titulo.localeCompare(b.titulo));
            break;
        case 'autor':
            livrosFiltrados.sort((a, b) => a.autor.localeCompare(b.autor));
            break;
        case 'popular':
            livrosFiltrados.sort((a, b) => (b.visualizacoes || 0) - (a.visualizacoes || 0));
            break;
    }
}

// ========================================
// RENDERIZAR LIVROS (CORREÇÃO XSS)
// ========================================

function renderizarLivros() {
    const grid = document.getElementById('livros-grid');
    if (!grid) return;

    // Limpar grid
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }

    if (livrosFiltrados.length === 0) {
        // Empty state seguro
        const emptyState = criarEmptyState();
        grid.appendChild(emptyState);
    } else {
        // Usar DocumentFragment para performance
        const fragment = document.createDocumentFragment();

        livrosFiltrados.forEach(livro => {
            const card = criarCardLivroSeguro(livro);
            fragment.appendChild(card);
        });

        grid.appendChild(fragment);
    }

    // Renderizar accordions
    renderizarAccordions();
}

function criarEmptyState() {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';

    const icon = document.createElement('div');
    icon.className = 'empty-icon';
    icon.textContent = '📚';

    const h3 = document.createElement('h3');
    h3.textContent = 'Biblioteca em Construção';

    const p1 = document.createElement('p');
    p1.textContent = 'Em breve teremos diversos livros e estudos bíblicos disponíveis!';

    const p2 = document.createElement('p');
    p2.className = 'text-muted';
    p2.textContent = 'Os irmãos da igreja estão preparando materiais para compartilhar.';

    emptyState.appendChild(icon);
    emptyState.appendChild(h3);
    emptyState.appendChild(p1);
    emptyState.appendChild(p2);

    return emptyState;
}

function renderizarAccordions() {
    const categorias = ['todas', 'pregacoes', 'intensivos', 'cursos', 'infantil', 'casais', 'hinarios'];

    categorias.forEach(cat => {
        const conteudoDiv = document.getElementById(`conteudo-${cat}`);
        if (!conteudoDiv) return;

        // Limpar
        while (conteudoDiv.firstChild) {
            conteudoDiv.removeChild(conteudoDiv.firstChild);
        }

        if (cat !== categoriaAtual) return;

        // Filtrar livros
        let livrosCategoria = cat === 'todas'
            ? [...todosLivros]
            : todosLivros.filter(l => l.categoria === cat);

        // Aplicar busca
        const termoBusca = document.getElementById('busca-livros')?.value.toLowerCase() || '';
        if (termoBusca) {
            livrosCategoria = livrosCategoria.filter(livro => {
                const titulo = (livro.titulo || '').toLowerCase();
                const autor = (livro.autor || '').toLowerCase();
                return titulo.includes(termoBusca) || autor.includes(termoBusca);
            });
        }

        // Ordenar
        switch (ordenacaoAtual) {
            case 'recente':
                livrosCategoria.sort((a, b) => new Date(b.dataCadastro) - new Date(a.dataCadastro));
                break;
            case 'titulo':
                livrosCategoria.sort((a, b) => a.titulo.localeCompare(b.titulo));
                break;
        }

        // Renderizar
        if (livrosCategoria.length === 0) {
            const empty = document.createElement('p');
            empty.className = 'empty-message';
            empty.textContent = 'Nenhum livro encontrado nesta categoria.';
            conteudoDiv.appendChild(empty);
        } else {
            const fragment = document.createDocumentFragment();
            livrosCategoria.forEach(livro => {
                const card = criarCardLivroSeguro(livro);
                fragment.appendChild(card);
            });
            conteudoDiv.appendChild(fragment);
        }
    });
}

// ========================================
// CRIAR CARD SEGURO (CORREÇÃO XSS)
// ========================================

function criarCardLivroSeguro(livro) {
    const categoria = getCategoriaInfo(livro.categoria);
    const isFavorito = favoritos.includes(livro.id);
    const isNovo = isLivroNovo(livro.dataCadastro);
    const isPopular = (livro.visualizacoes || 0) >= 50;

    const card = document.createElement('div');
    card.className = 'livro-card';

    // Badges
    if (isNovo) {
        const badge = document.createElement('span');
        badge.className = 'badge badge-new';
        badge.textContent = 'NOVO';
        card.appendChild(badge);
    }

    if (isPopular) {
        const badge = document.createElement('span');
        badge.className = 'badge badge-popular';
        badge.textContent = 'POPULAR';
        card.appendChild(badge);
    }

    // Capa
    const capa = document.createElement('div');
    capa.className = 'livro-capa';

    if (livro.linkCapa) {
        const img = document.createElement('img');
        img.src = livro.linkCapa;
        img.alt = `Capa de ${livro.titulo}`;
        img.loading = 'lazy';
        capa.appendChild(img);
    } else {
        const placeholder = document.createElement('div');
        placeholder.className = 'capa-placeholder';
        placeholder.textContent = categoria.icon;
        capa.appendChild(placeholder);
    }

    card.appendChild(capa);

    // Info
    const info = document.createElement('div');
    info.className = 'livro-info';

    const catDiv = document.createElement('div');
    catDiv.className = 'livro-categoria';
    catDiv.textContent = `${categoria.icon} ${categoria.name}`;
    info.appendChild(catDiv);

    const titulo = document.createElement('h3');
    titulo.className = 'livro-titulo';
    titulo.textContent = livro.titulo;
    info.appendChild(titulo);

    const autor = document.createElement('p');
    autor.className = 'livro-autor';
    autor.textContent = `✍️ ${livro.autor}`;
    info.appendChild(autor);

    // Meta
    const meta = document.createElement('div');
    meta.className = 'livro-meta';

    if (livro.numeroPaginas) {
        const span = document.createElement('span');
        span.textContent = `📄 ${livro.numeroPaginas} páginas`;
        meta.appendChild(span);
    }

    const leituras = document.createElement('span');
    leituras.textContent = `👁️ ${livro.visualizacoes || 0} leituras`;
    meta.appendChild(leituras);

    const downloads = document.createElement('span');
    downloads.textContent = `📥 ${livro.downloads || 0} downloads`;
    meta.appendChild(downloads);

    info.appendChild(meta);

    // Tags
    if (livro.tags && livro.tags.length > 0) {
        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'livro-tags';

        livro.tags.slice(0, 3).forEach(tag => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = tag;
            tagsDiv.appendChild(span);
        });

        info.appendChild(tagsDiv);
    }

    // Descrição
    const desc = document.createElement('p');
    desc.className = 'livro-descricao';
    desc.textContent = truncarTexto(livro.descricao || 'Descrição não disponível', 120);
    info.appendChild(desc);

    // Actions
    const actions = document.createElement('div');
    actions.className = 'livro-actions';

    const btnLer = document.createElement('button');
    btnLer.className = 'btn btn-primary';
    btnLer.dataset.action = 'ler';
    btnLer.dataset.id = livro.id;
    btnLer.textContent = '📖 Ler Online';
    actions.appendChild(btnLer);

    const btnDownload = document.createElement('a');
    btnDownload.href = livro.linkPdf || '#';
    btnDownload.target = '_blank';
    btnDownload.className = 'btn btn-outline';
    btnDownload.dataset.action = 'download';
    btnDownload.dataset.id = livro.id;
    btnDownload.textContent = '📥 Download';
    actions.appendChild(btnDownload);

    const btnFav = document.createElement('button');
    btnFav.className = `btn-icon ${isFavorito ? 'favorito' : ''}`;
    btnFav.dataset.action = 'favoritar';
    btnFav.dataset.id = livro.id;
    btnFav.title = isFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos';
    btnFav.textContent = isFavorito ? '⭐' : '☆';
    actions.appendChild(btnFav);

    info.appendChild(actions);
    card.appendChild(info);

    return card;
}

// Continua com as funções auxiliares...
// (getCategoriaInfo, isLivroNovo, truncarTexto, etc.)

function getCategoriaInfo(categoria) {
    const categorias = {
        'pregacoes': { name: 'Pregações', icon: '🎤' },
        'intensivos': { name: 'Intensivos', icon: '📖' },
        'cursos': { name: 'Cursos', icon: '🎓' },
        'infantil': { name: 'Infantil', icon: '👶' },
        'casais': { name: 'Casais', icon: '💑' },
        'hinarios': { name: 'Hinários', icon: '🎵' }
    };
    return categorias[categoria] || { name: 'Geral', icon: '📚' };
}

function isLivroNovo(dataCadastro) {
    if (!dataCadastro) return false;
    const data = new Date(dataCadastro);
    const hoje = new Date();
    const diffDias = (hoje - data) / (1000 * 60 * 60 * 24);
    return diffDias <= 30;
}

function truncarTexto(texto, maxLength) {
    if (!texto) return '';
    if (texto.length <= maxLength) return texto;
    return texto.substring(0, maxLength) + '...';
}

// Debounce helper
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Funções de modal, favoritos, etc. continuam iguais...
// (abrirLivro, fecharModal, toggleFavorito, etc.)

function abrirLivro(id) {
    const livro = todosLivros.find(l => l.id === id);
    if (!livro) return;

    incrementarVisualizacoes(id);
    adicionarAoHistorico(id);

    const modal = document.getElementById('pdf-modal');
    const frame = document.getElementById('pdf-frame');
    const titulo = document.getElementById('pdf-titulo');

    if (modal && frame && titulo) {
        titulo.textContent = livro.titulo;
        frame.src = livro.linkPdf || '';
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function fecharModal() {
    const modal = document.getElementById('pdf-modal');
    const frame = document.getElementById('pdf-frame');

    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    if (frame) {
        frame.src = '';
    }
}

function toggleFavorito(id) {
    const index = favoritos.indexOf(id);

    if (index > -1) {
        favoritos.splice(index, 1);
    } else {
        favoritos.push(id);
    }

    salvarFavoritos();
    renderizarFavoritos();
    renderizarLivros();
}

function salvarFavoritos() {
    try {
        localStorage.setItem(FAVORITOS_KEY, JSON.stringify(favoritos));
    } catch (error) {
        console.error('❌ Erro ao salvar favoritos:', error);
    }
}

function incrementarVisualizacoes(id) {
    const livro = todosLivros.find(l => l.id === id);
    if (livro) {
        livro.visualizacoes = (livro.visualizacoes || 0) + 1;
        salvarLivros();
    }
}

function registrarDownload(id) {
    const livro = todosLivros.find(l => l.id === id);
    if (livro) {
        livro.downloads = (livro.downloads || 0) + 1;
        salvarLivros();
    }
}

function salvarLivros() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todosLivros));
    } catch (error) {
        console.error('❌ Erro ao salvar livros:', error);
    }
}

function adicionarAoHistorico(id) {
    const index = historico.indexOf(id);
    if (index > -1) {
        historico.splice(index, 1);
    }

    historico.unshift(id);

    if (historico.length > 5) {
        historico = historico.slice(0, 5);
    }

    salvarHistorico();
    renderizarHistorico();
}

function salvarHistorico() {
    try {
        localStorage.setItem(HISTORICO_KEY, JSON.stringify(historico));
    } catch (error) {
        console.error('❌ Erro ao salvar histórico:', error);
    }
}

function renderizarFavoritos() {
    const container = document.getElementById('favoritos-livros');
    if (!container) return;

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    if (favoritos.length === 0) return;

    const livrosFavoritos = todosLivros.filter(l => favoritos.includes(l.id));
    const fragment = document.createDocumentFragment();

    livrosFavoritos.forEach(livro => {
        const card = criarCardLivroPequeno(livro);
        fragment.appendChild(card);
    });

    container.appendChild(fragment);
}

function renderizarHistorico() {
    const container = document.getElementById('historico-livros');
    if (!container) return;

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    if (historico.length === 0) return;

    const livrosHistorico = historico
        .map(id => todosLivros.find(l => l.id === id))
        .filter(l => l !== undefined);

    const fragment = document.createDocumentFragment();

    livrosHistorico.forEach(livro => {
        const card = criarCardLivroPequeno(livro);
        fragment.appendChild(card);
    });

    container.appendChild(fragment);
}

function criarCardLivroPequeno(livro) {
    const categoria = getCategoriaInfo(livro.categoria);

    const card = document.createElement('div');
    card.className = 'livro-card-small';
    card.onclick = () => abrirLivro(livro.id);

    const capa = document.createElement('div');
    capa.className = 'livro-capa-small';

    if (livro.linkCapa) {
        const img = document.createElement('img');
        img.src = livro.linkCapa;
        img.alt = livro.titulo;
        capa.appendChild(img);
    } else {
        const placeholder = document.createElement('div');
        placeholder.className = 'capa-placeholder-small';
        placeholder.textContent = categoria.icon;
        capa.appendChild(placeholder);
    }

    card.appendChild(capa);

    const info = document.createElement('div');
    info.className = 'livro-info-small';

    const h4 = document.createElement('h4');
    h4.textContent = truncarTexto(livro.titulo, 40);
    info.appendChild(h4);

    const p = document.createElement('p');
    p.textContent = livro.autor;
    info.appendChild(p);

    card.appendChild(info);

    return card;
}

function atualizarEstatisticas() {
    const totalLivros = document.getElementById('total-livros');
    if (totalLivros) {
        totalLivros.textContent = todosLivros.length;
    }

    const autoresUnicos = new Set(todosLivros.map(l => l.autor)).size;
    const totalAutores = document.getElementById('total-autores');
    if (totalAutores) {
        totalAutores.textContent = autoresUnicos;
    }

    const downloads = todosLivros.reduce((sum, l) => sum + (l.downloads || 0), 0);
    const totalDownloads = document.getElementById('total-downloads');
    if (totalDownloads) {
        totalDownloads.textContent = downloads;
    }
}
