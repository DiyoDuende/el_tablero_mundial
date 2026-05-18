// ============================================
// SIMULADOR (modo juego)
// ============================================
const UISimulador = {
    init: function() {
        const btnSimular = document.getElementById('btn-simular');
        const preguntaInput = document.getElementById('simulador-pregunta');
        if (btnSimular) {
            btnSimular.addEventListener('click', () => {
                this.simular();
            });
        }
        if (preguntaInput) {
            preguntaInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.simular();
            });
        }
    },

    simular: function() {
        if (CONFIG.modo !== 'juego') {
            const resultadosDiv = document.getElementById('simulador-resultados');
            if (resultadosDiv) {
                resultadosDiv.innerHTML = '<p class="placeholder" data-i18n="activaJuego">Activa el modo JUEGO y escribe un escenario para simular</p>';
            }
            return;
        }
        const escenario = document.getElementById('simulador-pregunta')?.value.trim();
        if (!escenario) return;

        // Detectar palabras clave para elegir un evento
        let eventoId = null;
        const escenarioLower = escenario.toLowerCase();
        if (escenarioLower.includes('petróleo') || escenarioLower.includes('energía')) eventoId = 'crisis_energetica';
        else if (escenarioLower.includes('huelga') || escenarioLower.includes('protesta')) eventoId = 'huelga_general';
        else if (escenarioLower.includes('sequía') || escenarioLower.includes('agua')) eventoId = 'sequia';
        else if (escenarioLower.includes('sanción') || escenarioLower.includes('bloqueo')) eventoId = 'sanciones';
        else if (escenarioLower.includes('interés') || escenarioLower.includes('tipos')) eventoId = 'subida_tipos';

        let resultadoHtml = '';
        if (eventoId && window.MotorSimulacion) {
            const resultado = MotorSimulacion.simularEvento(eventoId, 'españa');
            resultadoHtml = `
                <h4>📊 RESULTADOS DE LA SIMULACIÓN</h4>
                <p><strong>Escenario:</strong> ${escenario}</p>
                <p>🔔 Evento: ${resultado.evento.nombre}</p>
                <p>📉 Impacto económico: ${resultado.evento.impactos.económico ? (resultado.evento.impactos.económico * 100).toFixed(0) : 0}%</p>
                <p>👥 Impacto social: ${resultado.evento.impactos.social ? (resultado.evento.impactos.social * 100).toFixed(0) : 0}%</p>
                <p class="fuente" style="margin-top:20px;">⚠️ ESTO ES UNA SIMULACIÓN (modo juego activo)</p>
            `;
        } else {
            // Simulación genérica
            const resultado = MotorSimulacion.simular({ poder: 0.7, sector: 0.6, factorTerritorio: 1.0 });
            resultadoHtml = `
                <h4>📊 RESULTADOS DE LA SIMULACIÓN</h4>
                <p><strong>Escenario:</strong> ${escenario}</p>
                <p>📉 Impacto económico: ${resultado.impacto.económico}%</p>
                <p>🌍 Impacto geopolítico: ${resultado.impacto.geopolítico}%</p>
                <p class="fuente" style="margin-top:20px;">⚠️ ESTO ES UNA SIMULACIÓN (modo juego activo)</p>
            `;
        }
        const resultadosDiv = document.getElementById('simulador-resultados');
        if (resultadosDiv) resultadosDiv.innerHTML = resultadoHtml;
    }
};

window.UISimulador = UISimulador;
