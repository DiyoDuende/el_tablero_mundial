// js/core/11-coloreado.js
// ============================================
// COLOREADO DINÁMICO - Fuerza consulta a API
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
        
        const capas = capa.getLayers();
        console.log(`🎨 Coloreando ${capas.length} países por PIB...`);
        
        let coloreados = 0;
        let procesados = 0;
        
        // Bucle SECUENCIAL para asegurar que cada consulta se completa
        for (let layer of capas) {
            const iso3 = layer.feature?.properties?.['ISO3166-1-Alpha-3'] || null;
            
            // Filtrar ISO3 inválidos
            if (!iso3 || iso3 === '-99' || iso3.length !== 3) {
                continue;
            }
            
            // Solo países soportados por el Banco Mundial
            if (!window.APIBancoMundial || !window.APIBancoMundial.isSoportado(iso3)) {
                continue;
            }
            
            procesados++;
            
            try {
                // IMPORTANTE: forzar actualización = true para evitar usar caché si está vacía
                // pero mantener caché si ya existe
                const datos = await window.CacheDatos?.obtenerDatos(iso3, false);
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
                    
                    // Log cada 10 países
                    if (coloreados % 10 === 0) {
                        console.log(`   Progreso: ${coloreados} países coloreados...`);
                    }
                }
            } catch(e) {
                console.warn(`⚠️ Error con ${iso3}:`, e.message);
            }
        }
        
        console.log(`✅ ${coloreados} países coloreados por PIB`);
        console.log(`📊 Países procesados (soportados): ${procesados}`);
        
        if (coloreados > 0) {
            this.actualizarLeyenda('💰 PIB per cápita', this.umbralesPIB);
        } else if (procesados === 0) {
            console.warn('⚠️ No se encontraron países soportados. Verifica APIBancoMundial.paisesSoportados');
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
