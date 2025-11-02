export default async function getDashboardContent() {
    const stats = await fetchDashboardStats();
    
    return `
        <div class="dashboard">
            <div class="header-top">
                <div class="header-title">
                    <h1>📊 Dashboard</h1>
                    <p>Bem-vindo ao painel administrativo</p>
                </div>
                <div class="header-actions">
                    <button class="btn btn-primary" onclick="window.location.href='#/informativos'">
                        <i class="fas fa-plus"></i> Novo Informativo
                    </button>
                </div>
            </div>

            <div class="grid grid-4">
                <div class="stats-card">
                    <div class="stats-icon">📢</div>
                    <div class="stats-number">${stats.informativos.total}</div>
                    <div class="stats-label">Informativos Ativos</div>
                </div>
                
                <div class="stats-card">
                    <div class="stats-icon">🖼️</div>
                    <div class="stats-number">${stats.banners.total}</div>
                    <div class="stats-label">Banners Publicados</div>
                </div>
                
                <div class="stats-card">
                    <div class="stats-icon">📺</div>
                    <div class="stats-number">${stats.videos.total}</div>
                    <div class="stats-label">Vídeos no Site</div>
                </div>
                
                <div class="stats-card">
                    <div class="stats-icon">📁</div>
                    <div class="stats-number">${stats.files.total}</div>
                    <div class="stats-label">Arquivos na Galeria</div>
                </div>
            </div>

            <div class="grid grid-2 mt-2">
                <div class="card">
                    <h2>📋 Atividade Recente</h2>
                    <div class="activity-list">
                        ${stats.recentActivity.map(activity => `
                            <div class="activity-card">
                                <div class="activity-icon">${activity.icon}</div>
                                <div class="activity-details">
                                    <div class="activity-title">${activity.title}</div>
                                    <div class="activity-time">${formatDate(activity.time)}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="card">
                    <h2>📊 Status do Sistema</h2>
                    <div class="status-list">
                        <div class="status-card status-success">
                            <i class="fas fa-check-circle"></i>
                            <span>Sistema funcionando normalmente</span>
                        </div>
                        <div class="status-card ${stats.backup.status === 'ok' ? 'status-success' : 'status-warning'}">
                            <i class="fas fa-backup"></i>
                            <span>Último backup: ${formatDate(stats.backup.lastBackup)}</span>
                        </div>
                        <div class="status-card status-success">
                            <i class="fas fa-server"></i>
                            <span>Servidor respondendo normalmente</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function fetchDashboardStats() {
    // Em produção, isso seria uma chamada API
    return {
        informativos: {
            total: localStorage.getItem('igreja_informativos') ? 
                JSON.parse(localStorage.getItem('igreja_informativos')).length : 0
        },
        banners: {
            total: localStorage.getItem('igreja_banners') ? 
                JSON.parse(localStorage.getItem('igreja_banners')).length : 0
        },
        videos: {
            total: localStorage.getItem('igreja_videos') ? 
                JSON.parse(localStorage.getItem('igreja_videos')).length : 0
        },
        files: {
            total: localStorage.getItem('igreja_files') ? 
                JSON.parse(localStorage.getItem('igreja_files')).length : 0
        },
        recentActivity: [
            {
                icon: '📢',
                title: 'Novo informativo criado',
                time: new Date(Date.now() - 1000 * 60 * 30) // 30 minutos atrás
            },
            {
                icon: '🖼️',
                title: 'Banner atualizado',
                time: new Date(Date.now() - 1000 * 60 * 60) // 1 hora atrás
            },
            {
                icon: '📁',
                title: 'Arquivo adicionado à galeria',
                time: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 horas atrás
            }
        ],
        backup: {
            status: 'ok',
            lastBackup: new Date(Date.now() - 1000 * 60 * 60 * 12) // 12 horas atrás
        }
    };
}

function formatDate(date) {
    return new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' }).format(
        Math.round((date - new Date()) / (1000 * 60)), 
        'minute'
    );
}