// js/ui/08-app.js
// ============================================
// APP PRINCIPAL - Versión corregida v4.2
// ============================================

console.log('🚀 Iniciando Tablero Mundial v4.2');

// Configuración global
window.CONFIG = window.CONFIG || {
    modo: 'realidad',
    version: '4.2'
};

// ============================================
// GESTOR DE MODALES (README y NORMAS)
// ============================================

const GestorModales = {
    init: function() {
        // Botón README
        const btnReadme = document.getElementById('btn-readme');
        const modalReadme = document.getElementById('modal-readme');
        const cerrarReadme = document.getElementById('btn-cerrar-readme');
        
        if (btnReadme && modalReadme) {
            btnReadme.addEventListener('click', () => {
                modalReadme.style.display = 'flex';
                this.cargarContenido('README.md', 'readme-contenido');
            });
            if (cerrarReadme) {
                cerrarReadme.addEventListener('click', () => modalReadme.style.display = 'none');
            }
            modalReadme.addEventListener('click', (e) => {
                if (e.target === modalReadme) modalReadme.style.display = 'none';
            });
        }
        
        // Botón NORMAS
        const btnNormas = document.getElementById('btn-normas');
        const modalNormas = document.getElementById('modal-normas');
        const cerrarNormas = document.getElementById('btn-cerrar-normas');
        
        if (btnNormas && modalNormas) {
            btnNormas.addEventListener('click', () => {
                modalNormas.style.display = 'flex';
                this.cargarContenido('NORMAS.md', 'normas-contenido');
            });
            if (cerrarNormas) {
                cerrarNormas.addEventListener('click', () => modalNormas.style.display = 'none');
            }
            modalNormas.addEventListener('click', (e) => {
                if (e.target === modalNormas) modalNormas.style.display = 'none';
            });
        }
        
        console.log('✅ GestorModales inicializado');
    },
    
    cargarContenido: async function(archivo, contenedorId) {
        const container = document.getElementById(contenedorId);
        if (!container) return;
        
        container.innerHTML = '<p>Cargando...</p>';
        
        try {
            const response = await fetch(archivo);
            if (response.ok) {
                const texto = await response.text();
                container.innerHTML = `<pre style="white-space: pre-wrap; font-family: inherit;">${this.escapeHTML(texto)}</pre>`;
            } else {
                container.innerHTML = `<p>⚠️ No se pudo cargar ${archivo}</p>`;
            }
        } catch(e) {
            container.innerHTML = `<p>❌ Error cargando ${archivo}</p>`;
        }
    },
    
    escapeHTML: function(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
};

// ============================================
// GESTOR DE MODO (REAL / JUEGO)
// ============================================

const GestorModo = {
    modoActual: 'realidad',
    
    init: function() {
        const btnReal = document.getElementById('btn-modo-real');
        const btnJuego = document.getElementById('btn-modo-juego');
        const modoBadge = document.getElementById('modo-badge');
        
        if (btnReal && btnJuego) {
            btnReal.addEventListener('click', () => this.cambiarModo('realidad'));
            btnJuego.addEventListener('click', () => this.cambiarModo('juego'));
        }
        
        this.actualizarUI();
        console.log('✅ GestorModo inicializado');
    },
    
    cambiarModo: function(modo) {
        this.modoActual = modo;
        window.CONFIG.modo = modo;
        this.actualizarUI();
        
        window.dispatchEvent(new CustomEvent('modo-cambiado', { detail: { modo: modo } }));
        console.log(`🎮 Modo cambiado a: ${modo.toUpperCase()}`);
    },
    
    actualizarUI: function() {
        const btnReal = document.getElementById('btn-modo-real');
        const btnJuego = document.getElementById('btn-modo-juego');
        const modoBadge = document.getElementById('modo-badge');
        
        if (btnReal && btnJuego) {
            if (this.modoActual === 'realidad') {
                btnReal.classList.add('active');
                btnJuego.classList.remove('active');
            } else {
                btnJuego.classList.add('active');
                btnReal.classList.remove('active');
            }
        }
        
        if (modoBadge) {
            if (this.modoActual === 'realidad') {
                modoBadge.innerHTML = '🌐 MODO REAL';
                modoBadge.style.background = '#2e7d32';
            } else {
                modoBadge.innerHTML = '🎮 MODO JUEGO';
                modoBadge.style.background = '#b27c2c';
            }
        }
    }
};

// ============================================
// INICIALIZACIÓN PRINCIPAL
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM cargado, inicializando componentes...');
    
    GestorModales.init();
    GestorModo.init();
    
    // Buscador
    const buscadorInput = document.getElementById('buscador-rapido');
    const buscadorBtn = document.getElementById('btn-buscar');
    
    if (buscadorInput) {
        const buscarHandler = () => {
            const texto = buscadorInput.value.trim();
            if (texto && window.BuscadorGlobal && window.BuscadorGlobal.buscar) {
                window.BuscadorGlobal.buscar(texto);
            }
        };
        buscadorInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') buscarHandler();
        });
        if (buscadorBtn) buscadorBtn.addEventListener('click', buscarHandler);
        console.log('✅ Buscador configurado');
    }
    
    // Cargar España cuando el mapa esté listo
    window.addEventListener('mapa-listos', () => {
        console.log('🗺️ Evento mapa-listos recibido');
        setTimeout(() => {
            if (window.DashboardReal && typeof window.DashboardReal.mostrar === 'function') {
                window.DashboardReal.mostrar('ESP');
            }
        }, 500);
    });
    
    console.log('✅ App principal inicializada');
});

window.GestorModo = GestorModo;
window.GestorModales = GestorModales;
