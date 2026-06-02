// js/ui/09-dashboard.js
// ============================================
// DASHBOARD REAL - Datos del Banco Mundial
// ============================================

const DashboardReal = {
    async mostrar(iso3) {
        if (!iso3) return;
        
        // Verificar que tenemos los datos
        if (!window.APIBancoMundial || !window.APIBancoMundial.isSoportado(iso3)) {
            this.mostrarNoSoportado(iso3);
            return;
        }
        
        const container = document.getElementById('dashboard-container');
        if (!container) return;
        
        container.innerHTML = '<div class="loading-spinner">🌐 Cargando datos del Banco Mundial...</div>';
        
        try {
            const datos = await window.CacheDatos?.obtenerDatos(iso3);
            if (!datos || !datos.pib || !datos.pib.valor) {
                this.mostrarError(iso3);
                return;
            }
            
            const nombre = window.APIBancoMundial.paisesSoportados[iso3] || iso3;
            const pib = datos.pib.valor ? Math.round(datos.pib.valor).toLocaleString() : 'N/D';
            const pibAnio = datos.pib.año || '2024';
            const inflacion = datos.inflacion?.valor ? datos.inflacion.valor.toFixed(1) : 'N/D';
            const inflacionAnio = datos.inflacion?.año || '2024';
            const desempleo = datos.desempleo?.valor ? datos.desempleo.valor.toFixed(1) : 'N/D';
            const desempleoAnio = datos.desempleo?.año || '2024';
            const deuda = datos.deuda?.valor ? datos.deuda.valor.toFixed(1) : 'N/D';
            const deudaAnio = datos.deuda?.año || '2024';
            const poblacion = datos.poblacion?.valor ? Math.round(datos.poblacion.valor / 1000000).toLocaleString() + ' M' : 'N/D';
            const fechaActualizacion = datos.ultimaActualizacion ? new Date(datos.ultimaActualizacion).toLocaleDateString() : 'desconocida';
            
            container.innerHTML = `
                <div class="dashboard-real" style="animation: fadeIn 0.3s ease;">
                    <div class="dashboard-header">
                        <div class="pais-titulo">
                            <span class="pais-bandera">${this.getBandera(iso3)}</span>
                            <h2>${nombre}</h2>
                        </div>
                        <span class="pais-codigo">${iso3}</span>
                    </div>
                    
                    <div class="dashboard-fuente">
                        📊 Datos reales del Banco Mundial
                        <span class="fecha-update">🔄 ${fechaActualizacion}</span>
                    </div>
                    
                    <div class="indicadores-grid">
                        <div class="indicador-card">
                            <div class="indicador-icono">💰</div>
                            <div class="indicador-valor">${pib} $</div>
                            <div class="indicador-label">PIB per cápita</div>
                            <div class="indicador-año">${pibAnio}</div>
                        </div>
                        
                        <div class="indicador-card">
                            <div class="indicador-icono">📈</div>
                            <div class="indicador-valor">${inflacion}%</div>
                            <div class="indicador-label">Inflación</div>
                            <div class="indicador-año">${inflacionAnio}</div>
                        </div>
                        
                        <div class="indicador-card">
                            <div class="indicador-icono">👥</div>
                            <div class="indicador-valor">${desempleo}%</div>
                            <div class="indicador-label">Desempleo</div>
                            <div class="indicador-año">${desempleoAnio}</div>
                        </div>
                        
                        <div class="indicador-card">
                            <div class="indicador-icono">🏛️</div>
                            <div class="indicador-valor">${deuda}%</div>
                            <div class="indicador-label">Deuda pública</div>
                            <div class="indicador-año">${deudaAnio}</div>
                        </div>
                        
                        <div class="indicador-card">
                            <div class="indicador-icono">🌍</div>
                            <div class="indicador-valor">${poblacion}</div>
                            <div class="indicador-label">Población</div>
                            <div class="indicador-año">${datos.poblacion?.año || ''}</div>
                        </div>
                    </div>
                    
                    <div class="dashboard-fuentes">
                        📚 Fuentes: Banco Mundial · Datos oficiales
                    </div>
                    
                    <div class="dashboard-nota">
                        💡 Los datos se actualizan cada 24 horas
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error cargando dashboard:', error);
            this.mostrarError(iso3);
        }
    },
    
    mostrarNoSoportado: function(iso3) {
        const container = document.getElementById('dashboard-container');
        if (container) {
            container.innerHTML = `
                <div class="dashboard-error">
                    <div class="error-icono">🌍</div>
                    <h3>País no disponible</h3>
                    <p>${iso3} no está en la base de datos del Banco Mundial.</p>
                    <p>Prueba con: España (ESP), Francia (FRA), Alemania (DEU)...</p>
                </div>
            `;
        }
    },
    
    mostrarError: function(iso3) {
        const container = document.getElementById('dashboard-container');
        if (container) {
            container.innerHTML = `
                <div class="dashboard-error">
                    <div class="error-icono">⚠️</div>
                    <h3>Error al cargar datos</h3>
                    <p>No se pudieron obtener datos económicos de ${iso3}.</p>
                    <button onclick="window.CacheDatos?.limpiar(); location.reload();" class="btn-reintentar">🔄 Reintentar</button>
                </div>
            `;
        }
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
