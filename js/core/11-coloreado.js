// js/core/11-coloreado.js
// ============================================
// COLOREADO DINÁMICO - Basado en datos reales del Banco Mundial
// ============================================

const Coloreado = {
    // Umbrales para colorear por PIB per cápita (USD)
    umbralesPIB: [
        { max: 5000, color: '#b71c1c', label: '< 5.000 $' },
        { max: 15000, color: '#ef6c00', label: '5.000 - 15.000 $' },
        { max: 30000, color: '#f9a825', label: '15.000 - 30.000 $' },
        { max: 50000, color: '#43a047', label: '30.000 - 50.000 $' },
        { max: Infinity, color: '#2e7d32', label: '> 50.000 $' }
    ],
    
    // Umbrales para inflación (%)
    umbralesInflacion: [
        { max: 2, color: '#2e7d32', label: '< 2%' },
        { max: 4, color: '#f9a825', label: '2% - 4%' },
        { max: 10, color: '#ef6c00', label: '4% - 10%' },
        { max: Infinity, color: '#b71c1c', label: '> 10%' }
    ],
    
    // Umbrales para desempleo (%)
    umbralesDesempleo: [
        { max: 5, color: '#2e7d32', label: '< 5%' },
        { max: 8, color: '#43a047', label: '5% - 8%' },
        { max: 12, color: '#f9a825', label: '8% - 12%' },
        { max: 20, color: '#ef6c00', label: '12% - 20%' },
        { max: Infinity, color: '#b71c1c', label: '> 20%' }
    ],
    
    // Obtener color según PIB
    getColorPorPIB: function(pib) {
        if (!pib || pib === 0) return '#1a3a4a';
        for (let u of this.umbralesPIB) {
            if (pib <= u.max) return u.color;
        }
        return '#1a3a4a';
    },
    
    // Obtener color según inflación
    getColorPorInflacion: function(inflacion) {
        if (!inflacion) return '#1a3a4a';
        for (let u of this.umbralesInflacion) {
            if (inflacion <= u.max) return u.color;
        }
        return '#1a3a4a';
    },
    
    // Obtener color según desempleo
    getColorPorDesempleo: function(desempleo) {
        if (!desempleo) return '#1a3a4a';
        for (let u of this.umbralesDesempleo) {
            if (desempleo <= u.max) return u.color;
        }
        return '#1a3a4a';
    },
    
    // Buscar ISO3 por nombre del país
    buscarISO3: function(nombrePais) {
        if (!nombrePais || typeof APIBancoMundial === 'undefined') return null;
        
        const nombreNorm = nombrePais.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        for (let [iso3, nombre] of Object.entries(APIBancoMundial.paisesSoportados)) {
            const nombreAPINorm = nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (nombreAPINorm === nombreNorm) return iso3;
        }
        return null;
    },
    
    // Aplicar colores por PIB
    async aplicarColoresPIB() {
        if (!capaPaisesGlobal) {
            console.warn('⚠️ Capa de países no disponible');
            return;
        }
        
        console.log('🎨 Coloreando mapa por PIB per cápita...');
        let coloreados = 0;
        
        for (let layer of capaPaisesGlobal.getLayers()) {
            const nombrePais = layer.feature?.properties?.ADMIN;
            if (!nombrePais) continue;
            
            const iso3 = this.buscarISO3(nombrePais);
            if (!iso3) continue;
            
            const datos = await CacheDatos?.obtenerDatos(iso3);
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
            }
        }
        
        console.log(`✅ ${coloreados} países coloreados por PIB`);
        this.actualizarLeyenda('💰 PIB per cápita', this.umbralesPIB);
    },
    
    // Aplicar colores por inflación
    async aplicarColoresInflacion() {
        if (!capaPaisesGlobal) return;
        
        console.log('🎨 Coloreando mapa por inflación...');
        let coloreados = 0;
        
        for (let layer of capaPaisesGlobal.getLayers()) {
            const nombrePais = layer.feature?.properties?.ADMIN;
            if (!nombrePais) continue;
            
            const iso3 = this.buscarISO3(nombrePais);
            if (!iso3) continue;
            
            const datos = await CacheDatos?.obtenerDatos(iso3);
            const inflacion = datos?.inflacion?.valor;
            
            if (inflacion) {
                const color = this.getColorPorInflacion(inflacion);
                layer.setStyle({
                    fillColor: color,
                    fillOpacity: 0.75,
                    color: '#ffffff',
                    weight: 0.5
                });
                coloreados++;
            }
        }
        
        console.log(`✅ ${coloreados} países coloreados por inflación`);
        this.actualizarLeyenda('📈 Inflación', this.umbralesInflacion);
    },
    
    // Aplicar colores por desempleo
    async aplicarColoresDesempleo() {
        if (!capaPaisesGlobal) return;
        
        console.log('🎨 Coloreando mapa por desempleo...');
        let coloreados = 0;
        
        for (let layer of capaPaisesGlobal.getLayers()) {
            const nombrePais = layer.feature?.properties?.ADMIN;
            if (!nombrePais) continue;
            
            const iso3 = this.buscarISO3(nombrePais);
            if (!iso3) continue;
            
            const datos = await CacheDatos?.obtenerDatos(iso3);
            const desempleo = datos?.desempleo?.valor;
            
            if (desempleo) {
                const color = this.getColorPorDesempleo(desempleo);
                layer.setStyle({
                    fillColor: color,
                    fillOpacity: 0.75,
                    color: '#ffffff',
                    weight: 0.5
                });
                coloreados++;
            }
        }
        
        console.log(`✅ ${coloreados} países coloreados por desempleo`);
        this.actualizarLeyenda('👥 Desempleo', this.umbralesDesempleo);
    },
    
    // Actualizar la leyenda en el mapa
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
        html += `<div class="leyenda-fuente">📊 Banco Mundial | Datos en tiempo real</div>`;
        
        leyenda.innerHTML = html;
    },
    
    // Restablecer colores neutros
    resetearColores: function() {
        if (!capaPaisesGlobal) return;
        
        for (let layer of capaPaisesGlobal.getLayers()) {
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
