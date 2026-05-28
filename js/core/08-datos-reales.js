// js/core/08-datos-reales.js
const DatosReales = {
    cache: {},
    CACHE_DURACION: 3600000, // 1 hora

    // Mapeo de nombres de países (GeoJSON) a códigos ISO3
    iso3Map: {
        'Spain': 'ESP', 'France': 'FRA', 'Germany': 'DEU', 'Italy': 'ITA',
        'Portugal': 'PRT', 'United States': 'USA', 'China': 'CHN', 'Russia': 'RUS',
        'Brazil': 'BRA', 'India': 'IND', 'Japan': 'JPN', 'Canada': 'CAN',
        'Mexico': 'MEX', 'Australia': 'AUS', 'South Africa': 'ZAF'
    },

    async obtenerPIBPerCapita() {
        const clave = 'gdp_per_capita';
        
        // Usar caché si está fresca
        if (this.cache[clave] && (Date.now() - this.cache[clave].timestamp) < this.CACHE_DURACION) {
            console.log('📊 Usando caché de GDP');
            return this.cache[clave].data;
        }

        const url = 'https://api.worldbank.org/v2/country/all/indicator/NY.GDP.PCAP.CD?format=json&per_page=300';
        
        try {
            const response = await fetch(url, {
                cache: 'no-store',
                headers: { 'Cache-Control': 'no-cache' }
            });
            
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
            // Devolver datos simulados para que la capa funcione aunque la API falle
            return this.obtenerPIBsimulado();
        }
    },

    obtenerPIBsimulado() {
        console.log('🎲 Usando PIB simulado (API no disponible)');
        return {
            'Spain': 29800, 'France': 42000, 'Germany': 51000, 'Italy': 35000,
            'Portugal': 23000, 'United States': 70000, 'China': 12000, 'Russia': 11500,
            'Brazil': 7500, 'India': 2100, 'Japan': 40000, 'Canada': 43000,
            'Mexico': 9000, 'Australia': 52000, 'South Africa': 6000
        };
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
