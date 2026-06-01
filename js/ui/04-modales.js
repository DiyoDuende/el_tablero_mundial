// js/ui/04-modales.js
// ============================================
// MODALES - Control de paneles emergentes
// ============================================

const ControlModales = {
    init: function() {
        console.log('🪟 Inicializando control de modales');
        this.configurarSimulador();
        this.configurarVerificador();
        this.configurarRelaciones();
        this.configurarTimeline();
    },
    
    configurarSimulador: function() {
        const btnModoJuego = document.getElementById('btn-modo-juego');
        const simuladorPanel = document.getElementById('simulador-panel');
        const btnSimular = document.getElementById('btn-simular');
        const escenarioInput = document.getElementById('escenario-input');
        
        if (btnModoJuego) {
            btnModoJuego.addEventListener('click', () => {
                if (simuladorPanel) {
                    simuladorPanel.style.display = 'block';
                    console.log('🎮 Panel de simulador abierto');
                }
            });
        }
        
        if (btnSimular) {
            btnSimular.addEventListener('click', () => {
                const escenario = escenarioInput?.value || 'escenario';
                alert(`⚡ Simulando: ${escenario}`);
                console.log('⚡ Simulación iniciada:', escenario);
            });
        }
    },
    
    configurarVerificador: function() {
        const btnVerificador = document.getElementById('btn-verificador-panel');
        const verificadorPanel = document.getElementById('verificador-panel');
        const btnVerificar = document.getElementById('btn-verificar');
        const btnCerrarVerificador = document.getElementById('btn-cerrar-verificador');
        
        if (btnVerificador) {
            btnVerificador.addEventListener('click', () => {
                if (verificadorPanel) {
                    verificadorPanel.style.display = 'block';
                    console.log('✅ Panel verificador abierto');
                }
            });
        }
        
        if (btnVerificar) {
            btnVerificar.addEventListener('click', () => {
                const pregunta = document.getElementById('verificador-pregunta')?.value || '';
                if (pregunta) {
                    const respuesta = `<p>📖 Verificando: "${pregunta}"</p><p>Datos: Consultando fuentes oficiales...</p>`;
                    const resultado = document.getElementById('verificador-resultado');
                    if (resultado) resultado.innerHTML = respuesta;
                }
            });
        }
        
        if (btnCerrarVerificador) {
            btnCerrarVerificador.addEventListener('click', () => {
                if (verificadorPanel) verificadorPanel.style.display = 'none';
            });
        }
    },
    
    configurarRelaciones: function() {
        const btnRelaciones = document.getElementById('btn-relaciones-globales');
        const relacionesPanel = document.getElementById('relaciones-globales-panel');
        const btnCerrarRelaciones = document.getElementById('btn-cerrar-relaciones-globales');
        
        if (btnRelaciones) {
            btnRelaciones.addEventListener('click', () => {
                if (relacionesPanel) {
                    relacionesPanel.style.display = 'block';
                    if (!document.getElementById('relaciones-contenido').innerHTML) {
                        document.getElementById('relaciones-contenido').innerHTML = '<p>🌐 Mapa de relaciones globales...</p>';
                    }
                    console.log('🌐 Panel de relaciones abierto');
                }
            });
        }
        
        if (btnCerrarRelaciones) {
            btnCerrarRelaciones.addEventListener('click', () => {
                if (relacionesPanel) relacionesPanel.style.display = 'none';
            });
        }
    },
    
    configurarTimeline: function() {
        const btnTimeline = document.getElementById('btn-timeline-panel');
        const timelinePanel = document.getElementById('timeline-panel');
        const btnCerrarTimeline = document.getElementById('btn-cerrar-timeline');
        
        if (btnTimeline) {
            btnTimeline.addEventListener('click', () => {
                if (timelinePanel) {
                    timelinePanel.style.display = 'block';
                    if (!document.getElementById('timeline-contenido').innerHTML) {
                        document.getElementById('timeline-contenido').innerHTML = '<p>📅 Línea temporal de eventos...</p>';
                    }
                    console.log('📅 Panel de timeline abierto');
                }
            });
        }
        
        if (btnCerrarTimeline) {
            btnCerrarTimeline.addEventListener('click', () => {
                if (timelinePanel) timelinePanel.style.display = 'none';
            });
        }
    }
};

window.ControlModales = ControlModales;

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ControlModales.init());
} else {
    ControlModales.init();
}

console.log('✅ Modales cargados');
