const UIPanelInfo = {
    paisActual: 'españa',

    init: function() {
        console.log('Panel UI listo');
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.info-btn');
            if (btn) {
                e.preventDefault();
                const seccion = btn.dataset.seccion;
                if (seccion) this.mostrarSeccion(seccion);
            }
            const volver = e.target.closest('.btn-volver');
            if (volver) this.mostrarPais(this.paisActual);
        });
    },

    mostrarPais: function(paisId) {
        this.paisActual = paisId;
        const container = document.getElementById('dashboard-container');
        if (!container) return;
        container.innerHTML = `
            <div class="dashboard-pais">
                <h3>${paisId.toUpperCase()}</h3>
                <div class="info-botones">
                    <button class="info-btn" data-seccion="economia">📊 Economía</button>
                    <button class="info-btn" data-seccion="leyes">⚖️ Leyes</button>
                    <button class="info-btn" data-seccion="geopolitica">🏛️ Geopolítica</button>
                    <button class="info-btn" data-seccion="social">👥 Social</button>
                    <button class="info-btn" data-seccion="clima">🌍 Clima</button>
                </div>
            </div>
        `;
    },

    mostrarSeccion: function(seccion) {
        const container = document.getElementById('dashboard-container');
        if (!container) return;
        let contenido = '';
        switch(seccion) {
            case 'economia':
                contenido = '<h4>📊 Datos económicos</h4><p>PIB: +2.3%</p><p>Inflación: 2.1%</p><p>Deuda/PIB: 98%</p><p>Desempleo: 11.2%</p><button class="btn-volver">◀ Volver</button>';
                break;
            case 'leyes':
                contenido = '<h4>⚖️ Leyes destacadas</h4><ul><li>Ley de Transición Energética 2026</li><li>Reforma Sanitaria 2026</li></ul><button class="btn-volver">◀ Volver</button>';
                break;
            default:
                contenido = `<h4>${seccion}</h4><p>Información de ejemplo</p><button class="btn-volver">◀ Volver</button>`;
        }
        container.innerHTML = contenido;
    }
};
window.UIPanelInfo = UIPanelInfo;
