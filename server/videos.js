// [LINHA 1] Configuração Estática (Substitui o Banco de Dados)
const VIDEO_DATA = {
    destaque: 'R0xc84FhXeE', // ID do vídeo principal (Vigília)
    recentes: [
        { id: 'VIDEO_ID_1', titulo: 'Culto de Domingo - 26/01' },
        { id: 'VIDEO_ID_2', titulo: 'Estudo Bíblico - Romanos' }
    ],
    cultos: [
        'VIDEO_ID_3', 'VIDEO_ID_4', 'VIDEO_ID_5'
    ]
};

// Carregamento do YouTube API
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let featuredPlayer;

// [LINHA 2] Função oficial do YouTube (Callback)
function onYouTubeIframeAPIReady() {
    featuredPlayer = new YT.Player('featured-player', {
        videoId: VIDEO_DATA.destaque, // Usa a const definida acima
        playerVars: {
            'playsinline': 1,
            'modestbranding': 1,
            'rel': 0
        },
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

// [LINHA 3] Renderização Manual (Já que não temos Backend)
document.addEventListener('DOMContentLoaded', () => {
    const gridRecentes = document.getElementById('recent-videos-grid');
    if (gridRecentes) {
        VIDEO_DATA.recentes.forEach(video => {
            // Cria o HTML do card de vídeo dinamicamente
            const card = `
                <div class="video-card" onclick="playVideo('${video.id}')">
                    <img src="https://img.youtube.com/vi/${video.id}/mqdefault.jpg" alt="${video.titulo}">
                    <div class="video-info">
                        <h4>${video.titulo}</h4>
                    </div>
                </div>
            `;
            gridRecentes.innerHTML += card;
        });
    }
});

function onPlayerStateChange(event) {
    // Lógica opcional de analytics
}