// js/ui/09-dashboard.js
// ============================================
// DASHBOARD REAL - Datos del Banco Mundial
// ============================================

const DashboardReal = {
    async mostrar(iso3) {
        if (!iso3) return;
        
        if (!window.APIBancoMundial || !window.APIBancoMundial.isSoportado(iso3)) {
            this.mostrarNoSoportado(iso3);
            return;
        }
        
        this.mostrarLoading();
        
        const datos = await window.CacheDatos?.obtenerDatos(iso3);
        
        if (!datos || !datos.pib) {
            this.mostrarError(iso3);
            return;
        }
        
        const container = document.getElementById('dashboard-container');
        if (container) container.innerHTML = this.generarHTML(datos);
    },
    
    generarHTML: function(datos) {
        const nombrePais = window.APIBancoMundial.paisesSoportados[datos.iso3] || datos.iso3;
        
        const pib = datos.pib?.valor ? Math.round(datos.pib.valor).toLocaleString() : 'N/D';
        const inflacion = datos.inflacion?.valor ? datos.inflacion.valor.toFixed(1) : 'N/D';
        const desempleo = datos.desempleo?.valor ? datos.desempleo.valor.toFixed(1) : 'N/D';
        const poblacion = datos.poblacion?.valor ? Math.round(datos.poblacion.valor / 1000000).toLocaleString() + ' M' : 'N/D';
        const deuda = datos.deuda?.valor ? datos.deuda.valor.toFixed(1) : 'N/D';
        
        const pibColor = this.getColorPorPIB(datos.pib?.valor);
        const inflacionColor = this.getColorPorInflacion(datos.inflacion?.valor);
        const desempleoColor = this.getColorPorDesempleo(datos.desempleo?.valor);
        const deudaColor = this.getColorPorDeuda(datos.deuda?.valor);
        
        return `
            <div class="dashboard-real">
                <div class="dashboard-header">
                    <div class="pais-titulo">
                        <span class="pais-bandera">${this.getBandera(datos.iso3)}</span>
                        <h2>${nombrePais}</h2>
                    </div>
                    <span class="pais-codigo">${datos.iso3}</span>
                </div>
                
                <div class="dashboard-fuente">
                    📊 Datos reales del Banco Mundial
                    <span class="fecha-update">🔄 ${new Date(datos.ultimaActualizacion).toLocaleString()}</span>
                </div>
                
                <div class="indicadores-grid">
                    <div class="indicador-card">
                        <div class="indicador-icono">💰</div>
                        <div class="indicador-valor" style="color: ${pibColor};">${pib} $</div>
                        <div class="indicador-label">PIB per cápita</div>
                        <div class="indicador-año">${datos.pib?.año || ''}</div>
                    </div>
                    
                    <div class="indicador-card">
                        <div class="indicador-icono">📈</div>
                        <div class="indicador-valor" style="color: ${inflacionColor};">${inflacion}%</div>
                        <div class="indicador-label">Inflación</div>
                        <div class="indicador-año">${datos.inflacion?.año || ''}</div>
                    </div>
                    
                    <div class="indicador-card">
                        <div class="indicador-icono">👥</div>
                        <div class="indicador-valor" style="color: ${desempleoColor};">${desempleo}%</div>
                        <div class="indicador-label">Desempleo</div>
                        <div class="indicador-año">${datos.desempleo?.año || ''}</div>
                    </div>
                    
                    <div class="indicador-card">
                        <div class="indicador-icono">🏛️</div>
                        <div class="indicador-valor" style="color: ${deudaColor};">${deuda}%</div>
                        <div class="indicador-label">Deuda pública</div>
                        <div class="indicador-año">${datos.deuda?.año || ''}</div>
                    </div>
                    
                    <div class="indicador-card">
                        <div class="indicador-icono">🌍</div>
                        <div class="indicador-valor">${poblacion}</div>
                        <div class="indicador-label">Población</div>
                        <div class="indicador-año">${datos.poblacion?.año || ''}</div>
                    </div>
                </div>
                
                <div class="dashboard-fuentes">📚 Fuentes: Banco Mundial · Datos oficiales</div>
                <div class="dashboard-nota">💡 Los datos se actualizan cada 24 horas</div>
            </div>
        `;
    },
    
    getColorPorPIB: function(pib) {
        if (!pib) return '#888';
        if (pib > 50000) return '#2e7d32';
        if (pib > 30000) return '#43a047';
        if (pib > 15000) return '#f9a825';
        if (pib > 5000) return '#ef6c00';
        return '#d32f2f';
    },
    
    getColorPorInflacion: function(inflacion) {
        if (!inflacion) return '#888';
        if (inflacion < 2) return '#2e7d32';
        if (inflacion < 4) return '#f9a825';
        if (inflacion < 10) return '#ef6c00';
        return '#d32f2f';
    },
    
    getColorPorDesempleo: function(desempleo) {
        if (!desempleo) return '#888';
        if (desempleo < 5) return '#2e7d32';
        if (desempleo < 8) return '#43a047';
        if (desempleo < 12) return '#f9a825';
        if (desempleo < 20) return '#ef6c00';
        return '#d32f2f';
    },
    
    getColorPorDeuda: function(deuda) {
        if (!deuda) return '#888';
        if (deuda < 60) return '#2e7d32';
        if (deuda < 90) return '#f9a825';
        if (deuda < 120) return '#ef6c00';
        return '#d32f2f';
    },
    
    getBandera: function(iso3) {
        const banderas = {
            'ESP': '🇪🇸', 'FRA': '🇫🇷', 'DEU': '🇩🇪', 'ITA': '🇮🇹',
            'PRT': '🇵🇹', 'GBR': '🇬🇧', 'USA': '🇺🇸', 'CAN': '🇨🇦',
            'MEX': '🇲🇽', 'BRA': '🇧🇷', 'ARG': '🇦🇷', 'CHL': '🇨🇱',
            'CHN': '🇨🇳', 'JPN': '🇯🇵', 'KOR': '🇰🇷', 'IND': '🇮🇳',
            'RUS': '🇷🇺', 'AUS': '🇦🇺', 'ZAF': '🇿🇦'
        };
        return banderas[iso3] || '🌍';
    },
    
    mostrarNoSoportado: function(iso3) {
        const container = document.getElementById('dashboard-container');
        if (container) {
            container.innerHTML = `<div class="dashboard-error"><div class="error-icono">🌍</div><h3>País no disponible</h3><p>${iso3} no tiene datos disponibles.</p></div>`;
        }
    },
    
    mostrarError: function(iso3) {
        const container = document.getElementById('dashboard-container');
        if (container) {
            container.innerHTML = `<div class="dashboard-error"><div class="error-icono">⚠️</div><h3>Error al cargar datos</h3><p>No se pudieron obtener datos de ${iso3}.</p><button onclick="window.CacheDatos?.limpiar(); location.reload();" class="btn-reintentar">🔄 Reintentar</button></div>`;
        }
    },
    
    mostrarLoading: function() {
        const container = document.getElementById('dashboard-container');
        if (container) {
            container.innerHTML = `<div class="dashboard-loading"><div class="loading-spinner">🌐</div><p>Cargando datos del Banco Mundial...</p></div>`;
        }
    }
};

window.DashboardReal = DashboardReal;
