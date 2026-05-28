// js/core/08-datos-reales.js
const DatosReales = {
    cache: {},
    CACHE_DURACION: 3600000, // 1 hora

    iso3Map: {
        'Spain': 'ESP', 'France': 'FRA', 'Germany': 'DEU', 'Italy': 'ITA',
        'Portugal': 'PRT', 'United States': 'USA', 'China': 'CHN', 'Russia': 'RUS',
        'Brazil': 'BRA', 'India': 'IND', 'Japan': 'JPN', 'Canada': 'CAN',
        'Mexico': 'MEX', 'Australia': 'AUS', 'South Africa': 'ZAF',
        'Argentina': 'ARG', 'Chile': 'CHL', 'Colombia': 'COL', 'Peru': 'PER',
        'Venezuela': 'VEN', 'United Kingdom': 'GBR', 'Netherlands': 'NLD',
        'Sweden': 'SWE', 'Norway': 'NOR', 'Denmark': 'DNK', 'Finland': 'FIN',
        'Poland': 'POL', 'Turkey': 'TUR', 'Egypt': 'EGY', 'Nigeria': 'NGA',
        'Kenya': 'KEN', 'South Korea': 'KOR', 'Indonesia': 'IDN', 'Pakistan': 'PAK',
        'Bangladesh': 'BGD', 'Vietnam': 'VNM', 'Thailand': 'THA', 'Malaysia': 'MYS',
        'Philippines': 'PHL', 'Saudi Arabia': 'SAU', 'United Arab Emirates': 'ARE',
        'Israel': 'ISR', 'Iran': 'IRN', 'Iraq': 'IRQ', 'Afghanistan': 'AFG',
        'Ukraine': 'UKR', 'Belarus': 'BLR', 'Kazakhstan': 'KAZ', 'Uzbekistan': 'UZB'
    },

    async obtenerPIBPerCapita() {
        const clave = 'gdp_per_capita';
        if (this.cache[clave] && (Date.now() - this.cache[clave].timestamp) < this.CACHE_DURACION) {
            console.log('📊 Usando caché de GDP');
            return this.cache[clave].data;
        }

        const url = 'https://api.worldbank.org/v2/country/all/indicator/NY.GDP.PCAP.CD?format=json&per_page=300';
        try {
            const response = await fetch(url, {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            const data = await response.json();
            const records = data[1];
            const result = {};

            for (const record of records) {
                const iso3 = record.country.id;
                const value = record.value;
                if (iso3 && value !== null && !isNaN(value)) {
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

    async obtenerValorNormalizado(paisId) {
        const pibData = await this.obtenerPIBPerCapita();
        const pib = pibData[paisId] || 0;
        return Math.min(1, pib / 100000);
    },

    async obtenerValoresParaCapa() {
        return await this.obtenerPIBPerCapita();
    }
};

window.DatosReales = DatosReales;
