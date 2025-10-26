// ========================================
// SISTEMA DE EVENTOS - IGREJA DE CRISTO
// ========================================

// Configuração do localStorage
const STORAGE_KEY = 'igreja_informativos';

// Estado global
let currentView = 'lista';
let currentFilter = 'todos';
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let allEvents = [];

// ========================================
// INICIALIZAÇÃO
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Sistema de Eventos Iniciado');
    
    // Carregar eventos do localStorage
    loadEvents();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Renderizar view inicial
    renderListView();
    
    // Gerar calendário
    generateCalendar(currentMonth, currentYear);
});

// ========================================
// CARREGAR EVENTOS
// ========================================

function loadEvents() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const allData = JSON.parse(stored);
            // Filtrar apenas eventos ativos
            allEvents = allData.filter(item => item.status === 'ativo');
            console.log(`✅ ${allEvents.length} eventos carregados`);
        } else {
            allEvents = [];
            console.log('📭 Nenhum evento no sistema');
        }
    } catch (error) {
        console.error('❌ Erro ao carregar eventos:', error);
        allEvents = [];
    }
}

// ========================================
// SETUP DE EVENT LISTENERS
// ========================================

function setupEventListeners() {
    // Filtros de categoria
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            renderListView();
        });
    });
    
    // Tabs de visualização
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.dataset.view;
            switchView(view);
        });
    });
    
    // Botão de arquivo
    const toggleArquivo = document.getElementById('toggle-arquivo');
    if (toggleArquivo) {
        toggleArquivo.addEventListener('click', function() {
            const arquivo = document.getElementById('eventos-arquivo');
            if (arquivo.style.display === 'none') {
                arquivo.style.display = 'grid';
                this.textContent = '🔼 Ocultar Eventos Anteriores';
                renderArquivo();
            } else {
                arquivo.style.display = 'none';
                this.textContent = '📂 Ver Eventos Anteriores';
            }
        });
    }
    
    // Navegação do calendário
    document.getElementById('prev-month')?.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
    });
    
    document.getElementById('next-month')?.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
    });
}

// ========================================
// TROCAR VISUALIZAÇÃO
// ========================================

function switchView(view) {
    currentView = view;
    
    // Esconder todas as views
    document.querySelectorAll('.events-view').forEach(v => v.classList.remove('active'));
    
    // Mostrar view selecionada
    const selectedView = document.getElementById(`view-${view}`);
    if (selectedView) {
        selectedView.classList.add('active');
    }
    
    // Executar função específica da view
    switch(view) {
        case 'lista':
            renderListView();
            break;
        case 'calendario':
            generateCalendar(currentMonth, currentYear);
            break;
        case 'mapa':
            renderMapView();
            break;
    }
}

// ========================================
// RENDERIZAR LISTA DE EVENTOS
// ========================================

function renderListView() {
    const container = document.getElementById('eventos-lista');
    if (!container) return;
    
    // Filtrar eventos
    let filtered = filterEvents(allEvents, currentFilter);
    
    // Separar futuros e hoje
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const upcoming = filtered.filter(evt => {
        const evtDate = parseEventDate(evt);
        return evtDate >= now;
    }).sort((a, b) => parseEventDate(a) - parseEventDate(b));
    
    // Renderizar
    if (upcoming.length === 0) {
        container.innerHTML = `
            <div class="no-events">
                <p>📭 Nenhum evento encontrado nesta categoria.</p>
                <p>Em breve teremos novidades!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = upcoming.map(evt => createEventCard(evt)).join('');
}

// ========================================
// RENDERIZAR ARQUIVO
// ========================================

function renderArquivo() {
    const container = document.getElementById('eventos-arquivo');
    if (!container) return;
    
    // Eventos passados
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const past = allEvents.filter(evt => {
        const evtDate = parseEventDate(evt);
        return evtDate < now;
    }).sort((a, b) => parseEventDate(b) - parseEventDate(a)); // Mais recentes primeiro
    
    if (past.length === 0) {
        container.innerHTML = `
            <div class="no-events">
                <p>📭 Nenhum evento encerrado ainda.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = past.map(evt => createEventCard(evt, true)).join('');
}

// ========================================
// CRIAR CARD DE EVENTO
// ========================================

function createEventCard(evt, isPast = false) {
    const categoria = getCategoryInfo(evt.categoria || 'eventos');
    const date = parseEventDate(evt);
    const dateStr = formatDate(date);
    const timeStr = evt.horaEvento || '19:00';
    
    const status = isPast ? '⚪ Encerrado' : (isToday(date) ? '🔴 Hoje' : '🟢 Próximo');
    const statusClass = isPast ? 'past' : (isToday(date) ? 'today' : 'upcoming');
    
    return `
        <div class="event-card ${statusClass}">
            <div class="event-header">
                <span class="event-category">${categoria.icon} ${categoria.name}</span>
                <span class="event-status ${statusClass}">${status}</span>
            </div>
            
            <h3 class="event-title">${evt.titulo}</h3>
            
            <div class="event-info">
                <div class="info-item">
                    <span class="info-icon">🗓️</span>
                    <span>${dateStr}</span>
                </div>
                <div class="info-item">
                    <span class="info-icon">⏰</span>
                    <span>${timeStr}</span>
                </div>
                ${evt.local ? `
                <div class="info-item">
                    <span class="info-icon">📍</span>
                    <span>${evt.local.nome || evt.local.endereco || evt.local}</span>
                </div>
                ` : ''}
            </div>
            
            <p class="event-description">${evt.descricao || 'Participe deste evento especial!'}</p>
            
            <div class="event-actions">
                ${evt.local && evt.local.endereco ? `
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(evt.local.endereco)}" 
                   target="_blank" class="btn btn-outline btn-sm">
                    📍 Ver no Mapa
                </a>
                ` : ''}
                ${evt.whatsapp || !isPast ? `
                <a href="${evt.whatsapp || 'https://wa.me/5592991146877?text=Gostaria%20de%20informações%20sobre:%20' + encodeURIComponent(evt.titulo)}" 
                   target="_blank" class="btn btn-primary btn-sm">
                    💬 WhatsApp
                </a>
                ` : ''}
            </div>
        </div>
    `;
}

// ========================================
// GERAR CALENDÁRIO
// ========================================

function generateCalendar(month, year) {
    const calendar = document.getElementById('calendar');
    if (!calendar) return;
    
    // Atualizar título
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                       'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    document.getElementById('current-month-year').textContent = `${monthNames[month]} ${year}`;
    
    // Primeira e última data do mês
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Dia da semana do primeiro dia (0 = Domingo)
    const firstDayWeek = firstDay.getDay();
    
    // Dias do mês
    const daysInMonth = lastDay.getDate();
    
    // Construir calendário
    let html = '<div class="calendar-weekdays">';
    ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].forEach(day => {
        html += `<div class="weekday">${day}</div>`;
    });
    html += '</div><div class="calendar-days">';
    
    // Células vazias antes do primeiro dia
    for (let i = 0; i < firstDayWeek; i++) {
        html += '<div class="calendar-day empty"></div>';
    }
    
    // Dias do mês
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = formatDateISO(date);
        
        // Verificar se tem eventos neste dia
        const dayEvents = allEvents.filter(evt => {
            const evtDate = parseEventDate(evt);
            return evtDate.toDateString() === date.toDateString();
        });
        
        let classes = 'calendar-day';
        if (date.toDateString() === today.toDateString()) {
            classes += ' today';
        }
        if (date < today) {
            classes += ' past';
        }
        if (dayEvents.length > 0) {
            classes += ' has-events';
        }
        
        html += `
            <div class="${classes}" data-date="${dateStr}" data-count="${dayEvents.length}">
                <span class="day-number">${day}</span>
                ${dayEvents.length > 0 ? `<span class="event-count">${dayEvents.length}</span>` : ''}
            </div>
        `;
    }
    
    html += '</div>';
    calendar.innerHTML = html;
    
    // Adicionar event listeners nos dias
    document.querySelectorAll('.calendar-day:not(.empty)').forEach(day => {
        day.addEventListener('click', function() {
            const date = this.dataset.date;
            showEventsForDate(date);
            
            // Highlight
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}

// ========================================
// MOSTRAR EVENTOS DE UMA DATA
// ========================================

function showEventsForDate(dateStr) {
    const container = document.getElementById('calendar-events-list');
    if (!container) return;
    
    const date = new Date(dateStr + 'T00:00:00');
    const events = allEvents.filter(evt => {
        const evtDate = parseEventDate(evt);
        return evtDate.toDateString() === date.toDateString();
    });
    
    const dateFormatted = formatDate(date);
    
    if (events.length === 0) {
        container.innerHTML = `
            <h3>📅 ${dateFormatted}</h3>
            <p class="text-muted">Nenhum evento nesta data.</p>
        `;
        return;
    }
    
    container.innerHTML = `
        <h3>📅 ${dateFormatted}</h3>
        <div class="calendar-events-grid">
            ${events.map(evt => createEventCard(evt)).join('')}
        </div>
    `;
}

// ========================================
// RENDERIZAR MAPA
// ========================================

function renderMapView() {
    const mapContainer = document.getElementById('map-container');
    const eventsList = document.getElementById('map-events-list');
    
    if (!mapContainer || !eventsList) return;
    
    // Eventos com localização
    const eventsWithLocation = allEvents.filter(evt => 
        evt.local && (evt.local.endereco || evt.local.lat)
    );
    
    if (eventsWithLocation.length === 0) {
        mapContainer.innerHTML = `
            <div class="map-placeholder">
                <p>🗺️ Nenhum evento com localização definida no momento.</p>
            </div>
        `;
        eventsList.innerHTML = '';
        return;
    }
    
    // Renderizar mapa (usando primeiro local como centro)
    const firstLocation = eventsWithLocation[0].local;
    const centerLat = firstLocation.lat || -3.1318;
    const centerLng = firstLocation.lng || -60.0212;
    
    // Google Maps Embed
    mapContainer.innerHTML = `
        <iframe 
            width="100%" 
            height="450" 
            style="border:0; border-radius: 8px;" 
            loading="lazy" 
            allowfullscreen
            referrerpolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(firstLocation.endereco || 'Igreja de Cristo Centro Manaus')}&zoom=13">
        </iframe>
    `;
    
    // Lista de eventos com mapa
    eventsList.innerHTML = `
        <h3>📍 Eventos por Local</h3>
        <div class="events-grid">
            ${eventsWithLocation.map(evt => createEventCard(evt)).join('')}
        </div>
    `;
}

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

function filterEvents(events, filter) {
    if (filter === 'todos') return events;
    return events.filter(evt => (evt.categoria || 'eventos') === filter);
}

function parseEventDate(evt) {
    // Tenta pegar dataEvento, senão usa data
    const dateStr = evt.dataEvento || evt.data;
    if (!dateStr) return new Date();
    
    // Se já é um objeto Date
    if (dateStr instanceof Date) return dateStr;
    
    // Parse de string (formato: YYYY-MM-DD ou DD/MM/YYYY)
    if (dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/');
        return new Date(year, month - 1, day);
    }
    
    return new Date(dateStr + 'T00:00:00');
}

function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function formatDateISO(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

function getCategoryInfo(category) {
    const categories = {
        'eventos': { name: 'Eventos', icon: '📅' },
        'seminarios': { name: 'Seminários', icon: '🎓' },
        'avisos': { name: 'Avisos', icon: '📢' },
        'igrejas_irmas': { name: 'Igrejas Irmãs', icon: '🏛️' },
        'comemoracoes': { name: 'Comemorações', icon: '🎉' },
        'cultos_especiais': { name: 'Cultos Especiais', icon: '🙏' }
    };
    return categories[category] || categories['eventos'];
}

console.log('✅ eventos.js carregado com sucesso');

