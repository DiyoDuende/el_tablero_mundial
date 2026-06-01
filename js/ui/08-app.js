// js/ui/08-app.js
// ============================================
// APP PRINCIPAL - Inicialización de todo el sistema
// ============================================

console.log('🚀 Iniciando Tablero Mundial (app principal)');

document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM cargado, inicializando componentes...');
    
    // ========================================
    // 1. Inicializar componentes de forma SEGURA
    // ========================================
    
    if (typeof UIPanelInfo !== 'undefined') {
        try {
            UIPanelInfo.init();
            console.log('✅ UIPanelInfo iniciado');
        } catch(e) {
            console.error('❌ Error en UIPanelInfo.init():', e.message);
        }
    }
    
    if (typeof UIVerificador !== 'undefined') {
        try {
            UIVerificador.init();
            console.log('✅ UIVerificador iniciado');
        } catch(e) {
            console.error('❌ Error en UIVerificador.init():', e.message);
        }
    }
    
    if (typeof UISimulador !== 'undefined') {
        try {
            UISimulador.init();
            console.log('✅ UISimulador iniciado');
        } catch(e) {
            console.error('❌ Error en UISimulador.init():', e.message);
        }
    }
    
    if (typeof Idioma !== 'undefined') {
        try {
            Idioma.init();
            console.log('✅ Idioma iniciado');
        } catch(e) {
            console.error('❌ Error en Idioma.init():', e.message);
        }
    }
    
    // ========================================
    // 2. Configurar botones de modo (REAL / JUEGO)
    // ========================================
    
    const btnModoReal = document.getElementById('btn-modo-real');
    const btnModoJuego = document.getElementById('btn-modo-juego');
    const modoBadge = document.getElementById('modo-badge');
    
    if (btnModoReal && btnModoJuego && modoBadge) {
        btnModoReal.addEventListener('click', () => {
            if (typeof CONFIG !== 'undefined') CONFIG.modo = 'realidad';
            btnModoReal.classList.add('active');
            btnModoJuego.classList.remove('active');
            modoBadge.innerHTML = '🌐 MODO REAL';
            modoBadge.style.background = '#2e7d32';
            console.log('🌐 Modo REAL activado');
        });
        
        btnModoJuego.addEventListener('click', () => {
            if (typeof CONFIG !== 'undefined') CONFIG.modo = 'juego';
            btnModoJuego.classList.add('active');
            btnModoReal.classList.remove('active');
            modoBadge.innerHTML = '🎮 MODO JUEGO';
            modoBadge.style.background = '#b27c2c';
            console.log('🎮 Modo JUEGO activado');
        });
        
        console.log('✅ Botones de modo configurados');
    }
    
    // ========================================
    // 3. Configurar botones de README y NORMAS
    // ========================================
    
    const btnReadme = document.getElementById('btn-readme');
    const btnNormas = document.getElementById('btn-normas');
    const modalReadme = document.getElementById('modal-readme');
    const modalNormas = document.getElementById('modal-normas');
    
    if (btnReadme && modalReadme) {
        btnReadme.addEventListener('click', () => {
            modalReadme.style.display = 'flex';
        });
    }
    
    if (btnNormas && modalNormas) {
        btnNormas.addEventListener('click', () => {
            modalNormas.style.display = 'flex';
        });
    }
    
    // ========================================
    // 4. Cargar contenido de README y NORMAS
    // ========================================
    
    if (typeof marked !== 'undefined') {
        fetch('README.md')
            .then(response => response.text())
            .then(text => {
                const readmeDiv = document.getElementById('readme-contenido');
                if (readmeDiv) readmeDiv.innerHTML = marked.parse(text);
            })
            .catch(err => console.error('Error cargando README:', err));
        
        fetch('NORMAS.md')
            .then(response => response.text())
            .then(text => {
                const normasDiv = document.getElementById('normas-contenido');
                if (normasDiv) normasDiv.innerHTML = marked.parse(text);
            })
            .catch(err => console.error('Error cargando NORMAS:', err));
    }
    
    // ========================================
    // 5. Verificador y otros botones
    // ========================================
    
    const btnVerificador = document.getElementById('btn-verificador-panel');
    const verificadorPanel = document.getElementById('verificador-panel');
    const btnCerrarVerificador = document.getElementById('btn-cerrar-verificador');
    
    if (btnVerificador && verificadorPanel) {
        btnVerificador.addEventListener('click', () => {
            verificadorPanel.style.display = 'block';
        });
    }
    
    if (btnCerrarVerificador && verificadorPanel) {
        btnCerrarVerificador.addEventListener('click', () => {
            verificadorPanel.style.display = 'none';
        });
    }
    
    // ========================================
    // 6. Relaciones Globales
    // ========================================
    
    const btnRelaciones = document.getElementById('btn-relaciones-globales');
    const relacionesPanel = document.getElementById('relaciones-globales-panel');
    const btnCerrarRelaciones = document.getElementById('btn-cerrar-relaciones-globales');
    
    if (btnRelaciones && relacionesPanel) {
        btnRelaciones.addEventListener('click', () => {
            relacionesPanel.style.display = 'block';
        });
    }
    
    if (btnCerrarRelaciones && relacionesPanel) {
        btnCerrarRelaciones.addEventListener('click', () => {
            relacionesPanel.style.display = 'none';
        });
    }
    
    // ========================================
    // 7. Timeline Global
    // ========================================
    
    const btnTimeline = document.getElementById('btn-timeline-panel');
    const timelinePanel = document.getElementById('timeline-panel');
    const btnCerrarTimeline = document.getElementById('btn-cerrar-timeline');
    
    if (btnTimeline && timelinePanel) {
        btnTimeline.addEventListener('click', () => {
            timelinePanel.style.display = 'block';
        });
    }
    
    if (btnCerrarTimeline && timelinePanel) {
        btnCerrarTimeline.addEventListener('click', () => {
            timelinePanel.style.display = 'none';
        });
    }
    
    // ========================================
    // 8. Buscador rápido del panel lateral
    // ========================================
    
    const buscadorRapido = document.getElementById('buscador-rapido');
    if (buscadorRapido) {
        buscadorRapido.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const texto = e.target.value.trim();
                if (texto && window.BuscadorGlobal) {
                    if (typeof BuscadorGlobal.buscar === 'function') {
                        BuscadorGlobal.buscar(texto);
                    }
                }
            }
        });
        console.log('✅ Buscador rápido configurado');
    }
    
    // ========================================
    // 9. Mostrar España por defecto
    // ========================================
    
    window.addEventListener('mapa-listos', () => {
        setTimeout(() => {
            if (typeof DashboardReal !== 'undefined') {
                DashboardReal.mostrar('ESP');
                console.log('🇪🇸 Cargando datos de España');
            }
        }, 500);
    });
    
    // ========================================
    // 10. Activar coloreado automático
    // ========================================
    
    setTimeout(() => {
        if (typeof Coloreado !== 'undefined') {
            Coloreado.aplicarColoresPIB();
        }
    }, 3000);

    // ========================================
    // 11. Conectar botones de capa
    // ========================================
    const btnPIB = document.querySelector('.capa-icon[title="PIB"]') || 
                   document.querySelector('.capa-icon[title="Económico"]');
    const btnInflacion = document.querySelector('.capa-icon[title="Inflación"]');
    const btnDesempleo = document.querySelector('.capa-icon[title="Desempleo"]');
    const btnReset = document.querySelector('.capa-icon[title="Restablecer"]');

    if (btnPIB && typeof Coloreado !== 'undefined') {
        btnPIB.addEventListener('click', () => Coloreado.aplicarColoresPIB());
    }
    if (btnInflacion && typeof Coloreado !== 'undefined') {
        btnInflacion.addEventListener('click', () => Coloreado.aplicarColoresInflacion());
    }
    if (btnDesempleo && typeof Coloreado !== 'undefined') {
        btnDesempleo.addEventListener('click', () => Coloreado.aplicarColoresDesempleo());
    }
    if (btnReset && typeof Coloreado !== 'undefined') {
        btnReset.addEventListener('click', () => Coloreado.resetearColores());
    }
    
    console.log('✅ App principal inicializada correctamente');
});
