// js/ui/09-dashboard.js
// ============================================
// DASHBOARD REAL - Muestra datos del Banco Mundial
// ============================================

const DashboardReal = {
    datos: null,
    iso3Actual: null,
    
    mostrar: async function(iso3) {
        this.iso3Actual = iso3;
        const container = document.getElementById('dashboard-container');
        if (!container) return;
        
        // Mostrar carga
        container.innerHTML = `
            <div class="dashboard-loading">
                <div class="loading-spinner">🔄</div>
                <p>Cargando datos de ${iso3}...</p>
            </div>
        `;
        
        try {
            // Obtener datos del caché o API
            let datos = null;
            if (typeof CacheDatos !== 'undefined') {
                datos = await CacheDatos.obtenerDatos(iso3);
            } else if (typeof APIBancoMundial !== 'undefined') {
                datos = await APIBancoMundial.getTodosIndicadores(iso3);
            }
            
            if (datos && datos.pib && datos.pib.valor) {
                this.datos = datos;
                this.renderizar(container, iso3, datos);
            } else {
                this.renderizarError(container, iso3);
            }
        } catch(error) {
            console.error('Error cargando dashboard:', error);
            this.renderizarError(container, iso3);
        }
    },
    
    renderizar: function(container, iso3, datos) {
        const nombre = this.getNombrePais(iso3);
        const bandera = this.getBandera(iso3);
        
        const pib = datos.pib?.valor ? (datos.pib.valor / 1e9).toFixed(1) + 'B' : 'N/D';
        const pibPerCapita = datos.pib_per_capita?.valor ? Math.round(datos.pib_per_capita.valor).toLocaleString() + ' USD' : 'N/D';
        const inflacion = datos.inflacion?.valor ? datos.inflacion.valor.toFixed(1) + '%' : 'N/D';
        const desempleo = datos.desempleo?.valor ? datos.desempleo.valor.toFixed(1) + '%' : 'N/D';
        const deuda = datos.deuda?.valor ? datos.deuda.valor.toFixed(1) + '%' : 'N/D';
        
        const colorInflacion = this.getColorValor(datos.inflacion?.valor, 5, 3);
        const colorDesempleo = this.getColorValor(datos.desempleo?.valor, 15, 8);
        const colorDeuda = this.getColorValor(datos.deuda?.valor, 100, 60);
        
        container.innerHTML = `
            <div class="dashboard-real">
                <div class="dashboard-header">
                    <div class="pais-titulo">
                        <span class="pais-bandera">${bandera}</span>
                        <h2>${nombre}</h2>
                        <span class="pais-codigo">${iso3}</span>
                    </div>
                </div>
                
                <div class="dashboard-fuente">
                    <span>📊 Datos del Banco Mundial</span>
                    <span class="fecha-update">Actualizado: ${new Date().toLocaleDateString()}</span>
                </div>
                
                <div class="indicadores-grid">
                    <div class="indicador-card">
                        <div class="indicador-icono">📊</div>
                        <div class="indicador-valor">${pib}</div>
                        <div class="indicador-label">PIB (USD)</div>
                        <div class="indicador-año">${datos.pib?.anio || '2024'}</div>
                    </div>
                    
                    <div class="indicador-card">
                        <div class="indicador-icono">💰</div>
                        <div class="indicador-valor">${pibPerCapita}</div>
                        <div class="indicador-label">PIB per cápita</div>
                        <div class="indicador-año">${datos.pib_per_capita?.anio || '2024'}</div>
                    </div>
                    
                    <div class="indicador-card" style="border-left-color: ${colorInflacion}">
                        <div class="indicador-icono">📈</div>
                        <div class="indicador-valor">${inflacion}</div>
                        <div class="indicador-label">Inflación</div>
                        <div class="indicador-barra"><div class="barra" style="width: ${Math.min(100, (datos.inflacion?.valor || 0) * 5)}%; background: ${colorInflacion};"></div></div>
                    </div>
                    
                    <div class="indicador-card" style="border-left-color: ${colorDesempleo}">
                        <div class="indicador-icono">👥</div>
                        <div class="indicador-valor">${desempleo}</div>
                        <div class="indicador-label">Desempleo</div>
                        <div class="indicador-barra"><div class="barra" style="width: ${Math.min(100, (datos.desempleo?.valor || 0) * 4)}%; background: ${colorDesempleo};"></div></div>
                    </div>
                    
                    <div class="indicador-card" style="border-left-color: ${colorDeuda}">
                        <div class="indicador-icono">🏦</div>
                        <div class="indicador-valor">${deuda}</div>
                        <div class="indicador-label">Deuda pública</div>
                        <div class="indicador-barra"><div class="barra" style="width: ${Math.min(100, (datos.deuda?.valor || 0))}%; background: ${colorDeuda};"></div></div>
                    </div>
                </div>
                
                <div class="dashboard-fuentes">
                    📚 Fuentes: Banco Mundial · INE · Eurostat
                </div>
                <div class="dashboard-nota">
                    ℹ️ Los datos pueden tener retraso de hasta 12 meses. Simulación en tiempo real en modo JUEGO.
                </div>
            </div>
        `;
    },
    
    renderizarError: function(container, iso3) {
        container.innerHTML = `
            <div class="dashboard-error">
                <div class="error-icono">🌍</div>
                <h3>${this.getNombrePais(iso3)}</h3>
                <p>No hay datos económicos disponibles para este país.</p>
                <p>Los datos del Banco Mundial están disponibles para la mayoría de los países.</p>
                <button id="btn-reintentar-dashboard" class="btn-reintentar">Reintentar</button>
            </div>
        `;
        const btn = document.getElementById('btn-reintentar-dashboard');
        if (btn) btn.addEventListener('click', () => this.mostrar(iso3));
    },
    
    getNombrePais: function(iso3) {
        const nombres = {
            'ESP': 'España', 'FRA': 'Francia', 'DEU': 'Alemania', 'ITA': 'Italia',
            'PRT': 'Portugal', 'GBR': 'Reino Unido', 'USA': 'Estados Unidos',
            'CHN': 'China', 'JPN': 'Japón', 'BRA': 'Brasil', 'ARG': 'Argentina',
            'MEX': 'México', 'CAN': 'Canadá', 'RUS': 'Rusia', 'IND': 'India'
        };
        return nombres[iso3] || iso3;
    },
    
    getBandera: function(iso3) {
        const banderas = {
            'ESP': '🇪🇸', 'FRA': '🇫🇷', 'DEU': '🇩🇪', 'ITA': '🇮🇹', 'PRT': '🇵🇹',
            'GBR': '🇬🇧', 'USA': '🇺🇸', 'CHN': '🇨🇳', 'JPN': '🇯🇵', 'BRA': '🇧🇷',
            'ARG': '🇦🇷', 'MEX': '🇲🇽', 'CAN': '🇨🇦', 'RUS': '🇷🇺', 'IND': '🇮🇳'
        };
        return banderas[iso3] || '🌍';
    },
    
    getColorValor: function(valor, umbralMalo, umbralRegular) {
        if (!valor) return '#4fc3f7';
        if (valor > umbralMalo) return '#d32f2f';
        if (valor > umbralRegular) return '#f57c00';
        return '#2e7d32';
    }
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.DashboardReal = DashboardReal;
        // Cargar España por defecto
        setTimeout(() => DashboardReal.mostrar('ESP'), 500);
    });
} else {
    window.DashboardReal = DashboardReal;
    setTimeout(() => DashboardReal.mostrar('ESP'), 500);
}

window.DashboardReal = DashboardReal;
