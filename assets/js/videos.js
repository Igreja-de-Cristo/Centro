// Configuração do YouTube API
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Configurações e IDs
const CHANNEL_ID = 'UCQK5tZb91OHcOwYmMqHw8bg'; // Igreja de Cristo do Centro - Manaus
const featuredVideoId = 'VIDEO_ID_DESTAQUE'; // Substituir pelo ID do vídeo em destaque
const videoIds = {
    recent: [], // IDs dos vídeos recentes
    cultos: [], // IDs dos cultos
    estudos: [], // IDs dos estudos bíblicos
    vigilias: ['R0xc84FhXeE'] // IDs das vigílias
};

// Players do YouTube
let featuredPlayer;
let modalPlayer;

// Função chamada automaticamente pelo YouTube API
function onYouTubeIframeAPIReady() {
    // Inicializar player principal
    featuredPlayer = new YT.Player('featured-player', {
        videoId: featuredVideoId,
        height: '360',
        width: '640',
        playerVars: {
            'playsinline': 1,
            'rel': 0,
            'modestbranding': 1,
            'origin': window.location.origin,
            'enablejsapi': 1,
            'fs': 1,
            'controls': 1,
            'host': 'https://www.youtube.com',
            'showinfo': 1,
            'autohide': 0
        }
    });
}

// Função para criar thumbnail de vídeo
function createVideoThumbnail(videoId, title = '', date = '') {
    const thumbnail = document.createElement('div');
    thumbnail.className = 'video-thumbnail';
    thumbnail.innerHTML = `
        <img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" alt="${title}">
        <div class="video-info">
            <h3>${title || 'Vídeo da Igreja de Cristo do Centro'}</h3>
            ${date ? `<div class="video-date">${date}</div>` : ''}
        </div>
    `;

    // Adicionar evento de clique para abrir o modal
    thumbnail.addEventListener('click', () => openVideoModal(videoId));

    return thumbnail;
}

// Função para abrir o modal com vídeo
function openVideoModal(videoId) {
    const modal = document.getElementById('video-modal');
    modal.classList.add('active');

    // Criar player no modal se não existir
    if (!modalPlayer) {
        modalPlayer = new YT.Player('modal-player', {
            videoId: videoId,
            height: '480',
            width: '853',
            playerVars: {
                'autoplay': 1,
                'playsinline': 1,
                'rel': 0,
                'modestbranding': 1,
                'origin': window.location.origin,
                'enablejsapi': 1,
                'fs': 1,
                'controls': 1,
                'host': 'https://www.youtube.com',
                'showinfo': 1,
                'autohide': 0
            }
        });
    } else {
        modalPlayer.loadVideoById(videoId);
    }
}

// Função para fechar o modal
function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    modal.classList.remove('active');
    if (modalPlayer) {
        modalPlayer.stopVideo();
    }
}

// Event Listeners
document.getElementById('close-video-modal').addEventListener('click', closeVideoModal);

// Função para carregar vídeos em uma grade
function loadVideosToGrid(gridId, videoIds) {
    const grid = document.getElementById(gridId);
    if (!grid || !videoIds.length) return;

    grid.innerHTML = ''; // Limpar grid existente
    // CORREÇÃO XSS: Usar appendChild ao invés de innerHTML +=
    const cardElement = document.createElement('div');
    cardElement.innerHTML = card;
    gridRecentes.appendChild(cardElement.firstElementChild); // Limpar grid existente
    videoIds.forEach(videoId => {
        const thumbnail = createVideoThumbnail(videoId);
        grid.appendChild(thumbnail);
    });
}

// Inicializar as grades de vídeo
function initializeVideoGrids() {
    // Carregar vídeos recentes
    loadVideosToGrid('recent-videos-grid', videoIds.recent);

    // Carregar cultos
    loadVideosToGrid('cultos-grid', videoIds.cultos);

    // Carregar estudos bíblicos
    loadVideosToGrid('estudos-grid', videoIds.estudos);

    // Carregar vigílias
    loadVideosToGrid('vigilias-grid', videoIds.vigilias);
}

// Quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar as grades de vídeo
    initializeVideoGrids();
});