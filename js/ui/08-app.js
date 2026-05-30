// js/ui/08-app.js
// ============================================
// APP PRINCIPAL - Inicialización segura
// ============================================

console.log('🚀 Iniciando Tablero Mundial (app principal)');

document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM cargado, inicializando componentes...');
    
    // ========================================
    // 1. Inicializar componentes de forma SEGURA
    // ========================================
    
    // UIPanelInfo
    if (typeof UIPanelInfo !== 'undefined') {
        try {
            if (typeof UIPanelInfo.init === 'function') {
                UIPanelInfo.init();
                console.log('✅ UIPanelInfo iniciado');
            } else {
                console.warn('⚠️ UIPanelInfo existe pero init no es función');
            }
        } catch(e) {
            console.error('❌ Error en UIPanelInfo.init():', e.message);
        }
    } else {
        console.log('ℹ️ UIPanelInfo no disponible');
    }
    
    // UIVerificador
    if (typeof UIVerificador !== 'undefined') {
        try {
            if (typeof UIVerificador.init === 'function') {
                UIVerificador.init();
                console.log('✅ UIVerificador iniciado');
            } else {
                console.warn('⚠️ UIVerificador existe pero init no es función');
            }
        } catch(e) {
            console.error('❌ Error en UIVerificador.init():', e.message);
        }
    } else {
        console.log('ℹ️ UIVerificador no disponible');
    }
    
    // UISimulador
    if (typeof UISimulador !== 'undefined') {
        try {
            if (typeof UISimulador.init === 'function') {
                UISimulador.init();
                console.log('✅ UISimulador iniciado');
            } else {
                console.warn('⚠️ UISimulador existe pero init no es función');
            }
        } catch(e) {
            console.error('❌ Error en UISimulador.init():', e.message);
        }
    } else {
        console.log('ℹ️ UISimulador no disponible');
    }
    
    // Idioma
    if (typeof Idioma !== 'undefined') {
        try {
            if (typeof Idioma.init === 'function') {
                Idioma.init();
                console.log('✅ Idioma iniciado');
            }
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
    } else {
        console.warn('⚠️ Botones de modo no encontrados en el DOM');
    }
    
    // ========================================
    // 3. Buscador rápido del panel lateral
    // ========================================
    
    const buscadorRapido = document.getElementById('buscador-rapido');
    if (buscadorRapido) {
        buscadorRapido.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const texto = e.target.value.trim();
                if (texto && typeof BuscadorGlobal !== 'undefined') {
                    console.log('🔍 Búsqueda rápida:', texto);
                    // Si BuscadorGlobal tiene método buscar, usarlo
                    if (typeof BuscadorGlobal.buscar === 'function') {
                        BuscadorGlobal.buscar(texto);
                    } else if (typeof BuscadorGlobal === 'function') {
                        BuscadorGlobal(texto);
                    }
                }
            }
        });
        console.log('✅ Buscador rápido configurado');
    }
    
    // ========================================
    // 4. Mostrar España por defecto (cuando el mapa esté listo)
    // ========================================
    
    window.addEventListener('mapa-listos', () => {
        console.log('🗺️ Evento mapa-listos recibido');
        setTimeout(() => {
            if (typeof DashboardReal !== 'undefined') {
                DashboardReal.mostrar('ESP');
                console.log('🇪🇸 Cargando datos de España');
            } else if (typeof DashboardLugar !== 'undefined') {
                DashboardLugar.mostrar('espana');
            } else {
                console.warn('⚠️ DashboardReal no disponible');
            }
        }, 500);
    });
    
    console.log('✅ App principal inicializada correctamente');
});
