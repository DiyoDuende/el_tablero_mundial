// js/core/11-coloreado.js
// ============================================
// COLOREADO DINÁMICO - Basado en datos reales
// ============================================

const Coloreado = {
    umbralesPIB: [
        { max: 5000, color: '#b71c1c', label: '< 5.000 $' },
        { max: 15000, color: '#ef6c00', label: '5.000 - 15.000 $' },
        { max: 30000, color: '#f9a825', label: '15.000 - 30.000 $' },
        { max: 50000, color: '#43a047', label: '30.000 - 50.000 $' },
        { max: Infinity, color: '#2e7d32', label: '> 50.000 $' }
    ],
    
    getColorPorPIB: function(pib) {
        if (!pib || pib === 0) return '#1a3a4a';
        for (let u of this.umbralesPIB) {
            if (pib <= u.max) return u.color;
        }
        return '#1a3a4a';
    },
    
    async aplicarColoresPIB() {
        const capa = window.MapaMundial?.capaPaises;
        if (!capa) {
            console.warn('⚠️ Capa de países no disponible');
            return;
        }
        
        const iso3Map = {
            'Spain': 'ESP', 'France': 'FRA', 'Germany': 'DEU', 'Italy': 'ITA',
            'Portugal': 'PRT', 'United Kingdom': 'GBR', 'United States of America': 'USA',
            'China': 'CHN', 'Russia': 'RUS', 'Brazil': 'BRA', 'India': 'IND',
            'Japan': 'JPN', 'Canada': 'CAN', 'Mexico': 'MEX', 'Australia': 'AUS',
            'South Africa': 'ZAF', 'Netherlands': 'NLD', 'Sweden': 'SWE', 'Norway': 'NOR',
            'Switzerland': 'CHE', 'Argentina': 'ARG', 'Chile': 'CHL', 'Colombia': 'COL',
            'Peru': 'PER', 'Venezuela': 'VEN', 'Egypt': 'EGY', 'Turkey': 'TUR',
            'South Korea': 'KOR', 'Poland': 'POL', 'Ukraine': 'UKR', 'Romania': 'ROU',
            'Greece': 'GRC', 'Austria': 'AUT', 'Belgium': 'BEL', 'Czech Republic': 'CZE',
            'Denmark': 'DNK', 'Finland': 'FIN', 'Hungary': 'HUN', 'Ireland': 'IRL'
        };
        
        let coloreados = 0;
        
        capa.eachLayer(layer => {
            const nombre = layer.feature?.properties?.ADMIN || '';
            const iso3 = iso3Map[nombre];
            
            if (iso3 && APIBancoMundial.isSoportado(iso3)) {
                CacheDatos.obtenerDatos(iso3).then(datos => {
                    const pib = datos?.pib?.valor;
                    if (pib) {
                        const color = this.getColorPorPIB(pib);
                        layer.setStyle({
                            fillColor: color,
                            fillOpacity: 0.75,
                            color: '#ffffff',
                            weight: 0.5
                        });
                        coloreados++;
                        if (coloreados === 1) {
                            this.actualizarLeyenda('💰 PIB per cápita', this.umbralesPIB);
                        }
                    }
                });
            }
        });
        
        console.log(`🎨 Coloreando mapa por PIB...`);
    },
    
    actualizarLeyenda: function(titulo, umbrales) {
        let leyenda = document.querySelector('.mapa-leyenda');
        if (!leyenda) {
            leyenda = document.createElement('div');
            leyenda.className = 'mapa-leyenda';
            const mapaContainer = document.querySelector('.mapa-container');
            if (mapaContainer) mapaContainer.appendChild(leyenda);
        }
        
        let html = `<div class="leyenda-titulo">${titulo}</div>`;
        html += `<div class="leyenda-escala">`;
        for (let u of umbrales) {
            html += `<div class="leyenda-color" style="background: ${u.color};"></div>`;
        }
        html += `</div>`;
        html += `<div class="leyenda-valores">`;
        for (let u of umbrales) {
            html += `<span>${u.label}</span>`;
        }
        html += `</div>`;
        html += `<div class="leyenda-fuente">📊 Banco Mundial</div>`;
        
        leyenda.innerHTML = html;
    },
    
    resetearColores: function() {
        const capa = window.MapaMundial?.capaPaises;
        if (!capa) return;
        
        capa.eachLayer(layer => {
            layer.setStyle({
                fillColor: '#2c3e50',
                fillOpacity: 0.3,
                color: '#4fc3f7',
                weight: 1
            });
        });
        
        const leyenda = document.querySelector('.mapa-leyenda');
        if (leyenda) leyenda.remove();
    }
};

window.Coloreado = Coloreado;
