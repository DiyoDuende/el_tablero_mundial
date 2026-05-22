// ============================================
// MAPA MUNDIAL (Leaflet)
// ============================================

const MapaMundial = {

    map: null,
    capas: {},
    markers: [],

    init: function () {

        console.log('🗺️ Inicializando mapa...');

        // Evitar doble inicialización
        if (this.map) {
            this.map.remove();
        }

        // Crear mapa
        this.map = L.map('mapa-mundial', {
            zoomControl: true,
            minZoom: 2,
            maxZoom: 18
        }).setView([20, 0], 2);

        // Capa base OpenStreetMap
        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                attribution: '© OpenStreetMap'
            }
        ).addTo(this.map);

        // Cargar países
        this.cargarPaises();

        // Esperar a que el mapa esté listo
        this.map.whenReady(() => {

            console.log('✅ Mapa listo');

            this.irAPais('espana');

            // Corregir tamaño en móviles
            setTimeout(() => {
                this.map.invalidateSize();
            }, 300);
        });

        // Reajustar si cambia tamaño ventana
        window.addEventListener('resize', () => {
            if (this.map) {
                this.map.invalidateSize();
            }
        });
    },

    cargarPaises: function () {

        const paises = [

            {
                id: 'espana',
                nombre: 'España',
                coords: [40.4, -3.7]
            },

            {
                id: 'barcelona',
                nombre: 'Barcelona',
                coords: [41.3851, 2.1734]
            },

            {
                id: 'sevilla',
                nombre: 'Sevilla',
                coords: [37.3891, -5.9845]
            },

            {
                id: 'valencia',
                nombre: 'Valencia',
                coords: [39.4699, -0.3763]
            },

            {
                id: 'bilbao',
                nombre: 'Bilbao',
                coords: [43.2630, -2.9350]
            },

            {
                id: 'francia',
                nombre: 'Francia',
                coords: [46.6, 2.4]
            },

            {
                id: 'portugal',
                nombre: 'Portugal',
                coords: [39.5, -8.0]
            },

            {
                id: 'alemania',
                nombre: 'Alemania',
                coords: [51.1, 10.5]
            },

            {
                id: 'italia',
                nombre: 'Italia',
                coords: [41.9, 12.5]
            },

            {
                id: 'eeuu',
                nombre: 'EEUU',
                coords: [39.8, -98.5]
            },

            {
                id: 'china',
                nombre: 'China',
                coords: [35.8, 104.1]
            }
        ];

        paises.forEach(pais => {

            const marker = L.circleMarker(pais.coords, {
                radius: 8,
                color: '#4fc3f7',
                fillColor: '#2a7faa',
                fillOpacity: 0.8,
                weight: 2
            }).addTo(this.map);

            // Tooltip
            marker.bindTooltip(pais.nombre);

            // Click
            marker.on('click', () => {
                this.irAPais(pais.id);
            });

            this.markers.push(marker);
        });
    },

    irAPais: function (paisId) {

        const paises = {

            espana: {
                centro: [40.4, -3.7],
                zoom: 6
            },

            barcelona: {
                centro: [41.3851, 2.1734],
                zoom: 9
            },

            sevilla: {
                centro: [37.3891, -5.9845],
                zoom: 9
            },

            valencia: {
                centro: [39.4699, -0.3763],
                zoom: 9
            },

            bilbao: {
                centro: [43.2630, -2.9350],
                zoom: 9
            },

            francia: {
                centro: [46.6, 2.4],
                zoom: 5
            },

            portugal: {
                centro: [39.5, -8.0],
                zoom: 6
            },

            alemania: {
                centro: [51.1, 10.5],
                zoom: 5
            },

            italia: {
                centro: [41.9, 12.5],
                zoom: 5
            },

            eeuu: {
                centro: [39.8, -98.5],
                zoom: 4
            },

            china: {
                centro: [35.8, 104.1],
                zoom: 4
            }
        };

        const destino = paises[paisId];

        if (!destino) {
            console.warn(`⚠️ País no encontrado: ${paisId}`);
            return;
        }

        // Movimiento suave
        this.map.flyTo(
            destino.centro,
            destino.zoom,
            {
                duration: 1.5
            }
        );

        // Actualizar panel lateral
        if (window.UIPanelInfo && UIPanelInfo.mostrarPais) {
            UIPanelInfo.mostrarPais(paisId);
        }
    },

    activarCapa: function (capa, activa) {

        console.log(
            `Capa ${capa} ${activa ? 'activada' : 'desactivada'}`
        );

        // Preparado para futuras capas GeoJSON
    }
};

window.MapaMundial = MapaMundial;
