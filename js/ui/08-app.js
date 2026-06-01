// js/ui/08-app.js
// ============================================
// APP PRINCIPAL - Inicialización segura v4.1
// ============================================

console.log('🚀 Iniciando Tablero Mundial v4.1');

// Configuración global
window.CONFIG = window.CONFIG || {
    modo: 'realidad',
    version: '4.1'
};

// ============================================
// GESTOR DE MODAL (README y NORMAS)
// ============================================

const GestorModales = {
    init: function() {
        // ============================================
        // FIX 4: Añadir event listeners a README y NORMAS
        // ============================================
        
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
            // Cerrar al hacer clic fuera
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
                // Convertir markdown simple a HTML
                const html = this.markdownToHtml(texto);
                container.innerHTML = html;
            } else {
                container.innerHTML = `<p>No se pudo cargar ${archivo}</p>`;
            }
        } catch(e) {
            container.innerHTML = `<p>Error cargando ${archivo}</p>`;
        }
    },
    
    markdownToHtml: function(md) {
        // Conversión muy básica
        let html = md;
        html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
        html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
        html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
        html = html.replace(/<li>.*<\/li>/gs, (match) => `<ul>${match}</ul>`);
        html = html.replace(/\n\n/g, '</p><p>');
        html = `<p>${html}</p>`;
        return html;
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
        
        // Disparar evento global
        window.dispatchEvent(new CustomEvent('modo-cambiado', { detail: { modo: modo } }));
        
        console.log(`🎮 Modo cambiado a: ${modo.toUpperCase()}`);
        this.mostrarNotificacion(modo === 'juego' ? '🎮 Modo JUEGO activado' : '🌐 Modo REAL activado');
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
    },
    
    mostrarNotificacion: function(mensaje) {
        const notif = document.createElement('div');
        notif.textContent = mensaje;
        notif.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #2a7faa;
            color: white;
            padding: 8px 20px;
            border-radius: 30px;
            z-index: 2000;
            font-size: 14px;
            animation: fadeOut 3s ease forwards;
        `;
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 3000);
    }
};

// ============================================
// INICIALIZACIÓN PRINCIPAL
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM cargado, inicializando componentes...');
    
    // Inicializar gestores
    GestorModales.init();
    GestorModo.init();
    
    // ============================================
    // FIX 1: BUSCADOR (ahora con id correcto)
    // ============================================
    const buscadorInput = document.getElementById('buscador-rapido');
    const buscadorBtn = document.getElementById('btn-buscar');
    
    if (buscadorInput) {
        const buscarHandler = () => {
            const texto = buscadorInput.value.trim();
            if (texto && window.BuscadorGlobal && window.BuscadorGlobal.buscar) {
                window.BuscadorGlobal.buscar(texto);
            } else if (texto) {
                console.log('🔍 Búsqueda:', texto);
                // Fallback: intentar con DashboardReal
                if (window.DashboardReal && window.DashboardReal.mostrar) {
                    const iso3Match = texto.match(/^([A-Z]{3})$/i);
                    if (iso3Match) {
                        window.DashboardReal.mostrar(iso3Match[1].toUpperCase());
                    }
                }
            }
        };
        
        buscadorInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') buscarHandler();
        });
        
        if (buscadorBtn) {
            buscadorBtn.addEventListener('click', buscarHandler);
        }
        
        console.log('✅ Buscador configurado (id="buscador-rapido")');
    } else {
        console.warn('⚠️ Buscador: elemento #buscador-rapido no encontrado');
    }
    
    // ============================================
    // Cargar España por defecto cuando el mapa esté listo
    // ============================================
    window.addEventListener('mapa-listos', () => {
        console.log('🗺️ Evento mapa-listos recibido');
        setTimeout(() => {
            if (window.DashboardReal && typeof window.DashboardReal.mostrar === 'function') {
                window.DashboardReal.mostrar('ESP');
                console.log('🇪🇸 Cargando datos de España');
            }
        }, 500);
    });
    
    console.log('✅ App principal inicializada correctamente');
});

// Añadir animación fadeOut si no existe
if (!document.querySelector('#fadeOut-style')) {
    const style = document.createElement('style');
    style.id = 'fadeOut-style';
    style.textContent = `
        @keyframes fadeOut {
            0% { opacity: 1; }
            70% { opacity: 1; }
            100% { opacity: 0; visibility: hidden; }
        }
    `;
    document.head.appendChild(style);
}

// Exportar
window.GestorModo = GestorModo;
window.GestorModales = GestorModales;
