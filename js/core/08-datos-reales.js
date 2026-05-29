// js/core/08-datos-reales.js
const DatosReales = {
    // Almacenamiento en caché para no sobrecargar la API
    cache: {},
    CACHE_DURACION: 3600000, // 1 hora

    // Mapeo de nombres de países (los que devuelve el GeoJSON) a códigos ISO3
    iso3Map: {
        'Spain': 'ESP', 'France': 'FRA', 'Germany': 'DEU', 'Italy': 'ITA',
        'Portugal': 'PRT', 'United States': 'USA', 'China': 'CHN', 'Russia': 'RUS',
        'Brazil': 'BRA', 'India': 'IND', 'Japan': 'JPN', 'Canada': 'CAN',
        'Mexico': 'MEX', 'Australia': 'AUS', 'South Africa': 'ZAF',
        'United Kingdom': 'GBR', 'Netherlands': 'NLD', 'Sweden': 'SWE', 'Norway': 'NOR'
    },

    async obtenerPIBPerCapita() {
        const clave = 'gdp_per_capita';
        if (this.cache[clave] && (Date.now() - this.cache[clave].timestamp) < this.CACHE_DURACION) {
            console.log('📊 Usando caché de GDP');
            return this.cache[clave].data;
        }

        const url = 'https://api.worldbank.org/v2/country/all/indicator/NY.GDP.PCAP.CD?format=json&per_page=300';
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            const records = data[1];
            const result = {};
            for (const record of records) {
                const iso3 = record.country.id;
                const value = record.value;
                if (iso3 && value !== null && !isNaN(value) && value > 0) {
                    const nombrePais = this.iso3ANombre(iso3);
                    if (nombrePais) result[nombrePais] = value;
                }
            }
            this.cache[clave] = { data: result, timestamp: Date.now() };
            console.log('🌍 GDP real cargado desde API del Banco Mundial');
            return result;
        } catch (error) {
            console.error('❌ Error obteniendo GDP:', error);
            return {};
        }
    },

    iso3ANombre(iso3) {
        for (const [nombre, codigo] of Object.entries(this.iso3Map)) {
            if (codigo === iso3) return nombre;
        }
        return null;
    },

    async obtenerValoresParaCapa() {
        return await this.obtenerPIBPerCapita();
    }
};

window.DatosReales = DatosReales;
