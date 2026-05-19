// js/ui/01-panel-info.js
const UIPanelInfo = {
  // Referencia al contenedor del dashboard
  container: null,

  init: function() {
    this.container = document.getElementById('dashboard-container');
    if (!this.container) {
      console.warn('No se encontró el elemento #dashboard-container');
    }
  },

  // Muestra la información completa de un país/región
  mostrarPais: function(paisId) {
    if (!this.container) return;

    const territorio = TERRITORIOS[paisId];
    if (!territorio) {
      this.container.innerHTML = `<div class="error">⚠️ No se encontró información para "${paisId}"</div>`;
      return;
    }

    // Datos de ejemplo - luego se conectarán con el EstadoTablero
    const poblacion = territorio.poblacion ? territorio.poblacion.toLocaleString() : '—';
    const capital = territorio.capital || '—';
    const continente = territorio.continente || '—';
    
    // HTML del dashboard (similar al diseño de la documentación)
    let html = `
      <div class="dashboard-pais">
        <div class="info-header">
          <h3>${this.getBandera(paisId)} ${territorio.nombre}</h3>
          <span class="pais-estado">🟢 ESTABLE</span>
        </div>
        <div class="info-objetivos">
          🎯 Objetivos: <span id="objetivos-valor">68%</span>
        </div>
        <div class="info-botones">
          <button class="info-btn" data-seccion="economia">📊 Economía</button>
          <button class="info-btn" data-seccion="leyes">⚖️ Leyes</button>
          <button class="info-btn" data-seccion="geopolitica">🏛️ Geopolítica</button>
          <button class="info-btn" data-seccion="social">👥 Social</button>
          <button class="info-btn" data-seccion="clima">🌍 Clima</button>
        </div>
        <div class="info-alertas">
          <h4>⚠️ Alertas</h4>
          <div class="alerta-item alerta-roja">🔴 Seguridad energética</div>
          <div class="alerta-item alerta-amarilla">🟡 Desempleo alto</div>
        </div>
        <div class="info-datos-basicos">
          <p><strong>Población:</strong> ${poblacion}</p>
          <p><strong>Capital:</strong> ${capital}</p>
          <p><strong>Continente:</strong> ${continente}</p>
        </div>
      </div>
    `;
    this.container.innerHTML = html;

    // Agregar eventos a los botones (opcional)
    this.agregarEventosBotones(paisId);
  },

  // Bandera simple según el país (puedes ampliarlo)
  getBandera: function(paisId) {
    const flags = {
      españa: '🇪🇸',
      francia: '🇫🇷',
      alemania: '🇩🇪',
      madrid: '🏙️',
      andalucia: '🌞',
      catalunya: '🏛️'
    };
    return flags[paisId] || '🌍';
  },

  agregarEventosBotones: function(paisId) {
    const botones = document.querySelectorAll('.info-btn');
    botones.forEach(btn => {
      btn.removeEventListener('click', this.handleBotonClick);
      btn.addEventListener('click', this.handleBotonClick.bind(this, paisId));
    });
  },

  handleBotonClick: function(paisId, event) {
    const seccion = event.currentTarget.dataset.seccion;
    alert(`Mostrando detalles de ${seccion} para ${paisId} (próximamente)`);
    // Aquí después se cargará contenido dinámico
  }
};

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  UIPanelInfo.init();
});

window.UIPanelInfo = UIPanelInfo;
