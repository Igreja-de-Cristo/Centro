// Simple Video Player usando iframe direto do YouTube
class SimpleVideoPlayer {
    constructor() {
        this.videoContainers = {
            modal: document.getElementById('modal-player')
        };
        this.modal = document.getElementById('video-modal');
        this.closeButton = document.getElementById('close-video-modal');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Fechar modal quando clicar no X
        this.closeButton?.addEventListener('click', () => this.closeModal());

        // Fechar modal quando clicar fora do vídeo
        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Fechar modal com tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    createVideoEmbed(videoId, autoplay = false) {
        return `
            <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1"
                title="YouTube video player" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen
            ></iframe>
        `;
    }

    loadVideo(containerId, videoId, autoplay = false) {
        const container = this.videoContainers[containerId];
        if (container) {
            container.innerHTML = this.createVideoEmbed(videoId, autoplay);
        }
    }

    openModal(videoId) {
        this.loadVideo('modal', videoId, true);
        this.modal?.classList.add('active');
    }

    closeModal() {
        this.modal?.classList.remove('active');
        if (this.videoContainers.modal) {
            this.videoContainers.modal.innerHTML = '';
        }
    }

    createThumbnail(videoId, title = '', date = '') {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'video-thumbnail';
        thumbnail.innerHTML = `
            <img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" 
                 alt="${title || 'Vídeo da Igreja de Cristo do Centro'}" 
                 loading="lazy">
            <div class="video-info">
                <h3>${title || 'Vídeo da Igreja de Cristo do Centro'}</h3>
                ${date ? `<div class="video-date">${date}</div>` : ''}
            </div>
            <div class="play-button">▶</div>
        `;
        
        thumbnail.addEventListener('click', () => this.openModal(videoId));
        return thumbnail;
    }

    loadVideosToGrid(gridId, videoIds) {
        const grid = document.getElementById(gridId);
        if (!grid || !videoIds?.length) return;

        grid.innerHTML = '';
        videoIds.forEach(videoId => {
            const thumbnail = this.createThumbnail(videoId);
            grid.appendChild(thumbnail);
        });
    }

    initialize(videoData) {
        // Carregar grids de vídeos
        if (videoData.recent?.length) {
            this.loadVideosToGrid('recent-videos-grid', videoData.recent);
        }
        if (videoData.cultos?.length) {
            this.loadVideosToGrid('cultos-grid', videoData.cultos);
        }
        if (videoData.estudos?.length) {
            this.loadVideosToGrid('estudos-grid', videoData.estudos);
        }
        if (videoData.ebd?.length) {
            this.loadVideosToGrid('ebd-grid', videoData.ebd);
        }
        if (videoData.vigilias?.length) {
            this.loadVideosToGrid('vigilias-grid', videoData.vigilias);
        }
    }
}

// Inicializar o player quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const player = new SimpleVideoPlayer();
    
    // Configurar os IDs dos vídeos
    player.initialize({
        recent: [],              // IDs dos vídeos recentes
        cultos: [],             // IDs dos cultos
        estudos: [],            // IDs dos estudos bíblicos
        ebd: ['B50DcHymhRI'],   // IDs dos vídeos da E.B.D Online
        vigilias: ['R0xc84FhXeE'] // IDs das vigílias
    });
});