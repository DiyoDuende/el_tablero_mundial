// ============================================
// MAPA GLOBAL DE RELACIONES - Versión completa
// ============================================
const UIRelacionesGlobales = {
  visible: false,
  init: function() {
    document.getElementById('btn-cerrar-relaciones-globales').addEventListener('click', () => {
      this.toggle();
    });
    document.getElementById('btn-relaciones-globales').addEventListener('click', () => {
      this.mostrar();
      this.cargarDatos();
    });
  },
  toggle: function() {
    const panel = document.getElementById('relaciones-globales-panel');
    this.visible = !this.visible;
    panel.style.display = this.visible ? 'block' : 'none';
  },
  mostrar: function() {
    const panel = document.getElementById('relaciones-globales-panel');
    this.visible = true;
    panel.style.display = 'block';
  },
  cargarDatos: function() {
    const relaciones = {
      españa: {
        conexiones: {
          gobiernos: ['Francia', 'Portugal', 'Alemania', 'Italia'],
          empresas: ['Iberdrola', 'Repsol', 'Telefónica', 'Santander'],
          organizaciones: ['UE', 'OTAN', 'ONU', 'G20']
        }
      }
    };
    let html = `
      <div class="relaciones-visual">
        <h4>🇪🇸 España</h4>
        <div class="conexiones-grid">
          <div class="conexion-grupo">
            <h5>🏛️ Gobiernos</h5>
            ${relaciones.españa.conexiones.gobiernos.map(g => `<span class="conexion-tag">${g}</span>`).join('')}
          </div>
          <div class="conexion-grupo">
            <h5>💼 Empresas</h5>
            ${relaciones.españa.conexiones.empresas.map(e => `<span class="conexion-tag">${e}</span>`).join('')}
          </div>
          <div class="conexion-grupo">
            <h5>🤝 Organizaciones</h5>
            ${relaciones.españa.conexiones.organizaciones.map(o => `<span class="conexion-tag">${o}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
    document.getElementById('relaciones-contenido').innerHTML = html;
  }
};

window.UIRelacionesGlobales = UIRelacionesGlobales;
