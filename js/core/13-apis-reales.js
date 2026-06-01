// js/core/13-apis-reales.js
// ============================================
// APIS REALES - Banco Mundial, INE, Eurostat
// ============================================

const APIsReales = {
    // 🏦 BANCO MUNDIAL API
    BancoMundial: {
        baseURL: 'https://api.worldbank.org/v2',
        
        async obtenerIndicador(pais, indicador) {
            try {
                const url = `${this.baseURL}/country/${pais}/indicator/${indicador}?format=json&per_page=1`;
                const response = await fetch(url);
                const data = await response.json();
                
                if (data[1] && data[1][0]) {
                    return {
                        valor: data[1][0].value,
                        anio: data[1][0].date,
                        fuente: 'Banco Mundial'
                    };
                }
                return null;
            } catch(e) {
                console.error('Error Banco Mundial:', e);
                return null;
            }
        },
        
        async getPIB(pais) {
            return this.obtenerIndicador(pais, 'NY.GDP.MKTP.CD');
        },
        
        async getInflacion(pais) {
            return this.obtenerIndicador(pais, 'FP.CPI.TOTL.ZG');
        },
        
        async getDesempleo(pais) {
            return this.obtenerIndicador(pais, 'SL.UEM.TOTL.ZS');
        },
        
        async getPoblacion(pais) {
            return this.obtenerIndicador(pais, 'SP.POP.TOTL');
        }
    },
    
    // 📊 INE (España)
    INE: {
        baseURL: 'https://servicios.ine.es/wstempus/js/ES',
        
        async obtenerDatos(nomen, datos) {
            try {
                const url = `${this.baseURL}/${nomen}/${datos}`;
                const response = await fetch(url);
                const data = await response.json();
                return data;
            } catch(e) {
                console.error('Error INE:', e);
                return null;
            }
        },
        
        async getPAROTemporalmente() {
            // 5.2 - Índice de Paro - España
            return this.obtenerDatos('5.2', 'all');
        },
        
        async getIPCTemporalmente() {
            // 6 - IPC - España
            return this.obtenerDatos('6', 'all');
        }
    },
    
    // 🇪🇺 EUROSTAT API
    Eurostat: {
        baseURL: 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data',
        
        async obtenerDatos(dataset, filtros = {}) {
            try {
                let url = `${this.baseURL}/${dataset}?format=JSON`;
                
                // Agregar filtros si existen
                Object.keys(filtros).forEach(key => {
                    url += `&${key}=${filtros[key]}`;
                });
                
                const response = await fetch(url);
                const data = await response.json();
                return data;
            } catch(e) {
                console.error('Error Eurostat:', e);
                return null;
            }
        },
        
        async getInflacionEuropa() {
            // prc_hicp_manr - Inflación HICP
            return this.obtenerDatos('prc_hicp_manr', {
                'filter': 'coicop=CP00'
            });
        },
        
        async getDesempleoEuropa() {
            // une_rt_m - Tasa de desempleo
            return this.obtenerDatos('une_rt_m');
        }
    },
    
    // 🌍 DATOS ABIERTOS ESPAÑA
    DatosGobEs: {
        baseURL: 'https://datos.gob.es/api',
        
        async buscarDataset(query) {
            try {
                const url = `${this.baseURL}/catalogo/datasets?q=${query}&limit=5`;
                const response = await fetch(url);
                const data = await response.json();
                return data;
            } catch(e) {
                console.error('Error datos.gob.es:', e);
                return null;
            }
        }
    },
    
    // 📈 OBTENER TODOS LOS DATOS DE UN PAÍS
    async obtenerTodosPais(iso3Code) {
        console.log(`🌐 Obteniendo datos completos para ${iso3Code}...`);
        
        const datos = {
            pais: iso3Code,
            timestamp: new Date().toISOString(),
            fuentes: []
        };
        
        try {
            // Banco Mundial
            const [pib, inflacion, desempleo, poblacion] = await Promise.all([
                this.BancoMundial.getPIB(iso3Code),
                this.BancoMundial.getInflacion(iso3Code),
                this.BancoMundial.getDesempleo(iso3Code),
                this.BancoMundial.getPoblacion(iso3Code)
            ]);
            
            if (pib) { datos.pib = pib; datos.fuentes.push('Banco Mundial'); }
            if (inflacion) { datos.inflacion = inflacion; }
            if (desempleo) { datos.desempleo = desempleo; }
            if (poblacion) { datos.poblacion = poblacion; }
            
            // INE si es España
            if (iso3Code === 'ESP') {
                const paro = await this.INE.getPAROTemporalmente();
                if (paro) { datos.paro_ine = paro; datos.fuentes.push('INE'); }
            }
            
            console.log(`✅ Datos obtenidos para ${iso3Code}:`, datos);
            return datos;
        } catch(e) {
            console.error('Error obteniendo datos:', e);
            return null;
        }
    }
};

window.APIsReales = APIsReales;
console.log('✅ APIs Reales cargadas');
