// js/core/11-coloreado.js
// ============================================
// COLOREADO DINÁMICO - Basado en datos reales
// ============================================

const Coloreado = {
    // Umbrales para colorear por PIB per cápita
    umbralesPIB: [
        { max: 5000, color: '#b71c1c', nombre: 'Muy bajo' },      // Rojo oscuro
        { max: 15000, color: '#ef6c00', nombre: 'Bajo' },         // Naranja
        { max: 30000, color: '#f9a825', nombre: 'Medio' },        // Amarillo
        { max: 50000, color: '#43a047', nombre: 'Alto' },         // Verde
        { max: Infinity, color: '#2e7d32', nombre: 'Muy alto' }   // Verde oscuro
    ],
    
    // Umbrales para colorear por inflación
    umbralesInflacion: [
        { max: 2, color: '#2e7d32', nombre: 'Muy baja' },
        { max: 4, color: '#f9a825', nombre: 'Moderada' },
        { max: 10, color: '#ef6c00', nombre: 'Alta' },
        { max: Infinity, color: '#b71c1c', nombre: 'Muy alta' }
    ],
    
    // Umbrales para colorear por desempleo
    umbralesDesempleo: [
        { max: 5, color: '#2e7d32', nombre: 'Muy bajo' },
        { max: 8, color: '#43a047', nombre: 'Bajo' },
        { max: 12, color: '#f9a825', nombre: 'Medio' },
        { max: 20, color: '#ef6c00', nombre: 'Alto' },
        { max: Infinity, color: '#b71c1c', nombre: 'Muy alto' }
    ],
    
    // Obtener color según PIB
    getColorPorPIB: function(pib) {
        if (!pib) return '#1a3a4a'; // Color neutro si no hay datos
        for (let umbral of this.umbralesPIB) {
            if (pib <= umbral.max) return umbral.color;
        }
        return '#1a3a4a';
    },
    
    // Obtener color según inflación
    getColorPorInflacion: function(inflacion) {
        if (!inflacion) return '#1a3a4a';
        for (let umbral of this.umbralesInflacion) {
            if (inflacion <= umbral.max) return umbral.color;
        }
        return '#1a3a4a';
    },
    
    // Obtener color según desempleo
    getColorPorDesempleo: function(desempleo) {
        if (!desempleo) return '#1a3a4a';
        for (let umbral of this.umbralesDesempleo) {
            if (desempleo <= umbral.max) return umbral.color;
        }
        return '#1a3a4a';
    },
    
    // Aplicar colores al mapa según PIB
    async aplicarColoresPIB() {
        if (!capaPaisesGlobal) {
            console.warn('⚠️ Capa de países no disponible');
            return;
        }
        
        console.log('🎨 Aplicando colores por PIB per cápita...');
        
        let coloreados = 0;
        
        for (let layer of capaPaisesGlobal.getLayers()) {
            const nombrePais = layer.feature?.properties?.ADMIN || '';
            if (!nombrePais) continue;
            
            // Buscar ISO3
            let iso3 = this.buscarISO3porNombre(nombrePais);
            if (!iso3) continue;
            
            // Obtener datos del país
            const datos = await CacheDatos?.obtenerDatos(iso3);
            const pib = datos?.pib?.valor;
            
            if (pib) {
                const color = this.getColorPorPIB(pib);
                layer.setStyle({
                    fillColor: color,
                    fillOpacity: 0.7,
                    color: '#ffffff',
                    weight: 0.5
                });
                coloreados++;
            }
        }
        
        console.log(`✅ ${coloreados} países coloreados según PIB`);
        this.actualizarLeyenda('PIB per cápita (USD)');
    },
    
    // Aplicar colores por inflación
    async aplicarColoresInflacion() {
        if (!capaPaisesGlobal) return;
        
        console.log('🎨 Aplicando colores por inflación...');
        
        let coloreados = 0;
        
        for (let layer of capaPaisesGlobal.getLayers()) {
            const nombrePais = layer.feature?.properties?.ADMIN || '';
            if (!nombrePais) continue;
            
            let iso3 = this.buscarISO3porNombre(nombrePais);
            if (!iso3) continue;
            
            const datos = await CacheDatos?.obtenerDatos(iso3);
            const inflacion = datos?.inflacion?.valor;
            
            if (inflacion) {
                const color = this.getColorPorInflacion(inflacion);
                layer.setStyle({
                    fillColor: color,
                    fillOpacity: 0.7,
                    color: '#ffffff',
                    weight: 0.5
                });
                coloreados++;
            }
        }
        
        console.log(`✅ ${coloreados} países coloreados según inflación`);
        this.actualizarLeyenda('Inflación (%)');
    },
    
    // Aplicar colores por desempleo
    async aplicarColoresDesempleo() {
        if (!capaPaisesGlobal) return;
        
        console.log('🎨 Aplicando colores por desempleo...');
        
        let coloreados = 0;
        
        for (let layer of capaPaisesGlobal.getLayers()) {
            const nombrePais = layer.feature?.properties?.ADMIN || '';
            if (!nombrePais) continue;
            
            let iso3 = this.buscarISO3porNombre(nombrePais);
            if (!iso3) continue;
            
            const datos = await CacheDatos?.obtenerDatos(iso3);
            const desempleo = datos?.desempleo?.valor;
            
            if (desempleo) {
                const color = this.getColorPorDesempleo(desempleo);
                layer.setStyle({
                    fillColor: color,
                    fillOpacity: 0.7,
                    color: '#ffffff',
                    weight: 0.5
                });
                coloreados++;
            }
        }
        
        console.log(`✅ ${coloreados} países coloreados según desempleo`);
        this.actualizarLeyenda('Desempleo (%)');
    },
    
    // Buscar ISO3 por nombre del país
    buscarISO3porNombre: function(nombrePais) {
        if (!nombrePais) return null;
        
        const nombreNormalizado = nombrePais.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        for (let [iso3, nombre] of Object.entries(APIBancoMundial.paisesSoportados)) {
            const nombreAPINormalizado = nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (nombreAPINormalizado === nombreNormalizado) {
                return iso3;
            }
        }
        return null;
    },
    
    // Actualizar la leyenda del mapa
    actualizarLeyenda: function(titulo) {
        // Buscar o crear contenedor de leyenda
        let leyenda = document.querySelector('.mapa-leyenda');
        if (!leyenda) {
            leyenda = document.createElement('div');
            leyenda.className = 'mapa-leyenda';
            document.querySelector('.mapa-container')?.appendChild(leyenda);
        }
        
        let contenido = `<h4>📊 ${titulo}</h4>`;
        
        // Determinar qué umbrales mostrar según el título
        let umbrales = [];
        if (titulo.includes('PIB')) umbrales = this.umbralesPIB;
        else if (titulo.includes('Inflación')) umbrales = this.umbralesInflacion;
        else if (titulo.includes('Desempleo')) umbrales = this.umbralesDesempleo;
        
        for (let u of umbrales) {
            const rango = u.max === Infinity ? `${u.nombre}` : `< ${u.max.toLocaleString()} ${titulo.includes('PIB') ? '$' : '%'}`;
            contenido += `
                <div class="leyenda-item">
                    <span class="leyenda-color" style="background: ${u.color};"></span>
                    <span class="leyenda-label">${rango}</span>
                </div>
            `;
        }
        
        leyenda.innerHTML = contenido;
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
