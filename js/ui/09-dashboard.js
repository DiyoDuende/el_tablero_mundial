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
            
            if (!iso3) {
                console.warn("⚠️ No hay ISO3");
                return;
            }
            
            const container = document.getElementById('dashboard-container');
            if (!container) {
                console.warn("⚠️ dashboard-container no encontrado");
                return;
            }
            
            if (!window.APIBancoMundial || !APIBancoMundial.isSoportado(iso3)) {
                container.innerHTML = `<div class="dashboard-error">⚠️ País no soportado: ${iso3}</div>`;
                return;
            }
            
            // Si es un lugar genérico
            if (nivel === 'lugar' && nombreMostrar) {
                this.mostrarDashboardLugar(nombreMostrar, iso3);
                return;
            }
            
            // Si es nivel inferior (comunidad, provincia, municipio) y tenemos INE
            if (nivel !== 'pais' && nivel !== 'lugar' && nombreMostrar) {
                if (window.INE_API && typeof window.INE_API.getDatosPorNombre === 'function') {
                    console.log("🔍 Consultando INE para:", nombreMostrar);
                    const datosINE = await INE_API.getDatosPorNombre(nombreMostrar);
                    if (datosINE && datosINE.pib_percapita && datosINE.pib_percapita.valor != null) {
                        this.mostrarDashboardINE(datosINE, nombreMostrar);
                        return;
                    }
                }
            }
            
            // Fallback: datos del país (Banco Mundial)
            container.innerHTML = '<div class="loading-spinner">🌐 Cargando datos...</div>';
            
            if (!window.CacheDatos) throw new Error("CacheDatos no disponible");
            
            const datosRaw = await window.CacheDatos.obtenerDatos(iso3);
            if (!datosRaw || !datosRaw.pib) throw new Error("Datos no disponibles");
            
            if (!window.NormalizadorDatos) throw new Error("NormalizadorDatos no disponible");
            
            const datos = NormalizadorDatos.normalizar(datosRaw, iso3, nivel || 'pais', nombreMostrar);
            const formateados = NormalizadorDatos.formatearParaDashboard(datos);
            
            if (!formateados) throw new Error("Error formateando datos");
            
            const i = formateados.indicadores;
            const nombre = nombreMostrar || formateados.nombre;
            
            container.innerHTML = `
                <div class="dashboard-real">
                    <div class="dashboard-header">
                        <div class="pais-titulo">
                            <span class="pais-bandera">${this.getBandera(iso3)}</span>
                            <h2>${this.escapeHTML(nombre)}</h2>
                        </div>
                        <span class="pais-nivel">${this.getNombreNivel(nivel)}</span>
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
            const container = document.getElementById('dashboard-container');
            if (container) {
                container.innerHTML = '<div class="dashboard-error">⚠️ Error cargando información</div>';
            }
        }
    },

    mostrarDashboardINE: function(datosINE, nombre) {
        const container = document.getElementById('dashboard-container');
        if (!container) return;
        
        const pib = (datosINE.pib_percapita && datosINE.pib_percapita.valor != null) ? 
            datosINE.pib_percapita.valor.toLocaleString() + ' €' : 'N/D';
        const pibAnio = (datosINE.pib_percapita && datosINE.pib_percapita.año) || 'N/D';
        const inflacion = (datosINE.inflacion && datosINE.inflacion.valor != null) ? 
            datosINE.inflacion.valor.toFixed(1) + '%' : 'N/D';
        const inflacionAnio = (datosINE.inflacion && datosINE.inflacion.año) || 'N/D';
        const desempleo = (datosINE.desempleo && datosINE.desempleo.valor != null) ? 
            datosINE.desempleo.valor.toFixed(1) + '%' : 'N/D';
        const desempleoAnio = (datosINE.desempleo && datosINE.desempleo.año) || 'N/D';
        
        container.innerHTML = `
            <div class="dashboard-real">
                <div class="dashboard-header">
                    <div class="pais-titulo">
                        <span class="pais-bandera">🇪🇸</span>
                        <h2>${this.escapeHTML(nombre)}</h2>
                    </div>
                    <span class="pais-nivel">Comunidad Autónoma</span>
                </div>
                <div class="indicadores-grid">
                    <div class="indicador-card"><div class="indicador-icono">💰</div><div class="indicador-valor">${pib}</div><div class="indicador-label">PIB per cápita</div><div class="indicador-año">${pibAnio}</div></div>
                    <div class="indicador-card"><div class="indicador-icono">📈</div><div class="indicador-valor">${inflacion}</div><div class="indicador-label">Inflación</div><div class="indicador-año">${inflacionAnio}</div></div>
                    <div class="indicador-card"><div class="indicador-icono">👥</div><div class="indicador-valor">${desempleo}</div><div class="indicador-label">Desempleo</div><div class="indicador-año">${desempleoAnio}</div></div>
                </div>
                <div class="dashboard-fuentes">📚 Fuentes: INE (Instituto Nacional de Estadística)</div>
            </div>
        `;
    },

    mostrarDashboardLugar: function(nombre, iso3) {
        const container = document.getElementById('dashboard-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="dashboard-real">
                <div class="dashboard-header">
                    <div class="pais-titulo">
                        <span class="pais-bandera">${this.getBandera(iso3)}</span>
                        <h2>${this.escapeHTML(nombre)}</h2>
                    </div>
                    <span class="pais-nivel">📍 Punto geográfico</span>
                </div>
                <div class="info-mensaje">
                    <p>🌍 Información disponible próximamente.</p>
                    <p>📊 Explora el país o regiones cercanas.</p>
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
