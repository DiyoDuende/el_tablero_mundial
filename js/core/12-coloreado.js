// js/core/11-coloreado.js
// ============================================
// COLOREADO DINÁMICO - Basado en datos reales
// ============================================

var Coloreado = {
    umbralesPIB: [
        { max: 5000, color: '#b71c1c', label: '< 5.000 $' },
        { max: 15000, color: '#ef6c00', label: '5.000 - 15.000 $' },
        { max: 30000, color: '#f9a825', label: '15.000 - 30.000 $' },
        { max: 50000, color: '#43a047', label: '30.000 - 50.000 $' },
        { max: Infinity, color: '#2e7d32', label: '> 50.000 $' }
    ],
    
    getColorPorPIB: function(pib) {
        if (!pib || pib === 0) return '#1a3a4a';
        for (var i = 0; i < this.umbralesPIB.length; i++) {
            if (pib <= this.umbralesPIB[i].max) return this.umbralesPIB[i].color;
        }
        return '#1a3a4a';
    },
    
    aplicarColoresPIB: async function() {
        var capa = window.capaPaisesGlobal;
        
        if (!capa) {
            console.warn('⚠️ capaPaisesGlobal no disponible, reintentando en 1 segundo...');
            setTimeout(function() { Coloreado.aplicarColoresPIB(); }, 1000);
            return;
        }
        
        console.log('🎨 Coloreando', capa.getLayers().length, 'países por PIB...');
        
        var coloreados = 0;
        var capas = capa.getLayers();
        
        for (var i = 0; i < capas.length; i++) {
            var layer = capas[i];
            var nombre = layer.feature?.properties?.ADMIN || '';
            var iso3 = this.obtenerISO3(nombre);
            
            if (!iso3) continue;
            if (!window.APIBancoMundial || !window.APIBancoMundial.isSoportado(iso3)) continue;
            
            try {
                var datos = await window.CacheDatos.obtenerDatos(iso3);
                var pib = datos?.pib?.valor;
                
                if (pib && pib > 0) {
                    var color = this.getColorPorPIB(pib);
                    layer.setStyle({
                        fillColor: color,
                        fillOpacity: 0.75,
                        color: '#ffffff',
                        weight: 0.5
                    });
                    coloreados++;
                }
            } catch(e) {
                // Error silencioso
            }
        }
        
        console.log('✅ ' + coloreados + ' países coloreados por PIB');
        this.actualizarLeyenda('💰 PIB per cápita', this.umbralesPIB);
    },
    
    obtenerISO3: function(nombre) {
        var mapa = {
            'Spain': 'ESP', 'France': 'FRA', 'Germany': 'DEU', 'Italy': 'ITA',
            'Portugal': 'PRT', 'United Kingdom': 'GBR', 'United States of America': 'USA',
            'China': 'CHN', 'Russia': 'RUS', 'Brazil': 'BRA', 'India': 'IND',
            'Japan': 'JPN', 'Canada': 'CAN', 'Mexico': 'MEX', 'Australia': 'AUS',
            'South Africa': 'ZAF', 'Netherlands': 'NLD', 'Sweden': 'SWE', 'Norway': 'NOR',
            'Switzerland': 'CHE', 'Argentina': 'ARG', 'Chile': 'CHL', 'Colombia': 'COL',
            'Peru': 'PER', 'Venezuela': 'VEN', 'Egypt': 'EGY', 'Turkey': 'TUR',
            'South Korea': 'KOR', 'Poland': 'POL', 'Greece': 'GRC', 'Austria': 'AUT',
            'Belgium': 'BEL', 'Denmark': 'DNK', 'Finland': 'FIN', 'Hungary': 'HUN',
            'Ireland': 'IRL', 'Czech Republic': 'CZE', 'Romania': 'ROU'
        };
        return mapa[nombre] || null;
    },
    
    actualizarLeyenda: function(titulo, umbrales) {
        var leyenda = document.querySelector('.mapa-leyenda');
        if (!leyenda) {
            leyenda = document.createElement('div');
            leyenda.className = 'mapa-leyenda';
            var mapaContainer = document.querySelector('.mapa-container');
            if (mapaContainer) mapaContainer.appendChild(leyenda);
        }
        
        var html = '<div class="leyenda-titulo">' + titulo + '</div>';
        html += '<div class="leyenda-escala">';
        for (var i = 0; i < umbrales.length; i++) {
            html += '<div class="leyenda-color" style="background: ' + umbrales[i].color + ';"></div>';
        }
        html += '</div>';
        html += '<div class="leyenda-valores">';
        for (var i = 0; i < umbrales.length; i++) {
            html += '<span>' + umbrales[i].label + '</span>';
        }
        html += '</div>';
        html += '<div class="leyenda-fuente">📊 Banco Mundial</div>';
        
        leyenda.innerHTML = html;
    },
    
    resetearColores: function() {
        var capa = window.capaPaisesGlobal;
        if (!capa) return;
        
        var capas = capa.getLayers();
        for (var i = 0; i < capas.length; i++) {
            capas[i].setStyle({
                fillColor: '#1a3a4a',
                fillOpacity: 0.6,
                color: '#4fc3f7',
                weight: 1
            });
        }
        
        var leyenda = document.querySelector('.mapa-leyenda');
        if (leyenda) leyenda.remove();
        console.log('🎨 Colores restablecidos');
    }
};

window.Coloreado = Coloreado;
