// js/core/11-coloreado.js
// ============================================
// COLOREADO DINÁMICO - Versión corregida
// ============================================

const Coloreado = {
    umbralesPIB: [
        { max: 5000, color: '#b71c1c', label: '< 5.000 $' },
        { max: 15000, color: '#ef6c00', label: '5.000 - 15.000 $' },
        { max: 30000, color: '#f9a825', label: '15.000 - 30.000 $' },
        { max: 50000, color: '#43a047', label: '30.000 - 50.000 $' },
        { max: Infinity, color: '#2e7d32', label: '> 50.000 $' }
    ],
    
    // Obtener color según PIB
    getColorPorPIB: function(pib) {
        if (!pib || pib === 0) return '#1a3a4a';
        for (let u of this.umbralesPIB) {
            if (pib <= u.max) return u.color;
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
        // Usar la variable global capaPaises
        if (!window.capaPaises) {
            console.warn('⚠️ capaPaises no disponible, reintentando en 1 segundo...');
            setTimeout(() => this.aplicarColoresPIB(), 1000);
            return;
        }
        
        console.log('🎨 Coloreando mapa por PIB...');
        let coloreados = 0;
        let total = 0;
        
        for (let layer of window.capaPaises.getLayers()) {
            total++;
            const nombrePais = layer.feature?.properties?.ADMIN;
            if (!nombrePais) continue;
            
            const iso3 = this.buscarISO3(nombrePais);
            if (!iso3) continue;
            
            const datos = await window.CacheDatos?.obtenerDatos(iso3);
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
        
        console.log(`✅ ${coloreados} de ${total} países coloreados por PIB`);
        this.actualizarLeyenda('💰 PIB per cápita', this.umbralesPIB);
    },
    
    // Actualizar leyenda
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
    
    // Restablecer colores
    resetearColores: function() {
        if (!window.capaPaises) return;
        
        for (let layer of window.capaPaises.getLayers()) {
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
