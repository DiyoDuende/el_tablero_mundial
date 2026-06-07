// js/ui/09-dashboard.js
// ============================================
// DASHBOARD REAL - Datos del Banco Mundial
// ============================================

const DashboardReal = {
    async mostrar(iso3) {
        if (!iso3) return;
        if (!window.APIBancoMundial || !window.APIBancoMundial.isSoportado(iso3)) return;
        
        var container = document.getElementById('dashboard-container');
        if (!container) return;
        
        container.innerHTML = '<div class="loading-spinner">🌐 Cargando datos del Banco Mundial...</div>';
        
        var datos;
        try {
            datos = await window.CacheDatos.obtenerDatos(iso3);
        } catch(e) {
            console.error(e);
            container.innerHTML = '<div class="dashboard-error">⚠️ Error al cargar datos de ' + iso3 + '</div>';
            return;
        }
        
        if (!datos || !datos.pib) {
            container.innerHTML = '<div class="dashboard-error">⚠️ No se pudieron obtener datos de ' + iso3 + '</div>';
            return;
        }
        
        var nombre = window.APIBancoMundial.paisesSoportados[iso3];
        var pib = datos.pib.valor ? Math.round(datos.pib.valor).toLocaleString() : 'N/D';
        var pibAnio = datos.pib.año || '2024';
        var inflacion = datos.inflacion && datos.inflacion.valor ? datos.inflacion.valor.toFixed(1) : 'N/D';
        var inflacionAnio = datos.inflacion && datos.inflacion.año || '2024';
        var desempleo = datos.desempleo && datos.desempleo.valor ? datos.desempleo.valor.toFixed(1) : 'N/D';
        var desempleoAnio = datos.desempleo && datos.desempleo.año || '2024';
        var deuda = datos.deuda && datos.deuda.valor ? datos.deuda.valor.toFixed(1) : 'N/D';
        var deudaAnio = datos.deuda && datos.deuda.año || '2024';
        
        // Indicadores sociales
        var densidad = datos.densidad && datos.densidad.valor ? datos.densidad.valor.toFixed(1) : 'N/D';
        var densidadAnio = datos.densidad && datos.densidad.año || '2024';
        var esperanzaVida = datos.esperanzaVida && datos.esperanzaVida.valor ? datos.esperanzaVida.valor.toFixed(1) : 'N/D';
        var esperanzaAnio = datos.esperanzaVida && datos.esperanzaVida.año || '2024';
        
        container.innerHTML = `
            <div class="dashboard-real">
                <div class="dashboard-header">
                    <div class="pais-titulo">
                        <span class="pais-bandera">${this.getBandera(iso3)}</span>
                        <h2>${nombre}</h2>
                    </div>
                    <span class="pais-estado">🟢 ESTABLE</span>
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
        
        this.vincularEventosBotones();
    },
    
    vincularEventosBotones: function() {
        var botones = document.querySelectorAll('.info-btn');
        for (var i = 0; i < botones.length; i++) {
            var btn = botones[i];
            btn.removeEventListener('click', this.handleClick);
            btn.addEventListener('click', this.handleClick.bind(this));
        }
    },
    
    handleClick: function(e) {
        var seccion = e.currentTarget.dataset.seccion;
        console.log('📂 Sección seleccionada: ' + seccion);
        alert('📊 Sección "' + seccion + '" - Próximamente disponible con datos reales');
    },
    
    getBandera: function(iso3) {
        var banderas = {
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
