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
    
    buscarISO3: function(nombrePais) {
        if (!nombrePais || typeof APIBancoMundial === 'undefined') return null;
        
        const nombreNorm = nombrePais.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        for (let [iso3, nombre] of Object.entries(APIBancoMundial.paisesSoportados)) {
            const nombreAPINorm = nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (nombreAPINorm === nombreNorm) return iso3;
        }
        return null;
    },
    
    async aplicarColoresPIB() {
        if (!window.capaPaisesGlobal) {
            console.warn('⚠️ capaPaisesGlobal no disponible, reintentando...');
            setTimeout(() => this.aplicarColoresPIB(), 1000);
            return;
        }
        
        console.log('🎨 Coloreando mapa por PIB...');
        
        // Recopilar todas las promesas para ejecutarlas en paralelo
        const promesas = [];
        const capa = window.capaPaisesGlobal;
        
        for (let layer of capa.getLayers()) {
            const nombrePais = layer.feature?.properties?.ADMIN;
            if (!nombrePais) continue;
            
            const iso3 = this.buscarISO3(nombrePais);
            if (!iso3) continue;
            
            const promesa = (async () => {
                const datos = await window.CacheDatos?.obtenerDatos(iso3);
                const pib = datos?.pib?.valor;
                if (pib) {
                    layer.setStyle({
                        fillColor: this.getColorPorPIB(pib),
                        fillOpacity: 0.75,
                        color: '#ffffff',
                        weight: 0.5
                    });
                    return true;
                }
                return false;
            })();
            
            promesas.push(promesa);
        }
        
        const resultados = await Promise.all(promesas);
        const coloreados = resultados.filter(r => r === true).length;
        
        console.log(`✅ ${coloreados} países coloreados por PIB`);
        this.actualizarLeyenda('💰 PIB per cápita', this.umbralesPIB);
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
        if (!window.capaPaisesGlobal) return;
        
        for (let layer of window.capaPaisesGlobal.getLayers()) {
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
