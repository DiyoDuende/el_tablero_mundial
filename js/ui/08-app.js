// js/ui/08-app.js
// ============================================
// APP PRINCIPAL - Tablero Mundial v4.0
// Inicialización segura, eventos globales y coordinación de módulos
// ============================================

console.log('🚀 Iniciando Tablero Mundial v4.0 (app principal)');

// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================

const APP_CONFIG = {
    version: '4.0',
    fechaLanzamiento: '2026-03-31',
    modoPorDefecto: 'realidad',  // 'realidad' o 'juego'
    debug: true,
    componentes: {
        mapa: { estado: false, dependencias: ['MapaGlobal'] },
        panelInfo: { estado: false, dependencias: ['UIPanelInfo'] },
        verificador: { estado: false, dependencias: ['UIVerificador'] },
        simulador: { estado: false, dependencias: ['UISimulador'] },
        idioma: { estado: false, dependencias: ['Idioma'] },
        cacheDatos: { estado: false, dependencias: ['CacheDatos'] },
        motorSimulacion: { estado: false, dependencias: ['MotorSimulacion'] },
        relacionesGlobales: { estado: false, dependencias: ['UIRelacionesGlobales'] },
        timeline: { estado: false, dependencias: ['UITimeline'] }
    },
    eventosGlobales: new Map()
};

// Configuración de CONFIG global si no existe
if (typeof window.CONFIG === 'undefined') {
    window.CONFIG = {
        modo: APP_CONFIG.modoPorDefecto,
        version: APP_CONFIG.version,
        debug: APP_CONFIG.debug
    };
}

// ============================================
// SISTEMA DE EVENTOS GLOBALES
// ============================================

const EventosGlobales = {
    // Registrar un evento
    registrar: function(tipo, datos) {
        const evento = {
            id: `${tipo}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            tipo: tipo,
            datos: datos,
            timestamp: new Date().toISOString()
        };
        
        if (!APP_CONFIG.eventosGlobales.has(tipo)) {
            APP_CONFIG.eventosGlobales.set(tipo, []);
        }
        APP_CONFIG.eventosGlobales.get(tipo).push(evento);
        
        // Limitar historial por tipo
        const historial = APP_CONFIG.eventosGlobales.get(tipo);
        if (historial.length > 50) historial.shift();
        
        // Disparar evento personalizado
        window.dispatchEvent(new CustomEvent(`evento-${tipo}`, { detail: evento }));
        
        if (APP_CONFIG.debug) {
            console.log(`📡 Evento registrado: ${tipo}`, datos);
        }
        
        return evento;
    },
    
    // Obtener eventos por tipo
    obtener: function(tipo) {
        return APP_CONFIG.eventosGlobales.get(tipo) || [];
    },
    
    // Obtener todos los eventos
    obtenerTodos: function() {
        const todos = [];
        for (let [tipo, eventos] of APP_CONFIG.eventosGlobales) {
            todos.push(...eventos);
        }
        return todos.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },
    
    // Limpiar historial
    limpiar: function(tipo = null) {
        if (tipo) {
            APP_CONFIG.eventosGlobales.delete(tipo);
        } else {
            APP_CONFIG.eventosGlobales.clear();
        }
        console.log(`🧹 Historial de eventos limpiado${tipo ? ` (${tipo})` : ''}`);
    }
};

// ============================================
// GESTOR DE MODO (REALIDAD / JUEGO)
// ============================================

const GestorModo = {
    modoActual: APP_CONFIG.modoPorDefecto,
    
    init: function() {
        const btnModoReal = document.getElementById('btn-modo-real');
        const btnModoJuego = document.getElementById('btn-modo-juego');
        const modoBadge = document.getElementById('modo-badge');
        
        if (btnModoReal && btnModoJuego && modoBadge) {
            // Configurar eventos
            btnModoReal.addEventListener('click', () => this.cambiarModo('realidad'));
            btnModoJuego.addEventListener('click', () => this.cambiarModo('juego'));
            
            // Establecer modo inicial
            this.cambiarModo(APP_CONFIG.modoPorDefecto);
            
            console.log('✅ GestorModo inicializado');
        } else {
            console.warn('⚠️ Botones de modo no encontrados');
        }
    },
    
    cambiarModo: function(modo) {
        if (modo !== 'realidad' && modo !== 'juego') return;
        
        this.modoActual = modo;
        window.CONFIG.modo = modo;
        
        // Actualizar UI
        const btnModoReal = document.getElementById('btn-modo-real');
        const btnModoJuego = document.getElementById('btn-modo-juego');
        const modoBadge = document.getElementById('modo-badge');
        
        if (btnModoReal && btnModoJuego) {
            if (modo === 'realidad') {
                btnModoReal.classList.add('active');
                btnModoJuego.classList.remove('active');
            } else {
                btnModoJuego.classList.add('active');
                btnModoReal.classList.remove('active');
            }
        }
        
        if (modoBadge) {
            if (modo === 'realidad') {
                modoBadge.innerHTML = '🌐 MODO REAL';
                modoBadge.style.background = '#2e7d32';
            } else {
                modoBadge.innerHTML = '🎮 MODO JUEGO';
                modoBadge.style.background = '#b27c2c';
            }
        }
        
        // Actualizar motor de simulación
        if (window.MotorSimulacion && window.MotorSimulacion.setModo) {
            window.MotorSimulacion.setModo(modo);
        }
        
        // Disparar evento global
        EventosGlobales.registrar('modo-cambiado', { modo: modo, anterior: this.modoActual });
        window.dispatchEvent(new CustomEvent('modo-cambiado', { detail: { modo: modo } }));
        
        console.log(`🎮 Modo cambiado a: ${modo.toUpperCase()}`);
        
        // Mostrar notificación
        this.mostrarNotificacion(modo === 'realidad' ? '🌐 Modo REAL activado - Datos verificados' : '🎮 Modo JUEGO activado - Simulación disponible');
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
            z-index: 1000;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            animation: fadeOut 3s ease forwards;
        `;
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 3000);
    },
    
    esModoJuego: function() {
        return this.modoActual === 'juego';
    },
    
    esModoRealidad: function() {
        return this.modoActual === 'realidad';
    }
};

// ============================================
// GESTOR DE COMPONENTES
// ============================================

const GestorComponentes = {
    componentesRegistrados: new Map(),
    
    registrar: function(nombre, componente, dependencias = []) {
        this.componentesRegistrados.set(nombre, {
            instancia: componente,
            dependencias: dependencias,
            inicializado: false
        });
        console.log(`📦 Componente registrado: ${nombre}`);
    },
    
    async inicializarComponente(nombre) {
        const comp = this.componentesRegistrados.get(nombre);
        if (!comp) {
            console.warn(`⚠️ Componente no registrado: ${nombre}`);
            return false;
        }
        
        if (comp.inicializado) return true;
        
        // Verificar dependencias
        for (const dep of comp.dependencias) {
            const depComp = this.componentesRegistrados.get(dep);
            if (!depComp || !depComp.inicializado) {
                console.warn(`⚠️ Dependencia ${dep} no inicializada para ${nombre}`);
                return false;
            }
        }
        
        try {
            if (comp.instancia && typeof comp.instancia.init === 'function') {
                await comp.instancia.init();
                comp.inicializado = true;
                APP_CONFIG.componentes[nombre] = { ...APP_CONFIG.componentes[nombre], estado: true };
                console.log(`✅ Componente inicializado: ${nombre}`);
                return true;
            }
        } catch(e) {
            console.error(`❌ Error inicializando ${nombre}:`, e.message);
        }
        return false;
    },
    
    async inicializarTodos() {
        console.log('🔧 Inicializando todos los componentes...');
        
        // Orden de inicialización (por dependencias)
        const orden = [
            'cacheDatos', 'motorSimulacion', 'idioma',
            'mapa', 'panelInfo', 'verificador', 'simulador',
            'relacionesGlobales', 'timeline'
        ];
        
        for (const nombre of orden) {
            await this.inicializarComponente(nombre);
        }
        
        console.log('✅ Todos los componentes inicializados');
        EventosGlobales.registrar('sistema-inicializado', { componentes: Array.from(this.componentesRegistrados.keys()) });
    },
    
    getEstado: function() {
        const estado = {};
        for (let [nombre, comp] of this.componentesRegistrados) {
            estado[nombre] = comp.inicializado;
        }
        return estado;
    }
};

// ============================================
// BUSCADOR INTELIGENTE
// ============================================

const BuscadorInteligente = {
    init: function() {
        const buscador = document.getElementById('buscador-rapido');
        const btnBuscar = document.getElementById('btn-buscar');
        
        if (!buscador) return;
        
        const buscar = async () => {
            const texto = buscador.value.trim();
            if (!texto) return;
            
            console.log(`🔍 Búsqueda: "${texto}"`);
            EventosGlobales.registrar('busqueda-realizada', { termino: texto });
            
            // Detectar tipo de búsqueda
            if (this.esPregunta(texto)) {
                this.buscarEnVerificador(texto);
            } else if (this.esSimulacion(texto)) {
                this.buscarEnSimulador(texto);
            } else if (this.esLey(texto)) {
                this.buscarEnLeyes(texto);
            } else {
                this.buscarEnMapa(texto);
            }
        };
        
        buscador.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') buscar();
        });
        
        if (btnBuscar) {
            btnBuscar.addEventListener('click', buscar);
        }
        
        console.log('✅ Buscador inteligente inicializado');
    },
    
    esPregunta: function(texto) {
        const patrones = ['¿', '?', 'es verdad', 'comprobar', 'verificar', 'por qué', 'cómo'];
        return patrones.some(p => texto.toLowerCase().includes(p));
    },
    
    esSimulacion: function(texto) {
        const patrones = ['qué pasaría si', 'simular', 'impacto de', 'qué ocurre si'];
        return patrones.some(p => texto.toLowerCase().includes(p));
    },
    
    esLey: function(texto) {
        const patrones = ['ley', 'reforma', 'decreto', 'legislación', 'normativa'];
        return patrones.some(p => texto.toLowerCase().includes(p));
    },
    
    buscarEnVerificador: function(texto) {
        const inputVerificador = document.getElementById('verificador-pregunta');
        const panelVerificador = document.getElementById('verificador-panel');
        
        if (inputVerificador) inputVerificador.value = texto;
        if (panelVerificador) panelVerificador.style.display = 'block';
        
        if (window.UIVerificador && window.UIVerificador.verificar) {
            window.UIVerificador.verificar();
        }
        
        // Cambiar a modo realidad si es necesario
        if (GestorModo.esModoJuego()) {
            GestorModo.cambiarModo('realidad');
        }
    },
    
    buscarEnSimulador: function(texto) {
        const inputSimulador = document.getElementById('escenario-input');
        
        if (inputSimulador) inputSimulador.value = texto;
        
        // Cambiar a modo juego
        if (!GestorModo.esModoJuego()) {
            GestorModo.cambiarModo('juego');
        }
        
        if (window.UISimulador && window.UISimulador.simular) {
            window.UISimulador.simular();
        }
        
        // Scroll al simulador
        const panelSimulador = document.getElementById('simulador-panel');
        if (panelSimulador) panelSimulador.scrollIntoView({ behavior: 'smooth' });
    },
    
    buscarEnLeyes: async function(texto) {
        if (window.LEYES) {
            // Buscar leyes relacionadas
            const todasLeyes = [];
            for (let pais in window.LEYES.porPais) {
                const leyes = window.LEYES.porPais[pais];
                for (let ley of leyes) {
                    if (ley.nombre.toLowerCase().includes(texto.toLowerCase()) ||
                        ley.textoOriginal.toLowerCase().includes(texto.toLowerCase())) {
                        todasLeyes.push({ pais, ley });
                    }
                }
            }
            
            if (todasLeyes.length > 0 && window.mostrarPanelLegislativo) {
                window.mostrarPanelLegislativo(todasLeyes[0].pais, todasLeyes[0].ley.id);
            } else {
                this.mostrarMensaje(`No se encontraron leyes relacionadas con "${texto}"`);
            }
        }
    },
    
    buscarEnMapa: async function(texto) {
        // Buscar por código ISO3
        if (texto.length === 3 && /^[A-Za-z]{3}$/.test(texto)) {
            const iso3 = texto.toUpperCase();
            if (window.DashboardReal && window.DashboardReal.mostrar) {
                window.DashboardReal.mostrar(iso3);
                if (window.MapaGlobal && window.MapaGlobal.centrarEnPais) {
                    window.MapaGlobal.centrarEnPais(iso3);
                }
                return;
            }
        }
        
        // Buscar por nombre en el mapa
        if (window.capaPaisesGlobal) {
            let encontrado = false;
            for (let layer of window.capaPaisesGlobal.getLayers()) {
                const nombre = layer.feature?.properties?.name || '';
                if (nombre.toLowerCase() === texto.toLowerCase()) {
                    layer.fireEvent('click');
                    if (window.MapaGlobal && window.MapaGlobal.getMapa) {
                        const bounds = layer.getBounds();
                        if (bounds.isValid()) {
                            window.MapaGlobal.getMapa().fitBounds(bounds);
                        }
                    }
                    encontrado = true;
                    break;
                }
            }
            
            if (!encontrado) {
                this.mostrarMensaje(`No se encontró "${texto}". Prueba con un código ISO3 (ej: ESP, FRA, DEU)`);
            }
        }
    },
    
    mostrarMensaje: function(mensaje) {
        const notif = document.createElement('div');
        notif.textContent = mensaje;
        notif.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #d32f2f;
            color: white;
            padding: 10px 20px;
            border-radius: 30px;
            z-index: 1000;
            font-size: 14px;
            max-width: 80%;
            text-align: center;
            animation: fadeOut 3s ease forwards;
        `;
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 3000);
    }
};

// ============================================
// INICIALIZACIÓN PRINCIPAL
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('📄 DOM cargado, inicializando Tablero Mundial v4.0');
    
    // Registrar componentes
    if (typeof CacheDatos !== 'undefined') {
        GestorComponentes.registrar('cacheDatos', CacheDatos, []);
    }
    if (typeof MotorSimulacion !== 'undefined') {
        GestorComponentes.registrar('motorSimulacion', MotorSimulacion, []);
    }
    if (typeof Idioma !== 'undefined') {
        GestorComponentes.registrar('idioma', Idioma, []);
    }
    if (typeof MapaGlobal !== 'undefined') {
        GestorComponentes.registrar('mapa', MapaGlobal, []);
    }
    if (typeof UIPanelInfo !== 'undefined') {
        GestorComponentes.registrar('panelInfo', UIPanelInfo, ['mapa']);
    }
    if (typeof UIVerificador !== 'undefined') {
        GestorComponentes.registrar('verificador', UIVerificador, []);
    }
    if (typeof UISimulador !== 'undefined') {
        GestorComponentes.registrar('simulador', UISimulador, ['motorSimulacion']);
    }
    if (typeof UIRelacionesGlobales !== 'undefined') {
        GestorComponentes.registrar('relacionesGlobales', UIRelacionesGlobales, []);
    }
    if (typeof UITimeline !== 'undefined') {
        GestorComponentes.registrar('timeline', UITimeline, []);
    }
    
    // Inicializar gestor de modo
    GestorModo.init();
    
    // Inicializar buscador inteligente
    BuscadorInteligente.init();
    
    // Inicializar todos los componentes
    await GestorComponentes.inicializarTodos();
    
    // Configurar teclas de acceso rápido
    configurarTeclasAcceso();
    
    // Mostrar bienvenida
    mostrarBienvenida();
    
    console.log('✅ Tablero Mundial v4.0 completamente inicializado');
    EventosGlobales.registrar('sistema-listos', { version: APP_CONFIG.version });
});

// ============================================
// TECLAS DE ACCESO RÁPIDO
// ============================================

function configurarTeclasAcceso() {
    document.addEventListener('keydown', (e) => {
        // Ctrl + K: Enfocar buscador
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const buscador = document.getElementById('buscador-rapido');
            if (buscador) {
                buscador.focus();
                buscador.select();
            }
        }
        
        // Ctrl + V: Abrir verificador
        if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
            e.preventDefault();
            const panelVerificador = document.getElementById('verificador-panel');
            if (panelVerificador) {
                panelVerificador.style.display = 'block';
                document.getElementById('verificador-pregunta')?.focus();
            }
        }
        
        // Ctrl + S: Abrir simulador
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            const panelSimulador = document.getElementById('simulador-panel');
            if (panelSimulador) {
                panelSimulador.scrollIntoView({ behavior: 'smooth' });
                document.getElementById('escenario-input')?.focus();
            }
        }
        
        // Ctrl + M: Cambiar modo
        if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
            e.preventDefault();
            const nuevoModo = GestorModo.esModoJuego() ? 'realidad' : 'juego';
            GestorModo.cambiarModo(nuevoModo);
        }
        
        // ESC: Cerrar paneles
        if (e.key === 'Escape') {
            document.getElementById('verificador-panel').style.display = 'none';
        }
    });
    
    console.log('⌨️ Teclas de acceso rápido configuradas: Ctrl+K buscar, Ctrl+V verificador, Ctrl+S simulador, Ctrl+M modo, ESC cerrar');
}

// ============================================
// BIENVENIDA
// ============================================

function mostrarBienvenida() {
    const yaVisto = localStorage.getItem('tablero_bienvenida_visto');
    if (yaVisto) return;
    
    setTimeout(() => {
        const bienvenida = document.createElement('div');
        bienvenida.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background: var(--bg-card); border-radius: 20px; padding: 25px; 
                        max-width: 400px; z-index: 2000; box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                        border: 2px solid var(--info);">
                <h3 style="color: var(--info); margin-bottom: 15px;">🌍 Bienvenido a Tablero Mundial v4.0</h3>
                <p style="margin-bottom: 15px;">Explora el mundo con datos reales del Banco Mundial y simula escenarios hipotéticos.</p>
                <ul style="margin-bottom: 20px; padding-left: 20px;">
                    <li>🗺️ Haz clic en cualquier país del mapa</li>
                    <li>🔍 Usa Ctrl+K para buscar</li>
                    <li>✅ Pregunta al verificador ciudadano</li>
                    <li>🎮 Activa el modo JUEGO para simular</li>
                </ul>
                <button id="btn-cerrar-bienvenida" style="background: var(--info); color: #0a1219; 
                        border: none; padding: 10px 20px; border-radius: 30px; cursor: pointer; width: 100%;">
                    Entendido, ¡comenzar!
                </button>
            </div>
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 1999;"></div>
        `;
        document.body.appendChild(bienvenida);
        
        const btnCerrar = document.getElementById('btn-cerrar-bienvenida');
        if (btnCerrar) {
            btnCerrar.addEventListener('click', () => {
                bienvenida.remove();
                localStorage.setItem('tablero_bienvenida_visto', 'true');
            });
        }
    }, 1000);
}

// ============================================
// EXPORTAR PARA USO GLOBAL
// ============================================

window.APP_CONFIG = APP_CONFIG;
window.EventosGlobales = EventosGlobales;
window.GestorModo = GestorModo;
window.GestorComponentes = GestorComponentes;
window.BuscadorInteligente = BuscadorInteligente;

console.log('✅ App principal cargada correctamente');
