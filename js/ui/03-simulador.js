// ============================================
// SIMULADOR (modo juego)
// ============================================
const UISimulador = {
  init: function() {
    document.getElementById('btn-simular').addEventListener('click', () => {
      this.simular();
    });
    document.getElementById('simulador-pregunta').addEventListener('keypress', (e) => {
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
    const resultados = {
      economico: -8,
      social: 12,
      politico: 5,
      probabilidad: 65
    };
    let html = `
      <h4>📊 RESULTADOS DE LA SIMULACIÓN</h4>
      <p>• Impacto económico: ${resultados.economico > 0 ? '+' : ''}${resultados.economico}%</p>
      <p>• Impacto social: +${resultados.social}% protestas</p>
      <p>• Impacto político: +${resultados.politico}% tensión</p>
      <p>• Probabilidad de éxito: ${resultados.probabilidad}%</p>
      <p class="fuente">⚠️ ESTO ES UNA SIMULACIÓN</p>
    `;
    document.getElementById('simulador-resultados').innerHTML = html;
  }
};

window.UISimulador = UISimulador;
