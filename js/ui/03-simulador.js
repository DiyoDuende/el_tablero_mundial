// ============================================
// SIMULADOR (modo juego)
// ============================================

const UISimulador = {
    
    init: function() {
        const btn = document.getElementById('btn-simular');
        const input = document.getElementById('simulador-pregunta');
        if (btn) btn.addEventListener('click', () => this.simular());
        if (input) input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.simular();
        });
    },
    
    simular: function() {
        if (CONFIG.modo !== 'juego') {
            alert('Activa primero el MODO JUEGO para simular');
            return;
        }

        const escenario = document.getElementById('simulador-pregunta').value.trim();
        if (!escenario) return;

        // Simulación de ejemplo (luego conectarás con el motor real)
        const resultados = {
            economico: -8,
            social: 12,
            politico: 5,
            probabilidad: 65
        };

        const contenedor = document.getElementById('simulador-resultados');
        if (contenedor) {
            contenedor.innerHTML = `
                <h4>📊 RESULTADOS DE LA SIMULACIÓN</h4>
                <p>• Impacto económico: ${resultados.economico > 0 ? '+' : ''}${resultados.economico}%</p>
                <p>• Impacto social: +${resultados.social}% protestas</p>
                <p>• Impacto político: +${resultados.politico}% tensión</p>
                <p>• Probabilidad de éxito: ${resultados.probabilidad}%</p>
                <p class="fuente">⚠️ ESTO ES UNA SIMULACIÓN</p>
            `;
        }
    }
};

window.UISimulador = UISimulador;
