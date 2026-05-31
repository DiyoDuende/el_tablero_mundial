// js/core/09-bancomundial.js
// ============================================
// API BANCO MUNDIAL - Datos económicos reales
// ============================================

const APIBancoMundial = {
    baseURL: 'https://api.worldbank.org/v2/country',
    
    paisesSoportados: {
        'ESP': 'España', 'FRA': 'Francia', 'DEU': 'Alemania', 'ITA': 'Italia',
        'PRT': 'Portugal', 'GBR': 'Reino Unido', 'IRL': 'Irlanda', 'NLD': 'Países Bajos',
        'BEL': 'Bélgica', 'AUT': 'Austria', 'CHE': 'Suiza', 'SWE': 'Suecia',
        'NOR': 'Noruega', 'DNK': 'Dinamarca', 'FIN': 'Finlandia', 'POL': 'Polonia',
        'CZE': 'República Checa', 'HUN': 'Hungría', 'ROU': 'Rumanía', 'GRC': 'Grecia',
        'USA': 'Estados Unidos', 'CAN': 'Canadá', 'MEX': 'México',
        'BRA': 'Brasil', 'ARG': 'Argentina', 'CHL': 'Chile', 'COL': 'Colombia',
        'PER': 'Perú', 'VEN': 'Venezuela', 'URY': 'Uruguay', 'PRY': 'Paraguay',
        'CHN': 'China', 'JPN': 'Japón', 'KOR': 'Corea del Sur', 'IND': 'India',
        'IDN': 'Indonesia', 'TUR': 'Turquía', 'SAU': 'Arabia Saudí', 'RUS': 'Rusia',
        'AUS': 'Australia', 'NZL': 'Nueva Zelanda', 'ZAF': 'Sudáfrica', 'EGY': 'Egipto'
    },
    
    async getPIBPerCapita(iso3) {
        const url = `${this.baseURL}/${iso3}/indicator/NY.GDP.PCAP.CD?format=json&per_page=10`;
        try {
            const respuesta = await fetch(url);
            const datos = await respuesta.json();
            if (!datos[1]) return null;
            for (let item of datos[1]) {
                if (item.value !== null) {
                    return { valor: item.value, año: item.date, unidad: 'USD' };
                }
            }
            return null;
        } catch (error) {
            return null;
        }
    },
    
    async getInflacion(iso3) {
        const url = `${this.baseURL}/${iso3}/indicator/FP.CPI.TOTL.ZG?format=json&per_page=10`;
        try {
            const respuesta = await fetch(url);
            const datos = await respuesta.json();
            if (!datos[1]) return null;
            for (let item of datos[1]) {
                if (item.value !== null) {
                    return { valor: item.value, año: item.date, unidad: '%' };
                }
            }
            return null;
        } catch (error) {
            return null;
        }
    },
    
    async getDesempleo(iso3) {
        const url = `${this.baseURL}/${iso3}/indicator/SL.UEM.TOTL.ZS?format=json&per_page=10`;
        try {
            const respuesta = await fetch(url);
            const datos = await respuesta.json();
            if (!datos[1]) return null;
            for (let item of datos[1]) {
                if (item.value !== null) {
                    return { valor: item.value, año: item.date, unidad: '%' };
                }
            }
            return null;
        } catch (error) {
            return null;
        }
    },
    
    async getPoblacion(iso3) {
        const url = `${this.baseURL}/${iso3}/indicator/SP.POP.TOTL?format=json&per_page=10`;
        try {
            const respuesta = await fetch(url);
            const datos = await respuesta.json();
            if (!datos[1]) return null;
            for (let item of datos[1]) {
                if (item.value !== null) {
                    return { valor: item.value, año: item.date, unidad: 'habitantes' };
                }
            }
            return null;
        } catch (error) {
            return null;
        }
    },
    
    async getDeudaPublica(iso3) {
        const url = `${this.baseURL}/${iso3}/indicator/GC.DOD.TOTL.GD.ZS?format=json&per_page=10`;
        try {
            const respuesta = await fetch(url);
            const datos = await respuesta.json();
            if (!datos[1]) return null;
            for (let item of datos[1]) {
                if (item.value !== null) {
                    return { valor: item.value, año: item.date, unidad: '% PIB' };
                }
            }
            return null;
        } catch (error) {
            return null;
        }
    },
    
    async getTodosIndicadores(iso3) {
        const [pib, inflacion, desempleo, poblacion, deuda] = await Promise.all([
            this.getPIBPerCapita(iso3),
            this.getInflacion(iso3),
            this.getDesempleo(iso3),
            this.getPoblacion(iso3),
            this.getDeudaPublica(iso3)
        ]);
        return { iso3, pib, inflacion, desempleo, poblacion, deuda, ultimaActualizacion: new Date().toISOString() };
    },
    
    isSoportado(iso3) {
        return this.paisesSoportados.hasOwnProperty(iso3);
    }
};

window.APIBancoMundial = APIBancoMundial;
