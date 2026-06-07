// js/ui/08-app.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando Tablero Mundial');

    // Inicializar componentes
    if (window.MapaMundial) MapaMundial.init();
    if (window.UIPanelInfo) UIPanelInfo.init();
    if (window.UIVerificador) UIVerificador.init();
    if (window.UISimulador) UISimulador.init();
    if (window.UIRelacionesGlobales && UIRelacionesGlobales.init) UIRelacionesGlobales.init();
    if (window.UITimeline && UITimeline.init) UITimeline.init();
    if (window.DashboardReal) DashboardReal.mostrar('ESP');
    
    // Activar coloreado automático
setTimeout(() => {
    if (window.Coloreado) {
        Coloreado.aplicarColoresPIB();
    }
}, 3000);

    // ============================================
    // PANELES MODALES
    // ============================================
    const paneles = {
        'btn-verificador-panel': 'verificador-panel',
        'btn-relaciones-globales': 'relaciones-globales-panel',
        'btn-timeline-panel': 'timeline-panel'
    };
    for (const [btnId, panelId] of Object.entries(paneles)) {
        const btn = document.getElementById(btnId);
        const panel = document.getElementById(panelId);
        if (btn && panel) {
            btn.addEventListener('click', () => {
                panel.classList.toggle('active');
            });
        }
    }

    // Botones de cierre
    document.querySelectorAll('.btn-cerrar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const panel = e.target.closest('.verificador-container, .simulador-container, .relaciones-globales-container, .timeline-global-container');
            if (panel) panel.classList.remove('active');
        });
    });

    // ============================================
    // MODO REAL / JUEGO
    // ============================================
    const btnReal = document.getElementById('btn-modo-real');
    const btnJuego = document.getElementById('btn-modo-juego');
    const badge = document.getElementById('modo-badge');
    const simuladorPanel = document.getElementById('simulador-panel');

    if (btnReal && btnJuego && badge && simuladorPanel) {
        btnReal.addEventListener('click', () => {
            window.CONFIG.modo = 'realidad';
            btnReal.classList.add('active');
            btnJuego.classList.remove('active');
            badge.textContent = '🌐 MODO REAL';
            simuladorPanel.classList.remove('active');
        });
        
        btnJuego.addEventListener('click', () => {
            window.CONFIG.modo = 'juego';
            btnJuego.classList.add('active');
            btnReal.classList.remove('active');
            badge.textContent = '🎮 MODO JUEGO';
            simuladorPanel.classList.add('active');
        });
    }

    // ============================================
// BUSCADOR RÁPIDO (conectado al dashboard)
// ============================================
const buscador = document.getElementById('buscador-rapido');
if (buscador) {
    buscador.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const texto = this.value.trim();
            if (texto !== "") {
                console.log(`🔍 Buscando: "${texto}"`);
                
                // Si existe la función global de búsqueda avanzada, úsala
                if (typeof window.buscarLugarGlobal === 'function') {
                    window.buscarLugarGlobal(texto);
                } 
                // Si no, usar el método simple del mapa para centrar
                else if (window.MapaMundial && typeof window.MapaMundial.buscarLugar === 'function') {
                    window.MapaMundial.buscarLugar(texto);
                } else {
                    console.warn("⚠️ No hay sistema de búsqueda disponible");
                }
            }
        }
    });
    console.log("✅ Buscador rápido configurado");
} else {
    console.warn("⚠️ No se encontró el elemento 'buscador-rapido'");
}
    
    // ============================================
    // CAPAS (iconos)
    // ============================================
    document.addEventListener('click', (e) => {
        const capaBtn = e.target.closest('.capa-icon');
        if (capaBtn) {
            capaBtn.classList.toggle('activo');
            const capa = capaBtn.dataset.capa;
            const activa = capaBtn.classList.contains('activo');
            if (MapaMundial.activarCapa) {
                MapaMundial.activarCapa(capa, activa);
            }
        }
    });

    // ============================================
    // BOTONES README Y NORMAS (MODALES)
    // ============================================
    const btnReadme = document.getElementById('btn-readme');
    const btnNormas = document.getElementById('btn-normas');
    const modalReadme = document.getElementById('modal-readme');
    const modalNormas = document.getElementById('modal-normas');
    const btnCerrarReadme = document.getElementById('btn-cerrar-readme');
    const btnCerrarNormas = document.getElementById('btn-cerrar-normas');
    const readmeContenido = document.getElementById('readme-contenido');
    const normasContenido = document.getElementById('normas-contenido');

    async function cargarMarkdown(url, destino) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const markdown = await response.text();
            let html = markdown
                .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                .replace(/^\* (.*$)/gim, '<li>$1</li>')
                .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');
            destino.innerHTML = html;
        } catch (error) {
            destino.innerHTML = `<p>❌ Error al cargar: ${error.message}</p>`;
        }
    }

    if (btnReadme && modalReadme && readmeContenido) {
        btnReadme.addEventListener('click', async () => {
            await cargarMarkdown('README.md', readmeContenido);
            modalReadme.style.display = 'flex';
        });
    }

    if (btnNormas && modalNormas && normasContenido) {
        btnNormas.addEventListener('click', async () => {
            await cargarMarkdown('NORMAS.md', normasContenido);
            modalNormas.style.display = 'flex';
        });
    }

    if (btnCerrarReadme && modalReadme) {
        btnCerrarReadme.addEventListener('click', () => {
            modalReadme.style.display = 'none';
        });
    }

    if (btnCerrarNormas && modalNormas) {
        btnCerrarNormas.addEventListener('click', () => {
            modalNormas.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (modalReadme && e.target === modalReadme) modalReadme.style.display = 'none';
        if (modalNormas && e.target === modalNormas) modalNormas.style.display = 'none';
    });

    // ============================================
// ACTIVAR CAPAS DE PODER (botones laterales)
// ============================================
const capaBotones = document.querySelectorAll('.capa-icon');
console.log("🎨 Configurando", capaBotones.length, "botones de capa");

capaBotones.forEach(btn => {
    btn.addEventListener('click', function() {
        const capa = this.dataset.capa;
        const estaActivo = this.classList.contains('activo');
        
        // Resaltar visualmente el botón activo
        if (!estaActivo) {
            // Desactivar todos los demás
            capaBotones.forEach(b => b.classList.remove('activo'));
            this.classList.add('activo');
        } else {
            this.classList.remove('activo');
        }
        
        console.log(`🎨 Capa seleccionada: ${capa}, Activo: ${!estaActivo}`);
        
        // Llamar al mapa para activar la capa
        if (window.MapaMundial && typeof window.MapaMundial.activarCapa === 'function') {
            window.MapaMundial.activarCapa(capa, !estaActivo);
        } else {
            console.warn("⚠️ MapaMundial.activarCapa no está disponible");
        }
    });
});

// Activar la capa económica por defecto
const capaEconomicaBtn = document.querySelector('.capa-icon[data-capa="economico"]');
if (capaEconomicaBtn) {
    capaEconomicaBtn.click(); // Esto activará la capa y el estilo
} else {
    console.warn("⚠️ No se encontró el botón de capa económica");
}
    
    console.log('✅ Tablero Mundial listo');
});
