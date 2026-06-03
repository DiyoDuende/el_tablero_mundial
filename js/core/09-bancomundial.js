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
        const url = this.baseURL + '/' + iso3 + '/indicator/NY.GDP.PCAP.CD?format=json&per_page=10';
        try {
            const respuesta = await fetch(url);
            const datos = await respuesta.json();
            if (!datos[1]) return null;
            for (var i = 0; i < datos[1].length; i++) {
                var item = datos[1][i];
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
        const url = this.baseURL + '/' + iso3 + '/indicator/FP.CPI.TOTL.ZG?format=json&per_page=10';
        try {
            const respuesta = await fetch(url);
            const datos = await respuesta.json();
            if (!datos[1]) return null;
            for (var i = 0; i < datos[1].length; i++) {
                var item = datos[1][i];
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
        const url = this.baseURL + '/' + iso3 + '/indicator/SL.UEM.TOTL.ZS?format=json&per_page=10';
        try {
            const respuesta = await fetch(url);
            const datos = await respuesta.json();
            if (!datos[1]) return null;
            for (var i = 0; i < datos[1].length; i++) {
                var item = datos[1][i];
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
        const url = this.baseURL + '/' + iso3 + '/indicator/SP.POP.TOTL?format=json&per_page=10';
        try {
            const respuesta = await fetch(url);
            const datos = await respuesta.json();
            if (!datos[1]) return null;
            for (var i = 0; i < datos[1].length; i++) {
                var item = datos[1][i];
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
        const url = this.baseURL + '/' + iso3 + '/indicator/GC.DOD.TOTL.GD.ZS?format=json&per_page=10';
        try {
            const respuesta = await fetch(url);
            const datos = await respuesta.json();
            if (!datos[1]) return null;
            for (var i = 0; i < datos[1].length; i++) {
                var item = datos[1][i];
                if (item.value !== null) {
                    return { valor: item.value, año: item.date, unidad: '% PIB' };
                }
            }
            return null;
        } catch (error) {
            return null;
        }
    },
    
    // NUEVOS INDICADORES SOCIALES (sin optional chaining)
    async getDensidadPoblacion(iso3) {
        const url = this.baseURL + '/' + iso3 + '/indicator/EN.POP.DNST?format=json&per_page=10';
        try {
            const respuesta = await fetch(url);
            const datos = await respuesta.json();
            if (!datos[1]) return null;
            for (var i = 0; i < datos[1].length; i++) {
                var item = datos[1][i];
                if (item.value !== null) {
                    return { valor: item.value, año: item.date, unidad: 'hab/km²' };
                }
            }
            return null;
        } catch (error) {
            return null;
        }
    },
    
    async getEsperanzaVida(iso3) {
        const url = this.baseURL + '/' + iso3 + '/indicator/SP.DYN.LE00.IN?format=json&per_page=10';
        try {
            const respuesta = await fetch(url);
            const datos = await respuesta.json();
            if (!datos[1]) return null;
            for (var i = 0; i < datos[1].length; i++) {
                var item = datos[1][i];
                if (item.value !== null) {
                    return { valor: item.value, año: item.date, unidad: 'años' };
                }
            }
            return null;
        } catch (error) {
            return null;
        }
    },
    
    async getTodosIndicadores(iso3) {
        var pib = await this.getPIBPerCapita(iso3);
        var inflacion = await this.getInflacion(iso3);
        var desempleo = await this.getDesempleo(iso3);
        var poblacion = await this.getPoblacion(iso3);
        var deuda = await this.getDeudaPublica(iso3);
        var densidad = await this.getDensidadPoblacion(iso3);
        var esperanzaVida = await this.getEsperanzaVida(iso3);
        
        return { 
            iso3: iso3, 
            pib: pib, 
            inflacion: inflacion, 
            desempleo: desempleo, 
            poblacion: poblacion, 
            deuda: deuda,
            densidad: densidad,
            esperanzaVida: esperanzaVida,
            ultimaActualizacion: new Date().toISOString() 
        };
    },
    
    isSoportado: function(iso3) {
        return this.paisesSoportados.hasOwnProperty(iso3);
    }
};

window.APIBancoMundial = APIBancoMundial;
