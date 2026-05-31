// js/core/11-coloreado.js
// ============================================
// COLOREADO DINÁMICO - Basado en datos reales del Banco Mundial
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
        const capa = window.capaPaisesGlobal;
        
        if (!capa) {
            console.warn('⚠️ capaPaisesGlobal no disponible, reintentando...');
            setTimeout(() => this.aplicarColoresPIB(), 1000);
            return;
        }
        
        const totalPaises = capa.getLayers().length;
        console.log(`🎨 Coloreando ${totalPaises} países por PIB...`);
        
        // ========================================
        // DIAGNÓSTICO: Mostrar primeros 10 nombres REALES del GeoJSON
        // ========================================
        console.log('📋 Primeros 10 países del GeoJSON:');
        let contador = 0;
        for (let layer of capa.getLayers()) {
            const nombrePais = layer.feature?.properties?.ADMIN || 
                              layer.feature?.properties?.name || 
                              layer.feature?.properties?.NAME ||
                              'sin nombre';
            if (contador < 10) {
                console.log(`   ${contador + 1}. "${nombrePais}"`);
                contador++;
            } else {
                break;
            }
        }
        
        // ========================================
        // Mapa de nombres GeoJSON a ISO3 (basado en el GeoJSON real)
        // ========================================
        // Los nombres son los que aparecen en el diagnóstico
        const mapaNombres = {
            'Spain': 'ESP',
            'France': 'FRA',
            'Germany': 'DEU',
            'Italy': 'ITA',
            'Portugal': 'PRT',
            'United Kingdom': 'GBR',
            'Ireland': 'IRL',
            'Netherlands': 'NLD',
            'Belgium': 'BEL',
            'Austria': 'AUT',
            'Switzerland': 'CHE',
            'Sweden': 'SWE',
            'Norway': 'NOR',
            'Denmark': 'DNK',
            'Finland': 'FIN',
            'Poland': 'POL',
            'Czech Republic': 'CZE',
            'Hungary': 'HUN',
            'Romania': 'ROU',
            'Greece': 'GRC',
            'United States of America': 'USA',
            'USA': 'USA',
            'Canada': 'CAN',
            'Mexico': 'MEX',
            'Brazil': 'BRA',
            'Argentina': 'ARG',
            'Chile': 'CHL',
            'Colombia': 'COL',
            'Peru': 'PER',
            'China': 'CHN',
            'Japan': 'JPN',
            'Korea': 'KOR',
            'Republic of Korea': 'KOR',
            'India': 'IND',
            'Indonesia': 'IDN',
            'Turkey': 'TUR',
            'Saudi Arabia': 'SAU',
            'Russia': 'RUS',
            'Australia': 'AUS',
            'New Zealand': 'NZL',
            'South Africa': 'ZAF',
            'Egypt': 'EGY'
        };
        
        // ========================================
        // Colorear países
        // ========================================
        let coloreados = 0;
        let encontrados = 0;
        
        for (let layer of capa.getLayers()) {
            const nombrePais = layer.feature?.properties?.ADMIN || 
                              layer.feature?.properties?.name || 
                              layer.feature?.properties?.NAME ||
                              '';
            if (!nombrePais) continue;
            
            // Buscar ISO3 en el mapa de nombres
            let iso3 = mapaNombres[nombrePais];
            
            if (!iso3) {
                // Intentar limpiar el nombre
                let nombreLimpio = nombrePais
                    .replace(/^The /, '')
                    .replace(/^Republic of /, '')
                    .replace(/^Kingdom of /, '')
                    .replace(/ \(the\)$/, '');
                iso3 = mapaNombres[nombreLimpio];
            }
            
            if (iso3) {
                encontrados++;
                try {
                    const datos = await window.CacheDatos?.obtenerDatos(iso3);
                    const pib = datos?.pib?.valor;
                    if (pib && pib > 0) {
                        const color = this.getColorPorPIB(pib);
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
        }
        
        console.log(`📊 Países con código ISO3 encontrados: ${encontrados}`);
        console.log(`✅ ${coloreados} países coloreados por PIB`);
        
        if (coloreados > 0) {
            this.actualizarLeyenda('💰 PIB per cápita', this.umbralesPIB);
        } else {
            console.warn('⚠️ No se encontraron datos. Verifica los nombres mostrados arriba.');
            // Mostrar ayuda
            console.log('💡 Si ves "Spain" en la lista, el código debería funcionar.');
            console.log('💡 Si ves "España", cambia "Spain" por "España" en mapaNombres.');
        }
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
        const capa = window.capaPaisesGlobal;
        if (!capa) return;
        
        for (let layer of capa.getLayers()) {
            layer.setStyle({
                fillColor: '#1a3a4a',
                fillOpacity: 0.6,
                color: '#4fc3f7',
                weight: 1
            });
        }
        
        const leyenda = document.querySelector('.mapa-leyenda');
        if (leyenda) leyenda.remove();
        
        console.log('🎨 Colores restablecidos');
    },
    
    // Placeholders para otras capas
    async aplicarColoresInflacion() {
        console.log('📈 Capa de inflación - Próximamente');
        this.actualizarLeyenda('📈 Inflación (próximamente)', this.umbralesPIB);
    },
    
    async aplicarColoresDesempleo() {
        console.log('👥 Capa de desempleo - Próximamente');
        this.actualizarLeyenda('👥 Desempleo (próximamente)', this.umbralesPIB);
    }
};

window.Coloreado = Coloreado;
