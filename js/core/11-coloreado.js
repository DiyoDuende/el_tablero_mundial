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
    
    // Mapa de nombres de GeoJSON a códigos ISO3
    mapaNombres: {
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
        'United States': 'USA',
        'Canada': 'CAN',
        'Mexico': 'MEX',
        'Brazil': 'BRA',
        'Argentina': 'ARG',
        'Chile': 'CHL',
        'Colombia': 'COL',
        'Peru': 'PER',
        'China': 'CHN',
        'Japan': 'JPN',
        'South Korea': 'KOR',
        'India': 'IND',
        'Indonesia': 'IDN',
        'Turkey': 'TUR',
        'Saudi Arabia': 'SAU',
        'Russia': 'RUS',
        'Australia': 'AUS',
        'New Zealand': 'NZL',
        'South Africa': 'ZAF',
        'Egypt': 'EGY'
    },
    
    getColorPorPIB: function(pib) {
        if (!pib || pib === 0) return '#1a3a4a';
        for (let u of this.umbralesPIB) {
            if (pib <= u.max) return u.color;
        }
        return '#1a3a4a';
    },
    
    // Obtener ISO3 desde el nombre del GeoJSON
    obtenerISO3: function(nombrePais) {
        if (!nombrePais) return null;
        
        // 1. Buscar en el mapa directo
        if (this.mapaNombres[nombrePais]) {
            return this.mapaNombres[nombrePais];
        }
        
        // 2. Buscar en el mapa de APIBancoMundial
        if (window.APIBancoMundial && window.APIBancoMundial.paisesSoportados) {
            const nombreNorm = nombrePais.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            
            for (let [iso3, nombre] of Object.entries(window.APIBancoMundial.paisesSoportados)) {
                const nombreAPINorm = nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                if (nombreAPINorm === nombreNorm) {
                    return iso3;
                }
            }
        }
        
        return null;
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
        
        const promesas = [];
        let paisesEncontrados = 0;
        
        for (let layer of capa.getLayers()) {
            const nombrePais = layer.feature?.properties?.ADMIN;
            if (!nombrePais) continue;
            
            const iso3 = this.obtenerISO3(nombrePais);
            if (!iso3) continue;
            
            paisesEncontrados++;
            
            const promesa = (async () => {
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
                        return true;
                    }
                } catch(e) {
                    // Error silencioso por país
                }
                return false;
            })();
            
            promesas.push(promesa);
        }
        
        console.log(`📊 Países con código ISO3 encontrados: ${paisesEncontrados}`);
        
        const resultados = await Promise.all(promesas);
        const coloreados = resultados.filter(r => r === true).length;
        
        console.log(`✅ ${coloreados} países coloreados por PIB`);
        
        if (coloreados > 0) {
            this.actualizarLeyenda('💰 PIB per cápita', this.umbralesPIB);
        } else {
            console.warn('⚠️ No se encontraron datos de PIB. Verifica la conexión.');
            // Intentar colorear España como prueba
            this.probarColorearEspana();
        }
    },
    
    // Función de prueba para verificar que el coloreado funciona
    probarColorearEspana: async function() {
        console.log('🔍 Probando coloreado con España...');
        const capa = window.capaPaisesGlobal;
        if (!capa) return;
        
        for (let layer of capa.getLayers()) {
            const nombre = layer.feature?.properties?.ADMIN;
            if (nombre === 'Spain') {
                const datos = await window.CacheDatos?.obtenerDatos('ESP');
                if (datos?.pib?.valor) {
                    layer.setStyle({
                        fillColor: '#43a047',
                        fillOpacity: 0.75,
                        color: '#ffffff',
                        weight: 0.5
                    });
                    console.log('✅ España coloreada manualmente como prueba');
                    this.actualizarLeyenda('💰 PIB per cápita (prueba)', this.umbralesPIB);
                } else {
                    console.warn('⚠️ No se pudieron obtener datos de España');
                }
                break;
            }
        }
    },
    
    async aplicarColoresInflacion() {
        console.log('📈 Capa de inflación - Próximamente');
        this.actualizarLeyenda('📈 Inflación (próximamente)', this.umbralesInflacion || this.umbralesPIB);
    },
    
    async aplicarColoresDesempleo() {
        console.log('👥 Capa de desempleo - Próximamente');
        this.actualizarLeyenda('👥 Desempleo (próximamente)', this.umbralesDesempleo || this.umbralesPIB);
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
    }
};

window.Coloreado = Coloreado;
