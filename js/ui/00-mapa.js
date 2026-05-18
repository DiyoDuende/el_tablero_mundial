// ============================================================
// MAPA MUNDIAL (Leaflet) + Datos de ejemplo para pruebas
// ============================================================
const MapaMundial = {
    map: null,
    datosPaises: {
        ESP: { pib: 35000, poblacion: 47000000, desempleo: 11.2, deuda: 98, co2: 5.2, energia: 2500, esperanzaVida: 83, paroJuvenil: 28 },
        FRA: { pib: 42000, poblacion: 68000000, desempleo: 7.5, deuda: 112, co2: 4.8, energia: 3200, esperanzaVida: 82, paroJuvenil: 18 },
        PRT: { pib: 22000, poblacion: 10300000, desempleo: 6.8, deuda: 127, co2: 3.9, energia: 1800, esperanzaVida: 81, paroJuvenil: 22 },
        DEU: { pib: 48000, poblacion: 83000000, desempleo: 3.2, deuda: 68, co2: 8.5, energia: 3800, esperanzaVida: 81, paroJuvenil: 6 },
        ITA: { pib: 38000, poblacion: 60000000, desempleo: 9.0, deuda: 145, co2: 5.5, energia: 2700, esperanzaVida: 83, paroJuvenil: 24 },
        GBR: { pib: 45000, poblacion: 67000000, desempleo: 4.2, deuda: 97, co2: 5.0, energia: 2900, esperanzaVida: 81, paroJuvenil: 11 },
        USA: { pib: 63000, poblacion: 331000000, desempleo: 3.8, deuda: 130, co2: 14.7, energia: 7000, esperanzaVida: 79, paroJuvenil: 8 },
        CHN: { pib: 19000, poblacion: 1400000000, desempleo: 5.0, deuda: 60, co2: 7.0, energia: 3000, esperanzaVida: 77, paroJuvenil: 12 }
    },

    init: async function() {
        this.map = L.map('mapa-mundial').setView([20, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(this.map);
        await this.cargarMapa();
    },

    cargarMapa: async function() {
        const response = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson');
        const geojson = await response.json();
        L.geoJSON(geojson, {
            style: (feature) => this.estiloPais(feature),
            onEachFeature: (feature, layer) => this.onEachFeature(feature, layer)
        }).addTo(this.map);
    },

    estiloPais(feature) {
        const code = feature.properties?.ISO_A3;
        const pib = this.datosPaises[code]?.pib;
        let color = '#cccccc';
        if (pib) {
            if (pib > 50000) color = '#1b5e20';
            else if (pib > 30000) color = '#2e7d32';
            else if (pib > 15000) color = '#4caf50';
            else if (pib > 5000) color = '#ff9800';
            else color = '#d32f2f';
        }
        return {
            fillColor: color,
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.7
        };
    },

    onEachFeature(feature, layer) {
        const code = feature.properties?.ISO_A3;
        const nombre = feature.properties?.NAME || code;
        layer.bindTooltip(nombre);
        // AL HACER CLIC EN EL PAÍS, ACTUALIZAMOS EL PANEL
        layer.on('click', () => {
            if (window.UIPanelInfo) {
                window.UIPanelInfo.mostrarPais(code, nombre);
            }
        });
        // Popup rápido con el PIB si existe en los datos de ejemplo
        const datos = this.datosPaises[code] || {};
        const pib = datos.pib ? `$${datos.pib.toLocaleString()}` : 'Datos no disponibles';
        layer.bindPopup(`<strong>${nombre}</strong><br>💰 PIB per cápita: ${pib}`);
    }
};

window.MapaMundial = MapaMundial;
