// js/core/11-coloreado.js
// ============================================
// COLOREADO DINÁMICO - Optimizado y definitivo
// ============================================

const Coloreado = {
    umbralesPIB: [
        { max: 5000, color: '#b71c1c', label: '< 5.000 $' },
        { max: 15000, color: '#ef6c00', label: '5.000 - 15.000 $' },
        { max: 30000, color: '#f9a825', label: '15.000 - 30.000 $' },
        { max: 50000, color: '#43a047', label: '30.000 - 50.000 $' },
        { max: Infinity, color: '#2e7d32', label: '> 50.000 $' }
    ],
    
    // Códigos ISO3 que NO deben consultarse
    codigosIgnorar: new Set([
        '-99', 'ATA', 'TWN', 'VAT', 'ESH', 'JEY', 'GGY', 'BLM', 'IOT',
        'UMI', 'MSR', 'AIA', 'VGB', 'CYM', 'BMU', 'HMD', 'SHN', 'FLK',
        'SGS', 'PCN', 'NFK', 'COK', 'WLF', 'NIU', 'ALA', 'SPM', 'ATF',
        'IOT', 'SXM', 'MAF', 'GUF', 'GLP', 'MTQ', 'REU', 'MYT', 'PYF',
        'NCL', 'GIB', 'AND', 'MCO', 'LIE', 'SMR', 'MHL', 'FSM', 'PLW',
        'KIR', 'TUV', 'VUT', 'SLB', 'TON', 'WSM', 'ASM', 'GUM', 'MNP'
    ]),
    
    getColorPorPIB: function(pib) {
        if (!pib || pib === 0) return '#1a3a4a';
        for (let u of this.umbralesPIB) {
            if (pib <= u.max) return u.color;
        }
        return '#1a3a4a';
    },
    
    // Verificar si un país debe ser consultado
    debeConsultar: function(iso3) {
        if (!iso3 || iso3.length !== 3) return false;
        if (this.codigosIgnorar.has(iso3)) return false;
        if (!window.APIBancoMundial || !window.APIBancoMundial.isSoportado(iso3)) return false;
        return true;
    },
    
    async aplicarColoresPIB() {
        const capa = window.capaPaisesGlobal;
        
        if (!capa) {
            console.warn('⚠️ capaPaisesGlobal no disponible, reintentando...');
            setTimeout(() => this.aplicarColoresPIB(), 1000);
            return;
        }
        
        const capas = capa.getLayers();
        console.log(`🎨 Coloreando ${capas.length} países por PIB (paralelizado)...`);
        
        // Recolectar todas las promesas
        const promesas = [];
        
        for (let layer of capas) {
            const iso3 = layer.feature?.properties?.['ISO3166-1-Alpha-3'] || null;
            
            if (!this.debeConsultar(iso3)) {
                continue;
            }
            
            const promesa = (async () => {
                try {
                    const datos = await window.CacheDatos?.obtenerDatos(iso3);
                    const pib = datos?.pib?.valor;
                    if (pib && pib > 0) {
                        const color = this.getColorPorPIB(pib);
                        return { layer, color };
                    }
                } catch(e) {
                    // Error silencioso
                }
                return null;
            })();
            
            promesas.push(promesa);
        }
        
        // Ejecutar todas en paralelo
        const resultados = await Promise.all(promesas);
        
        // Aplicar colores
        let coloreados = 0;
        for (const res of resultados) {
            if (res && res.color) {
                res.layer.setStyle({
                    fillColor: res.color,
                    fillOpacity: 0.75,
                    color: '#ffffff',
                    weight: 0.5
                });
                coloreados++;
            }
        }
        
        console.log(`✅ ${coloreados} países coloreados por PIB`);
        
        if (coloreados > 0) {
            this.actualizarLeyenda('💰 PIB per cápita', this.umbralesPIB);
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
