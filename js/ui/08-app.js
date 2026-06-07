// js/ui/08-app.js
// ============================================
// APP PRINCIPAL - Inicialización de todo el sistema
// ============================================

console.log('🚀 Iniciando Tablero Mundial');

document.addEventListener('DOMContentLoaded', () => {
    
    // Inicializar componentes
    if (typeof UIPanelInfo !== 'undefined') UIPanelInfo.init();
    if (typeof UIVerificador !== 'undefined') UIVerificador.init();
    if (typeof UISimulador !== 'undefined') UISimulador.init();
    if (typeof Idioma !== 'undefined') Idioma.init();
    
    // Botones de la barra superior
    const btnReadme = document.getElementById('btn-readme');
    const btnNormas = document.getElementById('btn-normas');
    const btnVerificador = document.getElementById('btn-verificador-panel');
    const btnRelaciones = document.getElementById('btn-relaciones-globales');
    const btnTimeline = document.getElementById('btn-timeline-panel');
    const btnModoReal = document.getElementById('btn-modo-real');
    const btnModoJuego = document.getElementById('btn-modo-juego');
    const badgeModo = document.getElementById('modo-badge');
    const verificadorPanel = document.getElementById('verificador-panel');
    const relacionesPanel = document.getElementById('relaciones-globales-panel');
    const timelinePanel = document.getElementById('timeline-panel');
    
    // README
    if (btnReadme) {
        btnReadme.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarModal('README - Tablero Mundial', `
                <h1>🌍 TABLERO MUNDIAL</h1>
                <p>Plataforma interactiva de análisis geopolítico, económico y estratégico.</p>
                <h2>📊 Características</h2>
                <ul><li>Mapa mundial interactivo</li><li>Datos económicos reales del Banco Mundial</li><li>Verificador ciudadano</li><li>Simulador de escenarios</li></ul>
                <h2>📚 Fuentes</h2><p>Banco Mundial · FMI · Eurostat · ONU</p>
                <p><small>Versión 4.1 - Mayo 2026</small></p>
            `);
        });
    }
    
    // NORMAS
    if (btnNormas) {
        btnNormas.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarModal('📋 NORMAS DEL TABLERO', `
                <h2>📜 Principios fundamentales</h2>
                <ul><li><strong>Separación realidad/simulación</strong></li><li><strong>Transparencia</strong></li><li><strong>Neutralidad</strong></li></ul>
                <h2>🎮 Modos de uso</h2>
                <ul><li><strong>MODO REAL</strong>: Observación y análisis de datos reales</li><li><strong>MODO JUEGO</strong>: Simulación de escenarios hipotéticos</li></ul>
            `);
        });
    }
    
    // Verificador
    if (btnVerificador && verificadorPanel) {
        btnVerificador.addEventListener('click', () => {
            verificadorPanel.classList.toggle('active');
        });
    }
    
    // Relaciones Globales
    if (btnRelaciones && relacionesPanel) {
        btnRelaciones.addEventListener('click', () => {
            relacionesPanel.classList.toggle('active');
        });
    }
    
    // Timeline
    if (btnTimeline && timelinePanel) {
        btnTimeline.addEventListener('click', () => {
            timelinePanel.classList.toggle('active');
        });
    }
    
    // Modo Real / Juego
    if (btnModoReal && btnModoJuego && badgeModo) {
        btnModoReal.addEventListener('click', () => {
            if (typeof CONFIG !== 'undefined') CONFIG.modo = 'realidad';
            btnModoReal.classList.add('active');
            btnModoJuego.classList.remove('active');
            badgeModo.innerHTML = '🌐 MODO REAL';
            badgeModo.style.background = '#2e7d32';
        });
        
        btnModoJuego.addEventListener('click', () => {
            if (typeof CONFIG !== 'undefined') CONFIG.modo = 'juego';
            btnModoJuego.classList.add('active');
            btnModoReal.classList.remove('active');
            badgeModo.innerHTML = '🎮 MODO JUEGO';
            badgeModo.style.background = '#b27c2c';
        });
    }
    
    // ============================================
    // BUSCADOR RÁPIDO (mejorado)
    // ============================================
    const buscador = document.getElementById('buscador-rapido');
    if (buscador) {
        buscador.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const texto = e.target.value.trim();
                if (texto) {
                    console.log(`🔍 Buscando: "${texto}"`);
                    // Usar búsqueda avanzada si existe, o la del mapa
                    if (typeof window.buscarLugarGlobal === 'function') {
                        window.buscarLugarGlobal(texto);
                    } else if (window.MapaMundial && typeof window.MapaMundial.buscarLugar === 'function') {
                        window.MapaMundial.buscarLugar(texto);
                    }
                }
            }
        });
        console.log("✅ Buscador rápido configurado");
    }
    
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
                capaBotones.forEach(b => b.classList.remove('activo'));
                this.classList.add('activo');
            } else {
                this.classList.remove('activo');
            }
            
            console.log(`🎨 Capa seleccionada: ${capa}, Activo: ${!estaActivo}`);
            
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
        setTimeout(() => {
            capaEconomicaBtn.click();
        }, 500);
    } else {
        console.warn("⚠️ No se encontró el botón de capa económica");
    }
    
    // Mostrar España al inicio
    window.addEventListener('mapa-listos', () => {
        setTimeout(() => {
            if (typeof DashboardReal !== 'undefined') {
                DashboardReal.mostrar('ESP');
            }
        }, 500);
    });
    
    console.log('✅ Tablero Mundial listo');
});

// Función para mostrar modales
function mostrarModal(titulo, contenido) {
    let modal = document.getElementById('modal-global');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-global';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.85); display: flex; justify-content: center;
            align-items: center; z-index: 20000;
        `;
        document.body.appendChild(modal);
    }
    modal.innerHTML = `
        <div style="background: #1a2a30; width: 90%; max-width: 600px; max-height: 80vh;
                    border-radius: 20px; padding: 20px; overflow-y: auto; border: 1px solid #4fc3f7;">
            <button id="modal-cerrar" style="position: absolute; top: 10px; right: 20px;
                    font-size: 24px; background: none; border: none; color: #9aaec2; cursor: pointer;">✕</button>
            <div style="color: #ecf0f3;">${contenido}</div>
        </div>
    `;
    modal.style.display = 'flex';
    const btnCerrar = document.getElementById('modal-cerrar');
    if (btnCerrar) btnCerrar.onclick = () => modal.style.display = 'none';
    modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
}
