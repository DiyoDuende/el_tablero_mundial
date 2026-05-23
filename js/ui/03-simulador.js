const UISimulador = {
    init: function() {
        document.getElementById('btn-simular')?.addEventListener('click', () => this.simular());
        document.getElementById('simulador-pregunta')?.addEventListener('keypress', e => { if (e.key === 'Enter') this.simular(); });
    },
    simular: function() {
        if (window.CONFIG.modo !== 'juego') return alert('Activa modo JUEGO');
        const escenario = document.getElementById('simulador-pregunta').value.trim();
        if (!escenario) return;
        const resultado = MotorSimulacion.simular({ poder:0.5, sector:0.5, mecanismo:0.5 });
        const html = `<h4>Resultado</h4><p>Económico: ${resultado.impacto.económico}%<br>Geopolítico: ${resultado.impacto.geopolítico}%<br>Social: ${resultado.impacto.social}%</p>`;
        document.getElementById('simulador-resultados').innerHTML = html;
    }
};
window.UISimulador = UISimulador;
