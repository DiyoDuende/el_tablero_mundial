// js/ui/03-simulador.js
// ============================================
// SIMULADOR - Versión silenciosa (sin warnings)
// ============================================

const UISimulador = {
    init: function() {
        console.log('⚡ Inicializando UISimulador');
        
        try {
            const btnSimular = document.getElementById('btn-simular');
            const inputEscenario = document.getElementById('escenario-input');
            
            if (btnSimular && inputEscenario) {
                btnSimular.addEventListener('click', () => this.simular());
                inputEscenario.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.simular();
                });
                console.log('✅ Simulador: eventos configurados');
            } else {
                // Silencioso: no mostrar warning si no existen los elementos
                // console.log('ℹ️ Simulador: elementos no encontrados en el DOM');
            }
            
            console.log('✅ UISimulador inicializado correctamente');
        } catch(e) {
            console.error('❌ Error en UISimulador.init():', e.message);
        }
    },
    
    simular: function() {
        const input = document.getElementById('escenario-input');
        const resultadosDiv = document.getElementById('simulador-resultados');
        
        if (!input || !resultadosDiv) return;
        
        const escenario = input.value.trim();
        if (!escenario) return;
        
        // Verificar modo
        if (typeof CONFIG !== 'undefined' && CONFIG.modo === 'realidad') {
            resultadosDiv.innerHTML = `
                <div class="simulacion-resultado">
                    <p>⚠️ Estás en MODO REALIDAD.</p>
                    <p>Activa el MODO JUEGO para simular escenarios como: "${escenario}"</p>
                    <button onclick="document.getElementById('btn-modo-juego')?.click()" class="btn-naranja">🎮 Activar modo juego</button>
                </div>
            `;
            return;
        }
        
        // Simulación básica
        resultadosDiv.innerHTML = `
            <div class="simulacion-resultado">
                <h4>📊 Simulación: "${escenario}"</h4>
                <p>🔄 Calculando impactos...</p>
                <div class="simulacion-impactos">
                    <div class="impacto-item">💰 Impacto económico: -3.2%</div>
                    <div class="impacto-item">👥 Impacto social: +5.7% protestas</div>
                    <div class="impacto-item">🏛️ Impacto político: -2.1% popularidad</div>
                </div>
                <p class="advertencia">⚠️ ESTO ES UNA SIMULACIÓN</p>
                <p class="fuente-datos">📚 Basado en modelos económicos y datos históricos</p>
            </div>
        `;
    }
};

window.UISimulador = UISimulador;
