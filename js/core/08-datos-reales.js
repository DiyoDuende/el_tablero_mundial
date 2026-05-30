// js/core/08-datos-reales.js
const DatosReales = {
    cache: {},
    CACHE_DURACION: 3600000, // 1 hora

    // Mapeo de nombres de países (GeoJSON) a códigos ISO3
    iso3Map: {
        'Spain': 'ESP', 'France': 'FRA', 'Germany': 'DEU', 'Italy': 'ITA',
        'Portugal': 'PRT', 'United States': 'USA', 'China': 'CHN', 'Russia': 'RUS',
        'Brazil': 'BRA', 'India': 'IND', 'Japan': 'JPN', 'Canada': 'CAN',
        'Mexico': 'MEX', 'Australia': 'AUS', 'South Africa': 'ZAF',
        'United Kingdom': 'GBR', 'Netherlands': 'NLD', 'Sweden': 'SWE', 'Norway': 'NOR',
        'Switzerland': 'CHE', 'Argentina': 'ARG', 'Chile': 'CHL', 'Colombia': 'COL',
        'Peru': 'PER', 'Venezuela': 'VEN', 'Egypt': 'EGY', 'Nigeria': 'NGA',
        'Kenya': 'KEN', 'Indonesia': 'IDN', 'Pakistan': 'PAK', 'Bangladesh': 'BGD',
        'Vietnam': 'VNM', 'Thailand': 'THA', 'Malaysia': 'MYS', 'Philippines': 'PHL',
        'Saudi Arabia': 'SAU', 'United Arab Emirates': 'ARE', 'Israel': 'ISR',
        'Turkey': 'TUR', 'South Korea': 'KOR', 'Poland': 'POL', 'Ukraine': 'UKR',
        'Romania': 'ROU', 'Greece': 'GRC', 'Austria': 'AUT', 'Belgium': 'BEL',
        'Czech Republic': 'CZE', 'Denmark': 'DNK', 'Finland': 'FIN', 'Hungary': 'HUN',
        'Ireland': 'IRL', 'Lithuania': 'LTU', 'Luxembourg': 'LUX', 'Slovakia': 'SVK',
        'Slovenia': 'SVN', 'Bulgaria': 'BGR', 'Croatia': 'HRV',
        // Países añadidos
        'New Zealand': 'NZL', 'Iceland': 'ISL', 'Morocco': 'MAR', 'Algeria': 'DZA',
        'Tunisia': 'TUN', 'Serbia': 'SRB', 'Belarus': 'BLR', 'Estonia': 'EST',
        'Latvia': 'LVA', 'Moldova': 'MDA', 'Uruguay': 'URY', 'Paraguay': 'PRY',
        'Bolivia': 'BOL', 'Ecuador': 'ECU', 'Costa Rica': 'CRI', 'Panama': 'PAN',
        'Cuba': 'CUB', 'Dominican Republic': 'DOM', 'Honduras': 'HND',
        'El Salvador': 'SLV', 'Nicaragua': 'NIC', 'Guatemala': 'GTM',
        'Jordan': 'JOR', 'Lebanon': 'LBN', 'Oman': 'OMN', 'Qatar': 'QAT',
        'Kuwait': 'KWT', 'Bahrain': 'BHR', 'Cyprus': 'CYP', 'Malta': 'MLT',
        'Albania': 'ALB', 'North Macedonia': 'MKD', 'Bosnia and Herzegovina': 'BIH',
        'Montenegro': 'MNE', 'Kosovo': 'XKX', 'Georgia': 'GEO', 'Armenia': 'ARM',
        'Azerbaijan': 'AZE', 'Kazakhstan': 'KAZ', 'Uzbekistan': 'UZB',
        'Turkmenistan': 'TKM', 'Tajikistan': 'TJK', 'Kyrgyzstan': 'KGZ',
        'Mongolia': 'MNG', 'Nepal': 'NPL', 'Sri Lanka': 'LKA', 'Myanmar': 'MMR',
        'Cambodia': 'KHM', 'Laos': 'LAO', 'Brunei': 'BRN', 'Fiji': 'FJI',
        'Papua New Guinea': 'PNG', 'Jamaica': 'JAM', 'Trinidad and Tobago': 'TTO',
        'Bahamas': 'BHS', 'Barbados': 'BRB', 'Mauritius': 'MUS', 'Seychelles': 'SYC',
        'Maldives': 'MDV', 'Iceland': 'ISL', 'Luxembourg': 'LUX', 'Monaco': 'MCO',
        'Liechtenstein': 'LIE', 'Andorra': 'AND', 'San Marino': 'SMR'
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
                // Guardar SOLO el primer valor encontrado (el más reciente)
                if (iso3 && value !== null && !isNaN(value) && value > 0 && !result[iso3]) {
                    const nombrePais = this.iso3ANombre(iso3);
                    if (nombrePais) result[nombrePais] = value;
                }
            }
            
            this.cache[clave] = { data: result, timestamp: Date.now() };
            console.log(`🌍 GDP real cargado: ${Object.keys(result).length} países desde API del Banco Mundial`);
            return result;
        } catch (error) {
            console.error('❌ Error obteniendo GDP:', error);
            return null;
        }
    },

    iso3ANombre(iso3) {
        for (const [nombre, codigo] of Object.entries(this.iso3Map)) {
            if (codigo === iso3) return nombre;
        }
        return null;
    },

    async obtenerValoresParaCapa() {
        const reales = await this.obtenerPIBPerCapita();
        if (reales && Object.keys(reales).length > 0) {
            console.log(`✅ Datos REALES del Banco Mundial: ${Object.keys(reales).length} países`);
            return { datos: reales, esReal: true };
        }
        console.log('⚠️ Usando datos SIMULADOS (fallback)');
        return { datos: null, esReal: false };
    }
};

window.DatosReales = DatosReales;
