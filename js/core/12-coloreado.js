// js/core/12-coloreado.js
// ============================================
// COLOREADO - Colorear mapa según datos
// ============================================

const Coloreado = {
    capaPaises: null,
    modoActual: 'pib',
    
    init: function() {
        this.capaPaises = window.capaPaisesGlobal;
        console.log('🎨 Coloreado inicializado');
    },
    
    aplicarColoresPIB: function() {
        console.log('💰 Aplicando colores por PIB');
        this.modoActual = 'pib';
        this.colorearPorPIB();
    },
    
    aplicarColoresInflacion: function() {
        console.log('📈 Aplicando colores por Inflación');
        this.modoActual = 'inflacion';
        this.colorearPorInflacion();
    },
    
    aplicarColoresDesempleo: function() {
        console.log('👥 Aplicando colores por Desempleo');
        this.modoActual = 'desempleo';
        this.colorearPorDesempleo();
    },
    
    resetearColores: function() {
        console.log('🔄 Reseteando colores');
        if (this.capaPaises) {
            this.capaPaises.setStyle({
                color: '#4fc3f7',
                weight: 1,
                fillColor: '#1a3a4a',
                fillOpacity: 0.6
            });
        }
    },
    
    colorearPorPIB: function() {
        if (!this.capaPaises) return;
        
        const datosEconomicos = {
            'USA': { pib: 27000, color: '#8B0000' },
            'CHN': { pib: 17700, color: '#B22222' },
            'DEU': { pib: 4100, color: '#DC143C' },
            'JPN': { pib: 4200, color: '#FF6347' },
            'IND': { pib: 3700, color: '#FF7F50' },
            'GBR': { pib: 3300, color: '#FFA07A' },
            'FRA': { pib: 2800, color: '#FFB6C1' },
            'ESP': { pib: 1400, color: '#FFE4E1' }
        };
        
        this.capaPaises.eachLayer((layer) => {
            const iso3 = layer.feature?.properties?.['ISO3166-1-Alpha-3'];
            let color = '#90EE90';
            
            if (datosEconomicos[iso3]) {
                color = datosEconomicos[iso3].color;
            }
            
            layer.setStyle({
                fillColor: color,
                fillOpacity: 0.7,
                weight: 1,
                color: '#666'
            });
        });
    },
    
    colorearPorInflacion: function() {
        if (!this.capaPaises) return;
        
        const datosInflacion = {
            'VEN': { inflacion: 25, color: '#8B0000' },
            'TUR': { inflacion: 12, color: '#DC143C' },
            'ARG': { inflacion: 11, color: '#FF6347' },
            'BRA': { inflacion: 6, color: '#FFB6C1' },
            'MEX': { inflacion: 4, color: '#FFE4E1' },
            'ESP': { inflacion: 3.5, color: '#90EE90' }
        };
        
        this.capaPaises.eachLayer((layer) => {
            const iso3 = layer.feature?.properties?.['ISO3166-1-Alpha-3'];
            let color = '#90EE90';
            
            if (datosInflacion[iso3]) {
                color = datosInflacion[iso3].color;
            }
            
            layer.setStyle({
                fillColor: color,
                fillOpacity: 0.7,
                weight: 1,
                color: '#666'
            });
        });
    },
    
    colorearPorDesempleo: function() {
        if (!this.capaPaises) return;
        
        const datosDesempleo = {
            'ZAF': { desempleo: 33, color: '#8B0000' },
            'MAR': { desempleo: 13, color: '#DC143C' },
            'ESP': { desempleo: 12, color: '#FF6347' },
            'FRA': { desempleo: 7, color: '#FFB6C1' },
            'DEU': { desempleo: 6, color: '#FFE4E1' },
            'USA': { desempleo: 4, color: '#90EE90' }
        };
        
        this.capaPaises.eachLayer((layer) => {
            const iso3 = layer.feature?.properties?.['ISO3166-1-Alpha-3'];
            let color = '#90EE90';
            
            if (datosDesempleo[iso3]) {
                color = datosDesempleo[iso3].color;
            }
            
            layer.setStyle({
                fillColor: color,
                fillOpacity: 0.7,
                weight: 1,
                color: '#666'
            });
        });
    }
};

window.Coloreado = Coloreado;
console.log('✅ Coloreado cargado');
