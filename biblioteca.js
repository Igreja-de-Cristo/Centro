// ========================================
// SISTEMA DE BIBLIOTECA DIGITAL
// Igreja de Cristo do Centro
// ========================================

// Configuração do localStorage
const STORAGE_KEY = 'igreja_biblioteca';
const FAVORITOS_KEY = 'igreja_biblioteca_favoritos';
const HISTORICO_KEY = 'igreja_biblioteca_historico';

// Estado global
let todosLivros = [];
let livrosFiltrados = [];
let categoriaAtual = 'todas';
let ordenacaoAtual = 'recente';
let favoritos = [];
let historico = [];

// ========================================
// INICIALIZAÇÃO
// ========================================

document.addEventListener('DOMContentLoaded', function() {
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
    renderizarHistorico();
    renderizarFavoritos();
});

// ========================================
// CARREGAR DADOS
// ========================================

function carregarLivros() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            todosLivros = JSON.parse(stored);
            console.log(`✅ ${todosLivros.length} livros carregados`);
        } else {
            todosLivros = [];
            console.log('📭 Nenhum livro cadastrado ainda');
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
        inputBusca.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') aplicarFiltros();
        });
    }
    
    if (btnBuscar) {
        btnBuscar.addEventListener('click', aplicarFiltros);
    }
    
    // Accordion de categorias
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', function() {
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
        selectOrdenacao.addEventListener('change', function() {
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
        modal.addEventListener('click', function(e) {
            if (e.target === modal) fecharModal();
        });
    }
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
    switch(ordenacaoAtual) {
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
// RENDERIZAR LIVROS
// ========================================

function renderizarLivros() {
    // Renderizar no grid antigo (para compatibilidade)
    const grid = document.getElementById('livros-grid');
    if (grid) {
        if (livrosFiltrados.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔍</div>
                    <h3>Nenhum livro encontrado</h3>
                    <p>Tente ajustar seus filtros ou termo de busca.</p>
                </div>
            `;
        } else {
            grid.innerHTML = livrosFiltrados.map(livro => criarCardLivro(livro)).join('');
        }
    }
    
    // Renderizar no conteúdo dos accordions
    const categorias = ['todas', 'pregacoes', 'intensivos', 'cursos', 'infantil', 'casais'];
    
    categorias.forEach(cat => {
        const conteudoDiv = document.getElementById(`conteudo-${cat}`);
        if (!conteudoDiv) return;
        
        // Filtrar livros por categoria
        let livrosCategoria = cat === 'todas' 
            ? [...todosLivros] 
            : todosLivros.filter(l => l.categoria === cat);
        
        // Aplicar busca se houver
        const termoBusca = document.getElementById('busca-livros')?.value.toLowerCase() || '';
        if (termoBusca && cat === categoriaAtual) {
            livrosCategoria = livrosCategoria.filter(livro => {
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
        switch(ordenacaoAtual) {
            case 'recente':
                livrosCategoria.sort((a, b) => new Date(b.dataCadastro) - new Date(a.dataCadastro));
                break;
            case 'antigo':
                livrosCategoria.sort((a, b) => new Date(a.dataCadastro) - new Date(b.dataCadastro));
                break;
            case 'titulo':
                livrosCategoria.sort((a, b) => a.titulo.localeCompare(b.titulo));
                break;
            case 'autor':
                livrosCategoria.sort((a, b) => a.autor.localeCompare(b.autor));
                break;
            case 'popular':
                livrosCategoria.sort((a, b) => (b.visualizacoes || 0) - (a.visualizacoes || 0));
                break;
        }
        
        // Renderizar apenas se for a categoria atual
        if (cat === categoriaAtual) {
            if (livrosCategoria.length === 0) {
                conteudoDiv.innerHTML = `
                    <div class="empty-state" style="padding: 2rem 1rem;">
                        <div class="empty-icon">🔍</div>
                        <h3>Nenhum conteúdo encontrado</h3>
                        <p>Tente ajustar seus filtros ou termo de busca.</p>
                    </div>
                `;
            } else {
                conteudoDiv.innerHTML = `
                    <div class="livros-grid">
                        ${livrosCategoria.map(livro => criarCardLivro(livro)).join('')}
                    </div>
                `;
            }
        } else {
            conteudoDiv.innerHTML = ''; // Limpar conteúdo de categorias não ativas
        }
    });
    
    // Adicionar event listeners nos cards
    document.querySelectorAll('.btn-ler-online').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            abrirLivro(id);
        });
    });
    
    document.querySelectorAll('.btn-download-livro').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            registrarDownload(id);
        });
    });
    
    document.querySelectorAll('.btn-favoritar-card').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            toggleFavorito(id);
        });
    });
}

function criarCardLivro(livro) {
    const categoria = getCategoriaInfo(livro.categoria);
    const isFavorito = favoritos.includes(livro.id);
    const isNovo = isLivroNovo(livro.dataCadastro);
    const isPopular = (livro.visualizacoes || 0) >= 50;
    
    return `
        <div class="livro-card">
            ${isNovo ? '<span class="badge badge-new">NOVO</span>' : ''}
            ${isPopular ? '<span class="badge badge-popular">POPULAR</span>' : ''}
            
            <div class="livro-capa">
                ${livro.linkCapa 
                    ? `<img src="${livro.linkCapa}" alt="Capa de ${livro.titulo}" loading="lazy">`
                    : `<div class="capa-placeholder">${categoria.icon}</div>`
                }
            </div>
            
            <div class="livro-info">
                <div class="livro-categoria">${categoria.icon} ${categoria.name}</div>
                <h3 class="livro-titulo">${livro.titulo}</h3>
                <p class="livro-autor">✍️ ${livro.autor}</p>
                
                <div class="livro-meta">
                    ${livro.numeroPaginas ? `<span>📄 ${livro.numeroPaginas} páginas</span>` : ''}
                    <span>👁️ ${livro.visualizacoes || 0} leituras</span>
                    <span>📥 ${livro.downloads || 0} downloads</span>
                </div>
                
                ${livro.tags && livro.tags.length > 0 ? `
                    <div class="livro-tags">
                        ${livro.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                
                <p class="livro-descricao">${truncarTexto(livro.descricao || 'Descrição não disponível', 120)}</p>
                
                <div class="livro-actions">
                    <button class="btn btn-primary btn-ler-online" data-id="${livro.id}">
                        📖 Ler Online
                    </button>
                    <a href="${livro.linkPdf}" 
                       target="_blank" 
                       class="btn btn-outline btn-download-livro" 
                       data-id="${livro.id}">
                        📥 Download
                    </a>
                    <button class="btn-icon btn-favoritar-card ${isFavorito ? 'favorito' : ''}" 
                            data-id="${livro.id}"
                            title="${isFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
                        ${isFavorito ? '⭐' : '☆'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ========================================
// MODAL DE VISUALIZAÇÃO
// ========================================

function abrirLivro(id) {
    const livro = todosLivros.find(l => l.id === id);
    if (!livro) return;
    
    // Atualizar contador de visualizações
    incrementarVisualizacoes(id);
    
    // Adicionar ao histórico
    adicionarAoHistorico(id);
    
    // Configurar modal
    const modal = document.getElementById('pdf-modal');
    const frame = document.getElementById('pdf-frame');
    const titulo = document.getElementById('pdf-titulo');
    const btnDownload = document.getElementById('btn-download-pdf');
    const btnFavoritar = document.getElementById('btn-favoritar');
    
    if (modal && frame && titulo) {
        titulo.textContent = livro.titulo;
        
        // Configurar iframe
        if (livro.linkPdf) {
            frame.src = livro.linkPdf;
        } else {
            frame.srcdoc = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; font-family: Arial; color: #666;">
                    <div style="text-align: center;">
                        <h2>📄 PDF não disponível</h2>
                        <p>O link para este PDF ainda não foi configurado.</p>
                    </div>
                </div>
            `;
        }
        
        // Configurar botão de download
        if (btnDownload) {
            btnDownload.href = livro.linkPdf || '#';
            btnDownload.onclick = () => registrarDownload(id);
        }
        
        // Configurar botão de favoritar
        if (btnFavoritar) {
            const isFavorito = favoritos.includes(id);
            btnFavoritar.textContent = isFavorito ? '⭐ Favoritado' : '☆ Favoritar';
            btnFavoritar.onclick = () => {
                toggleFavorito(id);
                btnFavoritar.textContent = favoritos.includes(id) ? '⭐ Favoritado' : '☆ Favoritar';
            };
        }
        
        // Mostrar modal
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

// ========================================
// CONTADORES E ESTATÍSTICAS
// ========================================

function incrementarVisualizacoes(id) {
    const livro = todosLivros.find(l => l.id === id);
    if (livro) {
        livro.visualizacoes = (livro.visualizacoes || 0) + 1;
        salvarLivros();
        atualizarEstatisticas();
    }
}

function registrarDownload(id) {
    const livro = todosLivros.find(l => l.id === id);
    if (livro) {
        livro.downloads = (livro.downloads || 0) + 1;
        salvarLivros();
        atualizarEstatisticas();
    }
}

function salvarLivros() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todosLivros));
    } catch (error) {
        console.error('❌ Erro ao salvar livros:', error);
    }
}

function atualizarEstatisticas() {
    // Total de livros
    const totalLivros = document.getElementById('total-livros');
    if (totalLivros) {
        totalLivros.textContent = todosLivros.length;
    }
    
    // Total de autores únicos
    const autoresUnicos = new Set(todosLivros.map(l => l.autor)).size;
    const totalAutores = document.getElementById('total-autores');
    if (totalAutores) {
        totalAutores.textContent = autoresUnicos;
    }
    
    // Total de downloads
    const downloads = todosLivros.reduce((sum, l) => sum + (l.downloads || 0), 0);
    const totalDownloads = document.getElementById('total-downloads');
    if (totalDownloads) {
        totalDownloads.textContent = downloads;
    }
}

// ========================================
// FAVORITOS
// ========================================

function toggleFavorito(id) {
    const index = favoritos.indexOf(id);
    
    if (index > -1) {
        favoritos.splice(index, 1);
    } else {
        favoritos.push(id);
    }
    
    salvarFavoritos();
    renderizarFavoritos();
    renderizarLivros(); // Atualizar ícones nos cards
}

function salvarFavoritos() {
    try {
        localStorage.setItem(FAVORITOS_KEY, JSON.stringify(favoritos));
    } catch (error) {
        console.error('❌ Erro ao salvar favoritos:', error);
    }
}

function renderizarFavoritos() {
    const container = document.getElementById('favoritos-livros');
    const section = document.getElementById('favoritos-section');
    
    if (!container || !section) return;
    
    if (favoritos.length === 0) {
        section.style.display = 'none';
        return;
    }
    
    section.style.display = 'block';
    
    const livrosFavoritos = todosLivros.filter(l => favoritos.includes(l.id));
    container.innerHTML = livrosFavoritos.map(l => criarCardLivroPequeno(l)).join('');
}

// ========================================
// HISTÓRICO
// ========================================

function adicionarAoHistorico(id) {
    // Remove se já existe
    const index = historico.indexOf(id);
    if (index > -1) {
        historico.splice(index, 1);
    }
    
    // Adiciona no início
    historico.unshift(id);
    
    // Mantém apenas os últimos 5
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

function renderizarHistorico() {
    const container = document.getElementById('historico-livros');
    const section = document.getElementById('historico-section');
    
    if (!container || !section) return;
    
    if (historico.length === 0) {
        section.style.display = 'none';
        return;
    }
    
    section.style.display = 'block';
    
    const livrosHistorico = historico
        .map(id => todosLivros.find(l => l.id === id))
        .filter(l => l !== undefined);
    
    container.innerHTML = livrosHistorico.map(l => criarCardLivroPequeno(l)).join('');
}

function criarCardLivroPequeno(livro) {
    const categoria = getCategoriaInfo(livro.categoria);
    
    return `
        <div class="livro-card-small" onclick="abrirLivro('${livro.id}')">
            <div class="livro-capa-small">
                ${livro.linkCapa 
                    ? `<img src="${livro.linkCapa}" alt="${livro.titulo}">`
                    : `<div class="capa-placeholder-small">${categoria.icon}</div>`
                }
            </div>
            <div class="livro-info-small">
                <h4>${truncarTexto(livro.titulo, 40)}</h4>
                <p>${livro.autor}</p>
            </div>
        </div>
    `;
}

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

function getCategoriaInfo(categoria) {
    const categorias = {
        'pregacoes': { name: 'Pregações', icon: '📖' },
        'intensivos': { name: 'Intensivos/Seminários', icon: '📚' },
        'cursos': { name: 'Estudos Bíblicos', icon: '📄' },
        'infantil': { name: 'Material Infantil', icon: '👶' },
        'casais': { name: 'Casais', icon: '💑' }
    };
    return categorias[categoria] || { name: 'Geral', icon: '📚' };
}

function truncarTexto(texto, maxLength) {
    if (!texto) return '';
    if (texto.length <= maxLength) return texto;
    return texto.substring(0, maxLength) + '...';
}

function isLivroNovo(dataCadastro) {
    if (!dataCadastro) return false;
    const data = new Date(dataCadastro);
    const hoje = new Date();
    const diffDias = Math.floor((hoje - data) / (1000 * 60 * 60 * 24));
    return diffDias <= 30;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

console.log('✅ biblioteca.js carregado com sucesso');

