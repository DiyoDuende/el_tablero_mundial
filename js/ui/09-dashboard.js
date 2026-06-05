// js/ui/09-dashboard.js
var DashboardReal = {
    async mostrar(iso3, nivel, nombreLugar) {
        if (!iso3) return;
        if (!window.APIBancoMundial || !window.APIBancoMundial.isSoportado(iso3)) return;
        
        var container = document.getElementById('dashboard-container');
        if (!container) return;
        
        container.innerHTML = '<div class="loading-spinner">🌐 Cargando datos del Banco Mundial...</div>';
        
        var datosRaw = await window.CacheDatos.obtenerDatos(iso3);
        if (!datosRaw || !datosRaw.pib) {
            container.innerHTML = '<div class="dashboard-error">⚠️ No se pudieron obtener datos</div>';
            return;
        }
        
        var datos = NormalizadorDatos.normalizar(datosRaw, iso3, nivel || 'pais', nombreLugar);
        var datosFormateados = NormalizadorDatos.formatearParaDashboard(datos);
        
        if (!datosFormateados) {
            container.innerHTML = '<div class="dashboard-error">⚠️ Error formateando datos</div>';
            return;
        }
        
        var i = datosFormateados.indicadores;
        
        container.innerHTML = `
            <div class="dashboard-real">
                <div class="dashboard-header">
                    <div class="pais-titulo">
                        <span class="pais-bandera">${this.getBandera(iso3)}</span>
                        <h2>${datosFormateados.nombre}</h2>
                    </div>
                    <span class="pais-nivel">${datosFormateados.nivel}</span>
                </div>
                
                <div class="indicadores-grid">
                    <div class="indicador-card"><div class="indicador-icono">💰</div><div class="indicador-valor">${i.pib}</div><div class="indicador-label">PIB per cápita</div><div class="indicador-año">${i.pib_anio}</div></div>
                    <div class="indicador-card"><div class="indicador-icono">📈</div><div class="indicador-valor">${i.inflacion}</div><div class="indicador-label">Inflación</div><div class="indicador-año">${i.inflacion_anio}</div></div>
                    <div class="indicador-card"><div class="indicador-icono">👥</div><div class="indicador-valor">${i.desempleo}</div><div class="indicador-label">Desempleo</div><div class="indicador-año">${i.desempleo_anio}</div></div>
                    <div class="indicador-card"><div class="indicador-icono">🏛️</div><div class="indicador-valor">${i.deuda}</div><div class="indicador-label">Deuda pública</div><div class="indicador-año">${i.deuda_anio}</div></div>
                    <div class="indicador-card"><div class="indicador-icono">🌍</div><div class="indicador-valor">${i.poblacion}</div><div class="indicador-label">Población</div><div class="indicador-año">-</div></div>
                    <div class="indicador-card"><div class="indicador-icono">🗺️</div><div class="indicador-valor">${i.densidad}</div><div class="indicador-label">Densidad</div><div class="indicador-año">${i.densidad_anio}</div></div>
                    <div class="indicador-card"><div class="indicador-icono">❤️</div><div class="indicador-valor">${i.esperanza_vida}</div><div class="indicador-label">Esperanza de vida</div><div class="indicador-año">${i.esperanza_anio}</div></div>
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
        console.log('📂 Sección seleccionada:', seccion);
        alert('📊 Sección "' + seccion + '" - Próximamente disponible');
    },
    
    getBandera: function(iso3) {
        var banderas = {
            'ESP': '🇪🇸', 'FRA': '🇫🇷', 'DEU': '🇩🇪', 'ITA': '🇮🇹', 'PRT': '🇵🇹',
            'GBR': '🇬🇧', 'IRL': '🇮🇪', 'NLD': '🇳🇱', 'BEL': '🇧🇪', 'AUT': '🇦🇹',
            'CHE': '🇨🇭', 'SWE': '🇸🇪', 'NOR': '🇳🇴', 'DNK': '🇩🇰', 'FIN': '🇫🇮',
            'POL': '🇵🇱', 'USA': '🇺🇸', 'CAN': '🇨🇦', 'MEX': '🇲🇽', 'BRA': '🇧🇷',
            'ARG': '🇦🇷', 'CHL': '🇨🇱', 'COL': '🇨🇴', 'PER': '🇵🇪', 'CHN': '🇨🇳',
            'JPN': '🇯🇵', 'KOR': '🇰🇷', 'IND': '🇮🇳', 'RUS': '🇷🇺', 'AUS': '🇦🇺', 'ZAF': '🇿🇦'
        };
        return banderas[iso3] || '🌍';
    }
};

window.DashboardReal = DashboardReal;
