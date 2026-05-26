// js/ui/08-app.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando Tablero Mundial');

    // Inicializar módulos
    if (window.MapaMundial) MapaMundial.init();
    if (window.UIPanelInfo) UIPanelInfo.init();
    if (window.UIVerificador) UIVerificador.init();
    if (window.UISimulador) UISimulador.init();

    // ============================================
    // 1. BOTONES DE PANELES (Verificador, Red Global, Timeline, Simulador)
    // ============================================
    const botonesPaneles = {
        'btn-verificador-panel': 'verificador-panel',
        'btn-relaciones-globales': 'relaciones-globales-panel',
        'btn-timeline-panel': 'timeline-panel',
        'btn-modo-juego': 'simulador-panel'
    };

    for (const [idBoton, idPanel] of Object.entries(botonesPaneles)) {
        const boton = document.getElementById(idBoton);
        const panel = document.getElementById(idPanel);
        if (boton && panel) {
            boton.addEventListener('click', () => {
                panel.classList.toggle('active');
                console.log(`Toggle panel: ${idPanel} -> active: ${panel.classList.contains('active')}`);
            });
        } else {
            console.warn(`No se encontró el botón ${idBoton} o el panel ${idPanel}`);
        }
    }

    // Botones de cierre dentro de los paneles (clase .btn-cerrar)
    document.querySelectorAll('.btn-cerrar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const panel = e.target.closest('.verificador-container, .simulador-container, .relaciones-globales-container, .timeline-global-container');
            if (panel) {
                panel.classList.remove('active');
                console.log(`Cerrar panel: ${panel.id}`);
            }
        });
    });

    // ============================================
    // 2. BOTONES DE MODO REAL / JUEGO
    // ============================================
    const btnReal = document.getElementById('btn-modo-real');
    const btnJuego = document.getElementById('btn-modo-juego');
    const badge = document.getElementById('modo-badge');
    if (btnReal && btnJuego && badge) {
        btnReal.addEventListener('click', () => {
            window.CONFIG.modo = 'realidad';
            btnReal.classList.add('active');
            btnJuego.classList.remove('active');
            badge.textContent = '🌐 MODO REAL';
            console.log('Modo REAL activado');
        });
        btnJuego.addEventListener('click', () => {
            window.CONFIG.modo = 'juego';
            btnJuego.classList.add('active');
            btnReal.classList.remove('active');
            badge.textContent = '🎮 MODO JUEGO';
            console.log('Modo JUEGO activado');
        });
    } else {
        console.warn('Botones de modo no encontrados');
    }

    // ============================================
    // 3. BUSCADOR RÁPIDO
    // ============================================
    const buscador = document.getElementById('buscador-rapido');
    if (buscador && MapaMundial.buscarLugar) {
        buscador.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                MapaMundial.buscarLugar(buscador.value.trim());
            }
        });
    }

    // ============================================
    // 4. CAPAS (iconos)
    // ============================================
    document.addEventListener('click', (e) => {
        const capaBtn = e.target.closest('.capa-icon');
        if (capaBtn) {
            capaBtn.classList.toggle('activo');
            const capa = capaBtn.dataset.capa;
            const activa = capaBtn.classList.contains('activo');
            if (MapaMundial.activarCapa) {
                MapaMundial.activarCapa(capa, activa);
                console.log(`Capa ${capa} activada: ${activa}`);
            }
        }
    });
    // ============================================
// 5. BOTONES README Y NORMAS (MODALES)
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
        // Conversión básica de markdown a HTML
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
        await cargarMarkdown('Readme.md', readmeContenido);
        modalReadme.style.display = 'flex';
        console.log('📘 README abierto');
    });
}

if (btnNormas && modalNormas && normasContenido) {
    btnNormas.addEventListener('click', async () => {
        await cargarMarkdown('Normas.md', normasContenido);
        modalNormas.style.display = 'flex';
        console.log('📋 NORMAS abierto');
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

// Cerrar modales haciendo clic fuera del contenido
window.addEventListener('click', (e) => {
    if (modalReadme && e.target === modalReadme) modalReadme.style.display = 'none';
    if (modalNormas && e.target === modalNormas) modalNormas.style.display = 'none';
});
    // Mostrar España por defecto
    if (window.UIPanelInfo) UIPanelInfo.mostrarPais('espana');

    console.log('✅ Tablero Mundial listo');
});
