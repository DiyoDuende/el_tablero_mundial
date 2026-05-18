// js/ui/03-simulador.js - Simulador (modo juego)
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

    // Detectar palabras clave para elegir un evento
    let eventoId = null;
    if (escenario.includes('petróleo') || escenario.includes('energía')) eventoId = 'crisis_energetica';
    else if (escenario.includes('huelga') || escenario.includes('protesta')) eventoId = 'huelga_general';
    else if (escenario.includes('sequía') || escenario.includes('agua')) eventoId = 'sequia';
    else if (escenario.includes('sanción') || escenario.includes('bloqueo')) eventoId = 'sanciones';
    else if (escenario.includes('interés') || escenario.includes('tipos')) eventoId = 'subida_tipos';

    if (eventoId && window.MotorSimulacion) {
      const resultado = MotorSimulacion.simularEvento(eventoId, 'españa');
      this.mostrarResultado(resultado, escenario);
    } else {
      // Simulación genérica
      const resultado = MotorSimulacion.simular({ poder: 0.7, sector: 0.6, factorTerritorio: 1.0 });
      this.mostrarResultado(resultado, escenario);
    }
  },

  mostrarResultado: function(resultado, escenario) {
    let html = `<h4>📊 RESULTADOS DE LA SIMULACIÓN</h4>
                <p><strong>Escenario:</strong> ${escenario}</p>`;
    if (resultado.evento) {
      html += `<p>🔔 Evento: ${resultado.evento.nombre}</p>`;
      html += `<p>📉 Impacto económico: ${resultado.evento.impactos.económico ? (resultado.evento.impactos.económico * 100).toFixed(0) : 0}%</p>`;
      html += `<p>👥 Impacto social: ${resultado.evento.impactos.social ? (resultado.evento.impactos.social * 100).toFixed(0) : 0}%</p>`;
    } else if (resultado.impacto) {
      html += `<p>📉 Impacto económico: ${resultado.impacto.económico}%</p>`;
      html += `<p>🌍 Impacto geopolítico: ${resultado.impacto.geopolítico}%</p>`;
    }
    html += `<p class="fuente" style="margin-top:20px;">⚠️ ESTO ES UNA SIMULACIÓN (modo juego activo)</p>`;
    document.getElementById('simulador-resultados').innerHTML = html;
  }
};

window.UISimulador = UISimulador;
