// js/ui/01-panel-info.js

const UIPanelInfo = {

paisActual: 'espana',

// ============================================
// INICIO
// ============================================

init: function () {
    console.log('✅ UIPanelInfo iniciado');
},

// ============================================
// MOSTRAR PAÍS
// ============================================

mostrarPais: function (paisId) {

    this.paisActual = paisId;

    const container = document.getElementById('panel-info');

    if (!container) return;

    const nombreMostrar =
        paisId === 'espana'
            ? 'España'
            : paisId.toUpperCase();

    container.innerHTML = `
        <div class="dashboard-pais">

            <div class="info-header">
                <h3>🌍 ${nombreMostrar}</h3>
                <span class="pais-estado">🟢 ESTABLE</span>
            </div>

            <div class="info-botones">
                <button class="info-btn" data-seccion="economia">
                    📊 Economía
                </button>

                <button class="info-btn" data-seccion="leyes">
                    ⚖️ Leyes
                </button>

                <button class="info-btn" data-seccion="geopolitica">
                    🏛️ Geopolítica
                </button>

                <button class="info-btn" data-seccion="social">
                    👥 Social
                </button>

                <button class="info-btn" data-seccion="clima">
                    🌍 Clima
                </button>
            </div>

            <div class="info-mas-info">

                <button
                    id="btn-mas-info"
                    class="btn-mas-info"
                >
                    📋 Ver ficha completa del país
                </button>

                <div
                    id="panel-mas-info"
                    class="panel-mas-info"
                    style="display:none;"
                ></div>

            </div>

        </div>
    `;

    this.reInicializarEventos();
},

// ============================================
// MOSTRAR SECCIONES
// ============================================

mostrarSeccion: function (seccion) {

    const container = document.getElementById('panel-info');

    if (!container) return;

    let contenido = '';

    switch (seccion) {

        case 'economia':

            contenido = `
                <div class="dashboard-seccion">

                    <h4>
                        📊 Datos económicos de
                        ${this.paisActual.toUpperCase()}
                    </h4>

                    <p>
                        <strong>PIB:</strong>
                        <span id="dato-pib">Cargando...</span>
                    </p>

                    <p>
                        <strong>Inflación:</strong>
                        <span id="dato-inflacion">Cargando...</span>
                    </p>

                    <p>
                        <strong>Deuda / PIB:</strong>
                        <span id="dato-deuda">Cargando...</span>
                    </p>

                    <p>
                        <strong>Desempleo:</strong>
                        <span id="dato-desempleo">Cargando...</span>
                    </p>

                    <button class="btn-volver">
                        ◀ Volver
                    </button>

                </div>
            `;

            break;

        case 'leyes':

            contenido = `
                <div class="dashboard-seccion">

                    <h4>
                        ⚖️ Leyes destacadas de
                        ${this.paisActual.toUpperCase()}
                    </h4>

                    <ul>
                        <li>Ley de Transición Energética</li>
                        <li>Reforma Sanitaria</li>
                        <li>Ley de Soberanía Digital</li>
                    </ul>

                    <button class="btn-volver">
                        ◀ Volver
                    </button>

                </div>
            `;

            break;

        case 'geopolitica':

            contenido = `
                <div class="dashboard-seccion">

                    <h4>
                        🏛️ Situación geopolítica
                    </h4>

                    <p>
                        Relaciones diplomáticas estables.
                    </p>

                    <p>
                        Participación en alianzas internacionales.
                    </p>

                    <button class="btn-volver">
                        ◀ Volver
                    </button>

                </div>
            `;

            break;

        case 'social':

            contenido = `
                <div class="dashboard-seccion">

                    <h4>
                        👥 Indicadores sociales
                    </h4>

                    <p>Sanidad pública: Alta</p>
                    <p>Educación: Alta</p>
                    <p>Seguridad: Media</p>

                    <button class="btn-volver">
                        ◀ Volver
                    </button>

                </div>
            `;

            break;

        case 'clima':

            contenido = `
                <div class="dashboard-seccion">

                    <h4>
                        🌍 Datos climáticos
                    </h4>

                    <p>Temperatura media: 16°C</p>
                    <p>Emisiones CO₂: Moderadas</p>
                    <p>Renovables: En crecimiento</p>

                    <button class="btn-volver">
                        ◀ Volver
                    </button>

                </div>
            `;

            break;

        default:

            contenido = `
                <div class="dashboard-seccion">

                    <h4>${seccion}</h4>

                    <p>
                        Información no disponible.
                    </p>

                    <button class="btn-volver">
                        ◀ Volver
                    </button>

                </div>
            `;
    }

    container.innerHTML = contenido;

    // ============================================
    // CARGAR DATOS ECONÓMICOS
    // ============================================

    if (seccion === 'economia') {
        this.cargarDatosEconomicosReales();
    }

    // ============================================
    // BOTÓN VOLVER
    // ============================================

    const btnVolver = container.querySelector('.btn-volver');

    if (btnVolver) {
        btnVolver.addEventListener('click', () => {
            this.mostrarPais(this.paisActual);
        });
    }
},

// ============================================
// DATOS ECONÓMICOS
// ============================================

cargarDatosEconomicosReales: function () {

    const datos = {

        espana: {
            pib: '1,58 billones USD',
            inflacion: '2,8%',
            deuda: '107%',
            desempleo: '11,6%'
        },

        francia: {
            pib: '3,1 billones USD',
            inflacion: '2,3%',
            deuda: '111%',
            desempleo: '7,5%'
        },

        alemania: {
            pib: '4,5 billones USD',
            inflacion: '2,1%',
            deuda: '66%',
            desempleo: '5,7%'
        }
    };

    const pais =
        datos[this.paisActual] || datos.espana;

    const pib =
        document.getElementById('dato-pib');

    const inflacion =
        document.getElementById('dato-inflacion');

    const deuda =
        document.getElementById('dato-deuda');

    const desempleo =
        document.getElementById('dato-desempleo');

    if (pib) pib.textContent = pais.pib;

    if (inflacion)
        inflacion.textContent = pais.inflacion;

    if (deuda)
        deuda.textContent = pais.deuda;

    if (desempleo)
        desempleo.textContent = pais.desempleo;
},

// ============================================
// EVENTOS
// ============================================

reInicializarEventos: function () {

    // BOTONES SECCIONES

    document
        .querySelectorAll('.info-btn')
        .forEach(btn => {

            btn.addEventListener('click', () => {

                const seccion =
                    btn.dataset.seccion;

                this.mostrarSeccion(seccion);
            });
        });

    // BOTÓN MÁS INFO

    const btnMasInfo =
        document.getElementById('btn-mas-info');

    if (btnMasInfo) {

        btnMasInfo.addEventListener('click', () => {

            this.mostrarInformacionDetallada();
        });
    }

    // TABS

    document
        .querySelectorAll('.mas-info-tab')
        .forEach(tab => {

            tab.addEventListener('click', () => {

                const tabId =
                    tab.dataset.tab;

                this.cambiarTab(tabId);
            });
        });

    // BOTÓN CERRAR

    const btnCerrar =
        document.getElementById(
            'btn-cerrar-mas-info'
        );

    if (btnCerrar) {

        btnCerrar.addEventListener('click', () => {

            this.cerrarInfoDetallada();
        });
    }
},

// ============================================
// CERRAR PANEL
// ============================================

cerrarInfoDetallada: function () {

    const panel =
        document.getElementById(
            'panel-mas-info'
        );

    if (panel) {
        panel.style.display = 'none';
    }
},

// ============================================
// CAMBIAR TABS
// ============================================

cambiarTab: function (tabId) {

    document
        .querySelectorAll('.mas-info-tab')
        .forEach(tab => {
            tab.classList.remove('active');
        });

    document
        .querySelectorAll('.mas-info-panel')
        .forEach(panel => {
            panel.classList.remove('active');
        });

    const tabActivo =
        document.querySelector(
            `.mas-info-tab[data-tab="${tabId}"]`
        );

    const panelActivo =
        document.querySelector(
            `.mas-info-panel[data-panel="${tabId}"]`
        );

    if (tabActivo) {
        tabActivo.classList.add('active');
    }

    if (panelActivo) {
        panelActivo.classList.add('active');
    }
},

// ============================================
// MOSTRAR INFORMACIÓN DETALLADA
// ============================================

async mostrarInformacionDetallada() {

    const panel =
        document.getElementById(
            'panel-mas-info'
        );

    if (!panel) return;

    if (panel.style.display === 'block') {

        panel.style.display = 'none';

        return;
    }

    panel.style.display = 'block';

    panel.innerHTML = `
        <div class="mas-info-loading">
            🔄 Cargando datos...
        </div>
    `;

    const info =
        await this.obtenerInformacionCompleta();

    panel.innerHTML =
        this.generarHTMLInformacionDetallada(info);

    this.reInicializarEventos();
},

// ============================================
// DATOS COMPLETOS
// ============================================

async obtenerInformacionCompleta() {

    return {

        pais: this.paisActual,

        economia: {
            pib: 1420,
            pib_percapita: 29800,
            inflacion: 2.8,
            deuda: 118,
            desempleo: 11.2,
            balanza_comercial: -4.2
        },

        demografia: {
            poblacion: 48400000,
            densidad: 94,
            esperanza_vida: 83.5,
            urbanizacion: 80
        },

        energia: {
            consumo_electrico: 250,
            renovables: 45,
            dependencia_exterior: 73
        },

        fuentes: [
            'INE',
            'Eurostat',
            'Banco Mundial',
            'Banco de España'
        ]
    };
},

// ============================================
// HTML PANEL COMPLETO
// ============================================

generarHTMLInformacionDetallada: function (info) {

    return `
        <div class="mas-info-header">

            <h4>
                📋 FICHA COMPLETA ·
                ${info.pais.toUpperCase()}
            </h4>

            <button
                class="btn-cerrar-mas-info"
                id="btn-cerrar-mas-info"
            >
                ✕
            </button>

        </div>

        <div class="mas-info-tabs">

            <button
                class="mas-info-tab active"
                data-tab="economia"
            >
                💰 Economía
            </button>

            <button
                class="mas-info-tab"
                data-tab="demografia"
            >
                👥 Demografía
            </button>

            <button
                class="mas-info-tab"
                data-tab="energia"
            >
                ⚡ Energía
            </button>

            <button
                class="mas-info-tab"
                data-tab="fuentes"
            >
                📚 Fuentes
            </button>

        </div>

        <div class="mas-info-contenido">

            <div
                class="mas-info-panel active"
                data-panel="economia"
            >

                <table class="info-detalle-tabla">

                    <tr>
                        <td>PIB:</td>
                        <td>${info.economia.pib} M€</td>
                    </tr>

                    <tr>
                        <td>PIB per cápita:</td>
                        <td>
                            ${info.economia.pib_percapita} €
                        </td>
                    </tr>

                    <tr>
                        <td>Inflación:</td>
                        <td>
                            ${info.economia.inflacion}%
                        </td>
                    </tr>

                    <tr>
                        <td>Deuda:</td>
                        <td>
                            ${info.economia.deuda}%
                        </td>
                    </tr>

                </table>

            </div>

            <div
                class="mas-info-panel"
                data-panel="demografia"
            >

                <table class="info-detalle-tabla">

                    <tr>
                        <td>Población:</td>
                        <td>
                            ${info.demografia.poblacion}
                        </td>
                    </tr>

                    <tr>
                        <td>Densidad:</td>
                        <td>
                            ${info.demografia.densidad}
                        </td>
                    </tr>

                </table>

            </div>

            <div
                class="mas-info-panel"
                data-panel="energia"
            >

                <table class="info-detalle-tabla">

                    <tr>
                        <td>Renovables:</td>
                        <td>
                            ${info.energia.renovables}%
                        </td>
                    </tr>

                </table>

            </div>

            <div
                class="mas-info-panel"
                data-panel="fuentes"
            >

                <ul class="fuentes-lista">

                    ${info.fuentes
                        .map(
                            f => `<li>📄 ${f}</li>`
                        )
                        .join('')}

                </ul>

            </div>

        </div>

        <div class="mas-info-footer">

            <small>
                🔄 Datos actualizados:
                ${new Date().toLocaleDateString()}
            </small>

        </div>
    `;
}

};

window.UIPanelInfo = UIPanelInfo;
