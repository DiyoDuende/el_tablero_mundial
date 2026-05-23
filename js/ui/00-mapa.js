// ============================================
// 🌍 TABLERO MUNDIAL
// 00-mapa.js
// VERSIÓN LIMPIA Y DINÁMICA
// SIN MARCADORES FIJOS
// ============================================

const MapaMundial = {

    map: null,

    marcadorBusqueda: null,

    // ============================================
    // INICIALIZAR
    // ============================================

    init: function () {

        console.log('🗺️ Inicializando mapa...');

        // Evitar doble inicialización
        if (this.map) {

            this.map.remove();

            this.map = null;
        }

        // ============================================
        // CREAR MAPA
        // ============================================

        this.map = L.map('mapa-mundial', {

            zoomControl: true,

            minZoom: 2,

            maxZoom: 18

        }).setView([20, 0], 2);

        // ============================================
        // CAPA BASE
        // ============================================

        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                attribution:
                    '© OpenStreetMap contributors'
            }
        ).addTo(this.map);

        // ============================================
        // MAPA LISTO
        // ============================================

        this.map.whenReady(() => {

            console.log('✅ Mapa listo');

            setTimeout(() => {

                this.map.invalidateSize();

            }, 300);
        });

        // ============================================
        // RESPONSIVE
        // ============================================

        window.addEventListener('resize', () => {

            if (!this.map) return;

            setTimeout(() => {

                this.map.invalidateSize();

            }, 200);
        });
    },

    // ============================================
    // BUSCAR LUGAR
    // ============================================

    buscarLugar: async function (texto) {

        if (!texto) return;

        console.log(`🔍 Buscando: ${texto}`);

        try {

            const url =
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(texto)}`;

            const response = await fetch(url);

            const resultados =
                await response.json();

            if (!resultados || !resultados.length) {

                console.warn(
                    '⚠️ No se encontraron resultados'
                );

                return;
            }

            const lugar = resultados[0];

            const lat =
                parseFloat(lugar.lat);

            const lon =
                parseFloat(lugar.lon);

            // ============================================
            // MOVER MAPA
            // ============================================

            this.map.flyTo(
                [lat, lon],
                8,
                {
                    duration: 1.5
                }
            );

            // ============================================
            // ELIMINAR MARCADOR ANTERIOR
            // ============================================

            if (this.marcadorBusqueda) {

                this.map.removeLayer(
                    this.marcadorBusqueda
                );
            }

            // ============================================
            // NUEVO MARCADOR
            // ============================================

            this.marcadorBusqueda =
                L.marker([lat, lon])
                    .addTo(this.map)
                    .bindPopup(
                        `📍 ${lugar.display_name}`
                    )
                    .openPopup();

            // ============================================
            // PANEL INFO
            // ============================================

            if (
                window.UIPanelInfo &&
                typeof UIPanelInfo.mostrarPais === 'function'
            ) {

                UIPanelInfo.mostrarPais(
                    texto.toLowerCase()
                );
            }

        } catch (error) {

            console.error(
                '❌ Error buscando lugar:',
                error
            );
        }
    },

    // ============================================
    // CAPAS
    // ============================================

    activarCapa: function (
        capa,
        activa
    ) {

        console.log(
            `🧩 Capa ${capa}: ${
                activa
                    ? 'ACTIVADA'
                    : 'DESACTIVADA'
            }`
        );

        // Preparado para futuras capas
    }
};

// ============================================
// EXPORT GLOBAL
// ============================================

window.MapaMundial = MapaMundial;
