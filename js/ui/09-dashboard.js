// js/ui/09-dashboard.js
// ============================================
// DASHBOARD REAL - Datos del Banco Mundial
// ============================================

const DashboardReal = {
    async mostrar(iso3) {
        if (!iso3) return;
        if (!window.APIBancoMundial || !window.APIBancoMundial.isSoportado(iso3)) return;
        
        const container = document.getElementById('dashboard-container');
        if (!container) {
            console.error('❌ dashboard-container no encontrado');
            return;
        }
        
        container.innerHTML = '<div class="loading-spinner">🌐 Cargando datos del Banco Mundial...</div>';
        
        let datos;
        try {
            datos = await window.CacheDatos.obtenerDatos(iso3);
        } catch(e) {
            console.error('Error obteniendo datos:', e);
            container.innerHTML = `<div class="dashboard-error">⚠️ Error al cargar datos de ${iso3}</div>`;
            return;
        }
        
        if (!datos || !datos.pib) {
            container.innerHTML = `<div class="dashboard-error">⚠️ No se pudieron obtener datos de ${iso3}</div>`;
            return;
        }
        
        const nombre = window.APIBancoMundial.paisesSoportados[iso3];
        const pib = datos.pib.valor ? Math.round(datos.pib.valor).toLocaleString() : 'N/D';
        const pibAnio = datos.pib.año || '2024';
        const inflacion = datos.inflacion?.valor ? datos.inflacion.valor.toFixed(1) : 'N/D';
        const inflacionAnio = datos.inflacion?.año || '2024';
        const desempleo = datos.desempleo?.valor ? datos.desempleo.valor.toFixed(1) : 'N/D';
        const desempleoAnio = datos.desempleo?.año || '2024';
        const deuda = datos.deuda?.valor ? datos.deuda.valor.toFixed(1) : 'N/D';
        const deudaAnio = datos.deuda?.año || '2024';
        
        // Nuevos indicadores sociales
        const densidad = datos.densidad?.valor ? datos.densidad.valor.toFixed(1) : 'N/D';
        const densidadAnio = datos.densidad?.año || '2024';
        const esperanzaVida = datos.esperanzaVida?.valor ? datos.esperanzaVida.valor.toFixed(1) : 'N/D';
        const esperanzaAnio = datos.esperanzaVida?.año || '2024';
        
        container.innerHTML = `
            <div class="dashboard-real">
                <div class="dashboard-header">
                    <div class="pais-titulo">
                        <span class="pais-bandera">${this.getBandera(iso3)}</span>
                        <h2>${nombre}</h2>
                    </div>
                    <span class="pais-estado">🟢 ESTABLE</span>
                </div>
                
                <!-- INDICADORES ECONÓMICOS -->
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
                </div>
                
                <!-- INDICADORES SOCIALES -->
                <div class="seccion-titulo">👥 SOCIAL</div>
                <div class="indicadores-grid">
                    <div class="indicador-card">
                        <div class="indicador-icono">🗺️</div>
                        <div class="indicador-valor">${densidad}</div>
                        <div class="indicador-label">Densidad (hab/km²)</div>
                        <div class="indicador-año">${densidadAnio}</div>
                    </div>
                    <div class="indicador-card">
                        <div class="indicador-icono">❤️</div>
                        <div class="indicador-valor">${esperanzaVida}</div>
                        <div class="indicador-label">Esperanza de vida</div>
                        <div class="indicador-año">${esperanzaAnio}</div>
                    </div>
                </div>
                
                <!-- BOTONES DE SECCIÓN -->
                <div class="info-botones">
                    <button class="info-btn" data-seccion="economia">📊 Economía</button>
                    <button class="info-btn" data-seccion="leyes">⚖️ Leyes</button>
                    <button class="info-btn" data-seccion="geopolitica">🏛️ Geopolítica</button>
                    <button class="info-btn" data-seccion="social">👥 Social</button>
                    <button class="info-btn" data-seccion="clima">🌍 Clima</button>
                </div>
                
                <div class="dashboard-fuentes">📚 Fuentes: Banco Mundial · Datos oficiales</div>
            </div>
        `;
        
        // Vincular eventos de los botones
        this.vincularEventosBotones();
    },
    
    vincularEventosBotones: function() {
        const botones = document.querySelectorAll('.info-btn');
        botones.forEach(btn => {
            btn.removeEventListener('click', this.handleClick);
            btn.addEventListener('click', this.handleClick.bind(this));
        });
    },
    
    handleClick: function(e) {
        const seccion = e.currentTarget.dataset.seccion;
        console.log(`📂 Sección seleccionada: ${seccion}`);
        alert(`📊 Sección "${seccion}" - Próximamente disponible con datos reales`);
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
