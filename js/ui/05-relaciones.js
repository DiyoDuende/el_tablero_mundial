// ============================================
// MAPA DE RELACIONES - Versión simplificada
// ============================================
const UIRelaciones = {
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
      gobiernos: ['🇪🇸 España', '🇫🇷 Francia', '🇩🇪 Alemania', '🇺🇸 EEUU', '🇨🇳 China'],
      empresas: ['Iberdrola', 'Repsol', 'Telefónica', 'Santander', 'BBVA'],
      organizaciones: ['🇪🇺 UE', '🛡️ OTAN', '🌐 ONU', '💰 FMI']
    };
    let html = '<div class="relaciones-grid">';
    for (let [tipo, items] of Object.entries(relaciones)) {
      items.forEach(item => {
        html += `
          <div class="relaciones-entidad">
            <div class="entidad-icono">${item.includes('🇪') ? '🏛️' : '💼'}</div>
            <div class="entidad-nombre">${item}</div>
          </div>
        `;
      });
    }
    html += '</div>';
    document.getElementById('relaciones-contenido').innerHTML = html;
  }
};

window.UIRelaciones = UIRelaciones;
