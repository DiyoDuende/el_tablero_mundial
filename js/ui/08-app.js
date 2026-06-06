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
    // BUSCADOR RÁPIDO
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
    
    console.log('✅ Tablero Mundial listo');
});

// ============================================
// VERIFICADOR MEJORADO CON FUENTES
// ============================================

function explicarConFuentes(indicador, preguntaUsuario) {
    var respuesta = "🔍 **Análisis verificado**\n\n";
    respuesta += Fuentes.explicarOrigen(indicador);
    respuesta += "\n\n📈 Valor: " + indicador.valor.toLocaleString() + " " + indicador.unidad;
    
    if (Fuentes.esFiable(indicador, "alta")) {
        respuesta += "\n\n✅ Este dato es considerado **fiable** para análisis y simulaciones.";
    } else {
        respuesta += "\n\n⚠️ **Precaución**: Este dato tiene fiabilidad " + indicador.fuente.fiabilidad + ". Considera contrastarlo con otras fuentes.";
    }
    
    return respuesta;
}

// Ejemplo de uso en el verificador existente
// Busca donde se muestra la respuesta del verificador y añade:
// var explicacion = explicarConFuentes(indicador, pregunta);
