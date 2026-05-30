// js/ui/09-dashboard.js
// ============================================
// DASHBOARD REAL - Datos del Banco Mundial
// ============================================

const DashboardReal = {
    lugarActual: null,
    datosActuales: null,
    
    // Mostrar información de un país
    async mostrar(iso3) {
        if (!iso3) return;
        
        // Verificar si el país está soportado
        if (!APIBancoMundial.isSoportado(iso3)) {
            this.mostrarNoSoportado(iso3);
            return;
        }
        
        this.mostrarLoading();
        
        // Obtener datos reales (con caché)
        const datos = await CacheDatos.obtenerDatos(iso3);
        this.datosActuales = datos;
        
        if (!datos || !datos.pib) {
            this.mostrarError(iso3);
            return;
        }
        
        // Generar HTML con datos reales
        const html = this.generarHTML(datos);
        
        const container = document.getElementById('dashboard-container');
        if (container) {
            container.innerHTML = html;
        }
        
        this.ocultarLoading();
    },
    
    // Generar HTML con datos reales
    generarHTML: function(datos) {
        const nombrePais = APIBancoMundial.paisesSoportados[datos.iso3] || datos.iso3;
        
        // Formatear números
        const pibFormateado = datos.pib?.valor ? Math.round(datos.pib.valor).toLocaleString() : 'N/D';
        const inflacionFormateada = datos.inflacion?.valor ? datos.inflacion.valor.toFixed(1) : 'N/D';
        const desempleoFormateado = datos.desempleo?.valor ? datos.desempleo.valor.toFixed(1) : 'N/D';
        const poblacionFormateada = datos.poblacion?.valor ? Math.round(datos.poblacion.valor / 1000000).toLocaleString() + ' M' : 'N/D';
        const deudaFormateada = datos.deuda?.valor ? datos.deuda.valor.toFixed(1) : 'N/D';
        
        // Colores según valores
        const pibColor = this.getPIBColor(datos.pib?.valor);
        const inflacionColor = this.getInflacionColor(datos.inflacion?.valor);
        const desempleoColor = this.getDesempleoColor(datos.desempleo?.valor);
        const deudaColor = this.getDeudaColor(datos.deuda?.valor);
        
        // Fecha de actualización
        const fechaActualizacion = datos.ultimaActualizacion ? new Date(datos.ultimaActualizacion).toLocaleString() : 'desconocida';
        
        return `
            <div class="dashboard-real" style="animation: fadeIn 0.3s ease;">
                <div class="dashboard-header">
                    <div class="pais-titulo">
                        <span class="pais-bandera">${this.getBandera(datos.iso3)}</span>
                        <h2>${nombrePais}</h2>
                    </div>
                    <span class="pais-codigo">${datos.iso3}</span>
                </div>
                
                <div class="dashboard-fuente">
                    📊 Datos reales del Banco Mundial
                    <span class="fecha-update">🔄 ${fechaActualizacion}</span>
                </div>
                
                <div class="indicadores-grid">
                    <div class="indicador-card">
                        <div class="indicador-icono">💰</div>
                        <div class="indicador-valor" style="color: ${pibColor};">${pibFormateado} $</div>
                        <div class="indicador-label">PIB per cápita</div>
                        <div class="indicador-año">${datos.pib?.año || ''}</div>
                        <div class="indicador-barra"><div class="barra" style="width: ${Math.min(100, (datos.pib?.valor || 0) / 1000)}%; background: ${pibColor};"></div></div>
                    </div>
                    
                    <div class="indicador-card">
                        <div class="indicador-icono">📈</div>
                        <div class="indicador-valor" style="color: ${inflacionColor};">${inflacionFormateada}%</div>
                        <div class="indicador-label">Inflación</div>
                        <div class="indicador-año">${datos.inflacion?.año || ''}</div>
                        <div class="indicador-barra"><div class="barra" style="width: ${Math.min(100, (datos.inflacion?.valor || 0) * 5)}%; background: ${inflacionColor};"></div></div>
                    </div>
                    
                    <div class="indicador-card">
                        <div class="indicador-icono">👥</div>
                        <div class="indicador-valor" style="color: ${desempleoColor};">${desempleoFormateado}%</div>
                        <div class="indicador-label">Desempleo</div>
                        <div class="indicador-año">${datos.desempleo?.año || ''}</div>
                        <div class="indicador-barra"><div class="barra" style="width: ${Math.min(100, (datos.desempleo?.valor || 0) * 3)}%; background: ${desempleoColor};"></div></div>
                    </div>
                    
                    <div class="indicador-card">
                        <div class="indicador-icono">🏛️</div>
                        <div class="indicador-valor" style="color: ${deudaColor};">${deudaFormateada}%</div>
                        <div class="indicador-label">Deuda pública</div>
                        <div class="indicador-año">${datos.deuda?.año || ''}</div>
                        <div class="indicador-barra"><div class="barra" style="width: ${Math.min(100, datos.deuda?.valor || 0)}%; background: ${deudaColor};"></div></div>
                    </div>
                    
                    <div class="indicador-card">
                        <div class="indicador-icono">🌍</div>
                        <div class="indicador-valor">${poblacionFormateada}</div>
                        <div class="indicador-label">Población</div>
                        <div class="indicador-año">${datos.poblacion?.año || ''}</div>
                        <div class="indicador-barra"><div class="barra" style="width: ${Math.min(100, (datos.poblacion?.valor || 0) / 10000000)}%; background: #4fc3f7;"></div></div>
                    </div>
                </div>
                
                <div class="dashboard-fuentes">
                    📚 Fuentes: Banco Mundial · FMI · Datos oficiales
                </div>
                
                <div class="dashboard-nota">
                    💡 Los datos se actualizan automáticamente cada 24 horas
                </div>
            </div>
        `;
    },
    
    // Mostrar mensaje de país no soportado
    mostrarNoSoportado: function(iso3) {
        const container = document.getElementById('dashboard-container');
        if (container) {
            container.innerHTML = `
                <div class="dashboard-error">
                    <div class="error-icono">🌍</div>
                    <h3>País no disponible</h3>
                    <p>${iso3} no está en la base de datos del Banco Mundial o no tenemos datos.</p>
                    <p>Prueba con: España (ESP), Francia (FRA), Alemania (DEU)...</p>
                </div>
            `;
        }
    },
    
    // Mostrar error de carga
    mostrarError: function(iso3) {
        const container = document.getElementById('dashboard-container');
        if (container) {
            container.innerHTML = `
                <div class="dashboard-error">
                    <div class="error-icono">⚠️</div>
                    <h3>Error al cargar datos</h3>
                    <p>No se pudieron obtener datos económicos de ${iso3}.</p>
                    <p>Verifica tu conexión o intenta más tarde.</p>
                    <button onclick="CacheDatos.limpiar(); location.reload();" class="btn-reintentar">🔄 Reintentar</button>
                </div>
            `;
        }
    },
    
    mostrarLoading: function() {
        const container = document.getElementById('dashboard-container');
        if (container) {
            container.innerHTML = `
                <div class="dashboard-loading">
                    <div class="loading-spinner">🌐</div>
                    <p>Cargando datos del Banco Mundial...</p>
                </div>
            `;
        }
    },
    
    ocultarLoading: function() {
        // El loading se reemplaza por el contenido
    },
    
    // Utilidades de colores
    getPIBColor: function(pib) {
        if (!pib) return '#888';
        if (pib > 50000) return '#2e7d32';
        if (pib > 30000) return '#43a047';
        if (pib > 15000) return '#f9a825';
        if (pib > 5000) return '#ef6c00';
        return '#d32f2f';
    },
    
    getInflacionColor: function(inflacion) {
        if (!inflacion) return '#888';
        if (inflacion < 2) return '#2e7d32';
        if (inflacion < 4) return '#f9a825';
        if (inflacion < 10) return '#ef6c00';
        return '#d32f2f';
    },
    
    getDesempleoColor: function(desempleo) {
        if (!desempleo) return '#888';
        if (desempleo < 5) return '#2e7d32';
        if (desempleo < 8) return '#43a047';
        if (desempleo < 12) return '#f9a825';
        if (desempleo < 20) return '#ef6c00';
        return '#d32f2f';
    },
    
    getDeudaColor: function(deuda) {
        if (!deuda) return '#888';
        if (deuda < 60) return '#2e7d32';
        if (deuda < 90) return '#f9a825';
        if (deuda < 120) return '#ef6c00';
        return '#d32f2f';
    },
    
    getBandera: function(iso3) {
        const banderas = {
            'ESP': '🇪🇸', 'FRA': '🇫🇷', 'DEU': '🇩🇪', 'ITA': '🇮🇹',
            'PRT': '🇵🇹', 'GBR': '🇬🇧', 'IRL': '🇮🇪', 'NLD': '🇳🇱',
            'BEL': '🇧🇪', 'AUT': '🇦🇹', 'CHE': '🇨🇭', 'SWE': '🇸🇪',
            'NOR': '🇳🇴', 'DNK': '🇩🇰', 'FIN': '🇫🇮', 'POL': '🇵🇱',
            'USA': '🇺🇸', 'CAN': '🇨🇦', 'MEX': '🇲🇽', 'BRA': '🇧🇷',
            'ARG': '🇦🇷', 'CHL': '🇨🇱', 'COL': '🇨🇴', 'PER': '🇵🇪',
            'CHN': '🇨🇳', 'JPN': '🇯🇵', 'KOR': '🇰🇷', 'IND': '🇮🇳',
            'RUS': '🇷🇺', 'AUS': '🇦🇺', 'ZAF': '🇿🇦'
        };
        return banderas[iso3] || '🌍';
    }
};

window.DashboardReal = DashboardReal;
