// js/ui/03-simulador.js
const UISimulador = {
    init: function() {
        const btnSimular = document.getElementById('btn-simular');
        const input = document.getElementById('simulador-pregunta');
        if (btnSimular) btnSimular.addEventListener('click', () => this.simular());
        if (input) input.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.simular(); });
    },

    simular: function() {
        if (window.CONFIG.modo !== 'juego') {
            alert('Activa primero el modo JUEGO');
            return;
        }
        const escenario = document.getElementById('simulador-pregunta').value.trim();
        if (!escenario) return;

        const resultado = MotorSimulacion.simular({ poder: 0.5, sector: 0.5, mecanismo: 0.5 });
        const html = `
            <h4>📊 RESULTADOS DE LA SIMULACIÓN</h4>
            <p>Impacto económico: ${resultado.impacto.económico}%</p>
            <p>Impacto geopolítico: ${resultado.impacto.geopolítico}%</p>
            <p>Impacto social: ${resultado.impacto.social}%</p>
            <p class="fuente">⚠️ SIMULACIÓN (motor básico)</p>
        `;
        document.getElementById('simulador-resultados').innerHTML = html;
    }
};

window.UISimulador = UISimulador;
