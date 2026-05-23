// js/ui/01-panel-info.js
const UIPanelInfo = {
    paisActual: 'españa',

    init: function() {
        console.log('UIPanelInfo iniciado (solo una vez)');
        document.querySelectorAll('.info-btn').forEach(btn => {
            btn.removeEventListener('click', this.handleClick);
            btn.addEventListener('click', this.handleClick.bind(this));
        });
    },

    handleClick: function(e) {
        const seccion = e.currentTarget.dataset.seccion;
        if (seccion) this.mostrarSeccion(seccion);
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
        this.init(); // reconectar botones
    },

    mostrarSeccion: function(seccion) {
        const container = document.getElementById('dashboard-container');
        if (!container) return;
        container.innerHTML = `
            <div class="dashboard-seccion">
                <h4>${seccion.toUpperCase()} de ${this.paisActual}</h4>
                <p>Información de ejemplo</p>
                <button class="btn-volver">◀ Volver</button>
            </div>
        `;
        const btn = container.querySelector('.btn-volver');
        if (btn) btn.addEventListener('click', () => this.mostrarPais(this.paisActual));
    }
};

window.UIPanelInfo = UIPanelInfo;
