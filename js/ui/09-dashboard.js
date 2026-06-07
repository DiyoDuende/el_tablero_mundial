// js/ui/09-dashboard.js
// ============================================
// DASHBOARD REAL - Versión robusta con INE
// ============================================

var DashboardReal = {
    getNombreNivel: function(nivel) {
        const niveles = {
            pais: 'País',
            comunidad: 'Comunidad Autónoma',
            provincia: 'Provincia',
            municipio: 'Municipio',
            lugar: 'Punto geográfico'
        };
        return niveles[nivel] || nivel;
    },

    async mostrar(iso3, nivel, nombreMostrar) {
    try {
        console.log("📊 Dashboard.mostrar:", { iso3, nivel, nombreMostrar });
        
        var container = document.getElementById('dashboard-container');
        if (!container) {
            console.warn("⚠️ dashboard-container no encontrado");
            return;
        }
        
        // CASO 1: Si es un lugar genérico (sin ISO3 válido o nivel 'lugar')
        if (nivel === 'lugar' || !iso3 || iso3 === 'undefined' || iso3 === 'null') {
            this.mostrarDashboardLugar(nombreMostrar || "Lugar", 'ESP');
            return;
        }
        
        // Verificar APIBancoMundial
        if (!window.APIBancoMundial) {
            container.innerHTML = '<div class="dashboard-error">⚠️ Sistema de datos no disponible</div>';
            return;
        }
        
        if (!APIBancoMundial.isSoportado(iso3)) {
            // Si el país no está soportado, mostrar mensaje amigable
            container.innerHTML = `<div class="dashboard-error">⚠️ Datos no disponibles para ${nombreMostrar || iso3}</div>`;
            return;
        }
        
        // CASO 2: Si es nivel inferior (comunidad, provincia) y tenemos INE
        if (nivel !== 'pais' && nivel !== 'lugar' && nombreMostrar) {
            if (window.INE_API && typeof window.INE_API.getDatosPorNombre === 'function') {
                console.log("🔍 Consultando INE para:", nombreMostrar);
                var datosINE = await INE_API.getDatosPorNombre(nombreMostrar);
                if (datosINE && datosINE.pib_percapita && datosINE.pib_percapita.valor != null) {
                    this.mostrarDashboardINE(datosINE, nombreMostrar);
                    return;
                }
            }
        }
        
        // CASO 3: Datos del país (Banco Mundial)
        container.innerHTML = '<div class="loading-spinner">🌐 Cargando datos del Banco Mundial...</div>';
        
        if (!window.CacheDatos) throw new Error("CacheDatos no disponible");
        
        var datosRaw = await window.CacheDatos.obtenerDatos(iso3);
        if (!datosRaw || !datosRaw.pib) throw new Error("Datos no disponibles");
        
        if (!window.NormalizadorDatos) throw new Error("NormalizadorDatos no disponible");
        
        var datos = NormalizadorDatos.normalizar(datosRaw, iso3, nivel || 'pais', nombreMostrar);
        var formateados = NormalizadorDatos.formatearParaDashboard(datos);
        
        if (!formateados) throw new Error("Error formateando datos");
        
        var i = formateados.indicadores;
        var nombre = nombreMostrar || formateados.nombre;
        var nombreNivel = this.getNombreNivel(nivel || formateados.nivel);
        
        container.innerHTML = `
            <div class="dashboard-real">
                <div class="dashboard-header">
                    <div class="pais-titulo">
                        <span class="pais-bandera">${this.getBandera(iso3)}</span>
                        <h2>${this.escapeHTML(nombre)}</h2>
                    </div>
                    <span class="pais-nivel">${nombreNivel}</span>
                </div>
                <div class="indicadores-grid">
                    <div class="indicador-card"><div class="indicador-icono">💰</div><div class="indicador-valor">${this.escapeHTML(i.pib)}</div><div class="indicador-label">PIB per cápita</div><div class="indicador-año">${this.escapeHTML(i.pib_anio)}</div></div>
                    <div class="indicador-card"><div class="indicador-icono">📈</div><div class="indicador-valor">${this.escapeHTML(i.inflacion)}</div><div class="indicador-label">Inflación</div><div class="indicador-año">${this.escapeHTML(i.inflacion_anio)}</div></div>
                    <div class="indicador-card"><div class="indicador-icono">👥</div><div class="indicador-valor">${this.escapeHTML(i.desempleo)}</div><div class="indicador-label">Desempleo</div><div class="indicador-año">${this.escapeHTML(i.desempleo_anio)}</div></div>
                    <div class="indicador-card"><div class="indicador-icono">🏛️</div><div class="indicador-valor">${this.escapeHTML(i.deuda)}</div><div class="indicador-label">Deuda pública</div><div class="indicador-año">${this.escapeHTML(i.deuda_anio)}</div></div>
                    <div class="indicador-card"><div class="indicador-icono">🗺️</div><div class="indicador-valor">${this.escapeHTML(i.densidad)}</div><div class="indicador-label">Densidad</div><div class="indicador-año">${this.escapeHTML(i.densidad_anio)}</div></div>
                    <div class="indicador-card"><div class="indicador-icono">❤️</div><div class="indicador-valor">${this.escapeHTML(i.esperanza_vida)}</div><div class="indicador-label">Esperanza de vida</div><div class="indicador-año">${this.escapeHTML(i.esperanza_anio)}</div></div>
                </div>
                <div class="dashboard-fuentes">📚 Fuentes: Banco Mundial · Datos oficiales</div>
            </div>
        `;
        
    } catch (error) {
        console.error("❌ Error en DashboardReal.mostrar:", error);
        var container = document.getElementById('dashboard-container');
        if (container) {
            container.innerHTML = '<div class="dashboard-error">⚠️ Error cargando información</div>';
        }
    }
},

   mostrarDashboardLugar: function(nombre, iso3) {
    var container = document.getElementById('dashboard-container');
    if (!container) return;
    
    var nombreFinal = nombre || "Lugar sin nombre";
    var iso3Final = iso3 || 'ESP';
    
    container.innerHTML = `
        <div class="dashboard-real">
            <div class="dashboard-header">
                <div class="pais-titulo">
                    <span class="pais-bandera">${this.getBandera(iso3Final)}</span>
                    <h2>${this.escapeHTML(nombreFinal)}</h2>
                </div>
                <span class="pais-nivel">📍 Punto geográfico</span>
            </div>
            <div class="info-mensaje">
                <p>🌍 Información disponible próximamente.</p>
                <p>📊 Mientras tanto, explora el país o regiones cercanas.</p>
            </div>
            <div class="dashboard-fuentes">📚 Fuentes: OpenStreetMap · GADM</div>
        </div>
    `;
},


    getBandera: function(iso3) {
        const banderas = {
            'ESP': '🇪🇸', 'FRA': '🇫🇷', 'DEU': '🇩🇪', 'ITA': '🇮🇹',
            'PRT': '🇵🇹', 'GBR': '🇬🇧', 'USA': '🇺🇸', 'CAN': '🇨🇦',
            'MEX': '🇲🇽', 'BRA': '🇧🇷', 'ARG': '🇦🇷', 'CHL': '🇨🇱'
        };
        return banderas[iso3] || '🌍';
    },

    escapeHTML: function(str) {
        if (!str) return '';
        return String(str).replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
};

window.DashboardReal = DashboardReal;
console.log("✅ DashboardReal cargado");
