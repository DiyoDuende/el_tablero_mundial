// js/ui/09-dashboard.js
// ============================================
// DASHBOARD LUGAR - Muestra info de cualquier lugar
// ============================================

const DashboardLugar = {
    lugarActual: null,
    
    // Mostrar información de un lugar
    mostrar: async function(lugarId) {
        const lugar = Territorios.indice[lugarId];
        if (!lugar) {
            console.error('Lugar no encontrado:', lugarId);
            return;
        }
        
        this.lugarActual = lugar;
        this.mostrarLoading();
        
        // Obtener jerarquía
        const jerarquia = Territorios.getJerarquia(lugarId);
        
        // Obtener datos económicos (simulados por ahora)
        const datosEconomicos = await this.obtenerDatosEconomicos(lugar);
        
        // Generar HTML
        const html = this.generarHTML(lugar, jerarquia, datosEconomicos);
        
        const container = document.getElementById('dashboard-container');
        if (container) {
            container.innerHTML = html;
        }
        
        this.ocultarLoading();
    },
    
    // Obtener datos económicos (simulados - luego conectar API)
    obtenerDatosEconomicos: async function(lugar) {
        // Datos base por país (simulados)
        const datosPorPais = {
            espana: { pib_percapita: 30500, inflacion: 2.8, desempleo: 11.2, deuda: 110 },
            francia: { pib_percapita: 43500, inflacion: 2.5, desempleo: 7.4, deuda: 115 },
            alemania: { pib_percapita: 52700, inflacion: 2.3, desempleo: 3.1, deuda: 66 },
            italia: { pib_percapita: 35500, inflacion: 2.4, desempleo: 7.8, deuda: 144 },
            portugal: { pib_percapita: 24500, inflacion: 2.2, desempleo: 6.5, deuda: 113 },
            reino_unido: { pib_percapita: 46000, inflacion: 2.6, desempleo: 4.2, deuda: 100 },
            estados_unidos: { pib_percapita: 76300, inflacion: 3.2, desempleo: 3.8, deuda: 122 },
            china: { pib_percapita: 12800, inflacion: 0.5, desempleo: 5.2, deuda: 77 },
            japon: { pib_percapita: 39300, inflacion: 2.1, desempleo: 2.6, deuda: 260 },
            canada: { pib_percapita: 52000, inflacion: 2.4, desempleo: 5.0, deuda: 106 },
            mexico: { pib_percapita: 10500, inflacion: 4.5, desempleo: 3.0, deuda: 54 },
            brasil: { pib_percapita: 8900, inflacion: 4.2, desempleo: 9.3, deuda: 86 },
            argentina: { pib_percapita: 10800, inflacion: 89.0, desempleo: 6.5, deuda: 86 },
            chile: { pib_percapita: 15800, inflacion: 4.8, desempleo: 8.5, deuda: 38 },
            colombia: { pib_percapita: 6800, inflacion: 7.2, desempleo: 10.5, deuda: 59 },
            peru: { pib_percapita: 6900, inflacion: 3.8, desempleo: 7.2, deuda: 36 },
            india: { pib_percapita: 2500, inflacion: 4.9, desempleo: 7.1, deuda: 83 },
            indonesia: { pib_percapita: 4700, inflacion: 2.9, desempleo: 5.4, deuda: 40 },
            turquia: { pib_percapita: 10600, inflacion: 53.0, desempleo: 9.4, deuda: 31 },
            rusia: { pib_percapita: 13600, inflacion: 5.2, desempleo: 3.2, deuda: 17 },
        };
        
        // Si es país, devolver datos directos
        if (lugar.nivel === 'pais') {
            const datos = datosPorPais[lugar.id] || datosPorPais.espana;
            return {
                ...datos,
                es_estimacion: false,
                fuente: 'Banco Mundial (datos simulados)'
            };
        }
        
        // Si es región o municipio, escalar desde el país
        const paisId = lugar.pais;
        const datosPais = datosPorPais[paisId] || datosPorPais.espana;
        
        // Factor de escala por población (simple)
        const poblacionPais = Territorios.paises[paisId]?.poblacion || 48000000;
        const factorEscala = Math.sqrt(lugar.poblacion / poblacionPais);
        
        return {
            pib_percapita: Math.round(datosPais.pib_percapita * (0.7 + factorEscala * 0.6)),
            inflacion: datosPais.inflacion,
            desempleo: Math.min(30, Math.max(3, datosPais.desempleo * (0.8 + factorEscala * 0.5))),
            deuda: datosPais.deuda,
            es_estimacion: true,
            fuente: 'Estimado basado en datos del país'
        };
    },
    
    // Generar HTML del dashboard
    generarHTML: function(lugar, jerarquia, datos) {
        const nivelTexto = this.getNivelTexto(lugar.nivel);
        const nivelColor = this.getNivelColor(lugar.nivel);
        
        // Formatear números
        const pibFormateado = datos.pib_percapita?.toLocaleString() || 'N/D';
        const poblacionFormateada = lugar.poblacion?.toLocaleString() || 'N/D';
        
        // Determinar colores para indicadores
        const pibColor = this.getPIBColor(datos.pib_percapita);
        const inflacionColor = this.getInflacionColor(datos.inflacion);
        const desempleoColor = this.getDesempleoColor(datos.desempleo);
        
        return `
            <div class="dashboard-lugar" style="animation: fadeIn 0.3s ease;">
                <div class="lugar-header" style="border-bottom: 3px solid ${nivelColor};">
                    <div class="lugar-titulo">
                        <span class="lugar-icono">${this.getIcono(lugar.nivel)}</span>
                        <h2>${lugar.nombre}</h2>
                    </div>
                    <span class="lugar-nivel" style="background: ${nivelColor};">${nivelTexto}</span>
                </div>
                
                <div class="lugar-jerarquia">
                    ${jerarquia.map(l => `<span class="jerarquia-item">${l.nombre}</span>`).join(' <span class="jerarquia-flecha">→</span> ')}
                </div>
                
                <div class="lugar-stats">
                    <div class="stat-card">
                        <div class="stat-icono">🌍</div>
                        <div class="stat-valor">${poblacionFormateada}</div>
                        <div class="stat-label">Población</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icono">📍</div>
                        <div class="stat-valor">${lugar.lat?.toFixed(4) || '?'}°, ${lugar.lon?.toFixed(4) || '?'}°</div>
                        <div class="stat-label">Coordenadas</div>
                    </div>
                </div>
                
                <div class="lugar-economia">
                    <h3>💰 Indicadores Económicos</h3>
                    <div class="economia-grid">
                        <div class="economia-item">
                            <div class="economia-label">PIB per cápita</div>
                            <div class="economia-valor" style="color: ${pibColor};">${pibFormateado} €</div>
                            <div class="economia-barra"><div class="barra-llena" style="width: ${Math.min(100, datos.pib_percapita / 1000)}%; background: ${pibColor};"></div></div>
                        </div>
                        <div class="economia-item">
                            <div class="economia-label">Inflación</div>
                            <div class="economia-valor" style="color: ${inflacionColor};">${datos.inflacion}%</div>
                            <div class="economia-barra"><div class="barra-llena" style="width: ${Math.min(100, datos.inflacion * 5)}%; background: ${inflacionColor};"></div></div>
                        </div>
                        <div class="economia-item">
                            <div class="economia-label">Desempleo</div>
                            <div class="economia-valor" style="color: ${desempleoColor};">${datos.desempleo}%</div>
                            <div class="economia-barra"><div class="barra-llena" style="width: ${Math.min(100, datos.desempleo * 3)}%; background: ${desempleoColor};"></div></div>
                        </div>
                        <div class="economia-item">
                            <div class="economia-label">Deuda pública</div>
                            <div class="economia-valor">${datos.deuda}% PIB</div>
                            <div class="economia-barra"><div class="barra-llena" style="width: ${Math.min(100, datos.deuda)}%; background: #f9a825;"></div></div>
                        </div>
                    </div>
                    ${datos.es_estimacion ? '<div class="aviso-estimacion">⚠️ Datos estimados basados en el país</div>' : ''}
                    <div class="fuente-datos">📚 Fuente: ${datos.fuente}</div>
                </div>
                
                <div class="lugar-capas">
                    <h3>🗺️ Capas disponibles</h3>
                    <div class="capas-botones">
                        <button class="capa-mini" data-capa="economia" onclick="console.log('Capa economía')">💰 Economía</button>
                        <button class="capa-mini" data-capa="poblacion" onclick="console.log('Capa población')">👥 Población</button>
                        <button class="capa-mini" data-capa="energia" onclick="console.log('Capa energía')">⚡ Energía</button>
                        <button class="capa-mini" data-capa="clima" onclick="console.log('Capa clima')">🌍 Clima</button>
                        <button class="capa-mini" data-capa="geopolitica" onclick="console.log('Capa geopolítica')">🏛️ Geopolítica</button>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Utilidades
    getNivelTexto: function(nivel) {
        const niveles = {
            'pais': '🇺🇳 País',
            'region': '🏛️ Región',
            'municipio': '🏙️ Ciudad',
            'aldea': '🌾 Aldea'
        };
        return niveles[nivel] || '📍 Lugar';
    },
    
    getIcono: function(nivel) {
        const iconos = {
            'pais': '🇺🇳',
            'region': '🏛️',
            'municipio': '🏙️',
            'aldea': '🌾'
        };
        return iconos[nivel] || '📍';
    },
    
    getNivelColor: function(nivel) {
        const colores = {
            'pais': '#4fc3f7',
            'region': '#81c784',
            'municipio': '#ffb74d',
            'aldea': '#a1887f'
        };
        return colores[nivel] || '#888';
    },
    
    getPIBColor: function(pib) {
        if (pib > 50000) return '#2e7d32';
        if (pib > 30000) return '#43a047';
        if (pib > 15000) return '#f9a825';
        if (pib > 5000) return '#ef6c00';
        return '#d32f2f';
    },
    
    getInflacionColor: function(inflacion) {
        if (inflacion < 2) return '#2e7d32';
        if (inflacion < 4) return '#f9a825';
        if (inflacion < 10) return '#ef6c00';
        return '#d32f2f';
    },
    
    getDesempleoColor: function(desempleo) {
        if (desempleo < 5) return '#2e7d32';
        if (desempleo < 8) return '#43a047';
        if (desempleo < 12) return '#f9a825';
        if (desempleo < 20) return '#ef6c00';
        return '#d32f2f';
    },
    
    mostrarLoading: function() {
        const container = document.getElementById('dashboard-container');
        if (container) {
            container.innerHTML = '<div class="loading-spinner">🔄 Cargando información...</div>';
        }
    },
    
    ocultarLoading: function() {
        // El loading se reemplaza por el contenido
    }
};

window.DashboardLugar = DashboardLugar;
