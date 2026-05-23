// ============================================
// 🌍 TABLERO MUNDIAL
// 00-mapa.js
// MAPA GLOBAL DINÁMICO
// ============================================

const MapaMundial = {

    map: null,

    marcadorBusqueda: null,

    // ============================================
    // INIT
    // ============================================

    init: function () {

        console.log('🗺️ Inicializando mapa...');

        // Evitar doble init
        if (this.map) {

            this.map.remove();

            this.map = null;
        }

        // Crear mapa
        this.map = L.map('mapa-mundial', {

            zoomControl: true,

            minZoom: 2,

            maxZoom: 18

        }).setView([20, 0], 2);

        // OpenStreetMap
        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                attribution:
                    '© OpenStreetMap contributors'
            }
        ).addTo(this.map);

        // Ready
        this.map.whenReady(() => {

            console.log('✅ Mapa listo');

            setTimeout(() => {

                this.map.invalidateSize();

            }, 300);
        });

        // Resize
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

            const response =
                await fetch(url);

            const resultados =
                await response.json();

            if (!resultados.length) {

                console.warn(
                    '⚠️ Lugar no encontrado'
                );

                return;
            }

            const lugar = resultados[0];

            const lat =
                parseFloat(lugar.lat);

            const lon =
                parseFloat(lugar.lon);

            // Ir al lugar
            this.map.flyTo(
                [lat, lon],
                8,
                {
                    duration: 1.5
                }
            );

            // Borrar marcador anterior
            if (this.marcadorBusqueda) {

                this.map.removeLayer(
                    this.marcadorBusqueda
                );
            }

            // Crear marcador nuevo
            this.marcadorBusqueda =
                L.marker([lat, lon])
                    .addTo(this.map)
                    .bindPopup(
                        `📍 ${lugar.display_name}`
                    )
                    .openPopup();

            console.log(
                `✅ Lugar encontrado: ${lugar.display_name}`
            );

            // Actualizar panel info
            if (
                window.UIPanelInfo &&
                typeof UIPanelInfo.mostrarPais === 'function'
            ) {

                UIPanelInfo.mostrarPais(texto);
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
                    ? 'ACTIVA'
                    : 'INACTIVA'
            }`
        );

        // Preparado para futuras capas
    }
};

// Export global
window.MapaMundial = MapaMundial;
