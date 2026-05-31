// js/ui/00-mapa.js
// ============================================
// MAPA MUNDIAL - Usando ISO3166-1-Alpha-3 del GeoJSON
// Versión 4.0 - Con coloreado dinámico y simulación integrada
// ============================================

let mapaGlobal = null;
let capaPaisesGlobal = null;
let capaColoreadoActual = null; // Para gestionar cambios de capa
let coloreadoActivo = true;     // Estado del coloreado

// Paleta de colores para diferentes métricas
const COLORES_METRICAS = {
    // PIB per cápita (verde = rico, rojo = pobre)
    pib: {
        dominio: [0, 5000, 15000, 30000, 50000, 100000],
        colores: ['#b71c1c', '#d32f2f', '#f57c00', '#fbc02d', '#8bc34a', '#2e7d32'],
        label: 'PIB per cápita (USD)'
    },
    // Inflación (verde = baja, rojo = alta)
    inflacion: {
        dominio: [0, 2, 5, 10, 20, 50],
        colores: ['#2e7d32', '#8bc34a', '#fbc02d', '#f57c00', '#d32f2f', '#b71c1c'],
        label: 'Inflación (%)'
    },
    // Desempleo (verde = bajo, rojo = alto)
    desempleo: {
        dominio: [0, 5, 10, 15, 20, 30],
        colores: ['#2e7d32', '#8bc34a', '#fbc02d', '#f57c00', '#d32f2f', '#b71c1c'],
        label: 'Desempleo (%)'
    },
    // Deuda pública (verde = baja, rojo = alta)
    deuda: {
        dominio: [0, 30, 60, 90, 120, 200],
        colores: ['#2e7d32', '#8bc34a', '#fbc02d', '#f57c00', '#d32f2f', '#b71c1c'],
        label: 'Deuda pública (% PIB)'
    }
};

// Variable global para la métrica actual
let metricaActual = 'pib';

const MapaGlobal = {
    config: {
        centro: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 10
    },
    
    // Cache de datos por país
    datosPorPais: new Map(),
    
    init: function() {
        if (mapaGlobal) return;
        
        mapaGlobal = L.map('mapa-mundial').setView(this.config.centro, this.config.zoom);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CartoDB',
            subdomains: 'abcd',
            maxZoom: 19,
            minZoom: 1
        }).addTo(mapaGlobal);
        
        // Añadir leyenda al mapa
        this.agregarLeyenda();
        
        // Añadir botón de restablecer colores
        this.agregarBotonRestablecer();
        
        this.cargarGeoJSON();
        console.log('🗺️ Mapa inicializado');
    },
    
    agregarLeyenda: function() {
        const legend = L.control({ position: 'bottomright' });
        
        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'info legend');
            div.style.backgroundColor = 'rgba(10, 18, 25, 0.9)';
            div.style.padding = '10px 15px';
            div.style.borderRadius = '8px';
            div.style.border = '1px solid #2a4050';
            div.style.fontSize = '12px';
            div.style.color = '#ecf0f3';
            div.style.maxWidth = '200px';
            div.id = 'mapa-leyenda';
            
            this.actualizarLeyenda(div);
            return div;
        };
        
        legend.addTo(mapaGlobal);
    },
    
    actualizarLeyenda: function(div) {
        if (!div) {
            div = document.getElementById('mapa-leyenda');
            if (!div) return;
        }
        
        const metrica = COLORES_METRICAS[metricaActual];
        if (!metrica) return;
        
        let html = `<div style="margin-bottom: 8px;"><strong>📊 ${metrica.label}</strong></div>`;
        
        for (let i = 0; i < metrica.dominio.length; i++) {
            const desde = metrica.dominio[i];
            const hasta = metrica.dominio[i + 1] || '∞';
            const color = metrica.colores[i];
            
            html += `
                <div style="display: flex; align-items: center; margin-bottom: 5px;">
                    <div style="background: ${color}; width: 20px; height: 20px; border-radius: 3px; margin-right: 8px;"></div>
                    <span>${desde.toLocaleString()} - ${hasta === '∞' ? '+' : hasta.toLocaleString()}</span>
                </div>
            `;
        }
        
        div.innerHTML = html;
    },
    
    agregarBotonRestablecer: function() {
        const control = L.control({ position: 'bottomleft' });
        
        control.onAdd = () => {
            const div = L.DomUtil.create('div', 'reset-colors-btn');
            div.innerHTML = '🎨 Restablecer colores';
            div.style.backgroundColor = 'rgba(10, 18, 25, 0.9)';
            div.style.padding = '8px 15px';
            div.style.borderRadius = '8px';
            div.style.border = '1px solid #2a4050';
            div.style.cursor = 'pointer';
            div.style.fontSize = '12px';
            div.style.color = '#ecf0f3';
            div.style.transition = 'all 0.2s';
            
            div.onmouseenter = () => {
                div.style.backgroundColor = '#2a7faa';
                div.style.borderColor = '#4fc3f7';
            };
            div.onmouseleave = () => {
                div.style.backgroundColor = 'rgba(10, 18, 25, 0.9)';
                div.style.borderColor = '#2a4050';
            };
            div.onclick = () => {
                this.restablecerColores();
            };
            
            return div;
        };
        
        control.addTo(mapaGlobal);
    },
    
    restablecerColores: function() {
        if (!capaPaisesGlobal) return;
        
        capaPaisesGlobal.eachLayer(layer => {
            layer.setStyle({
                color: '#4fc3f7',
                weight: 1,
                fillColor: '#1a3a4a',
                fillOpacity: 0.6
            });
        });
        
        coloreadoActivo = false;
        console.log('🎨 Colores restablecidos a valores neutros');
        
        // Mostrar notificación temporal
        this.mostrarNotificacion('Colores restablecidos', '#1a3a4a');
    },
    
    mostrarNotificacion: function(mensaje, color = '#2e7d32') {
        const notif = document.createElement('div');
        notif.textContent = mensaje;
        notif.style.position = 'fixed';
        notif.style.bottom = '20px';
        notif.style.left = '50%';
        notif.style.transform = 'translateX(-50%)';
        notif.style.backgroundColor = color;
        notif.style.color = 'white';
        notif.style.padding = '8px 20px';
        notif.style.borderRadius = '30px';
        notif.style.zIndex = '1000';
        notif.style.fontSize = '14px';
        notif.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        document.body.appendChild(notif);
        
        setTimeout(() => notif.remove(), 2000);
    },
    
    cargarGeoJSON: function() {
        const geoJSONurl = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';
        
        fetch(geoJSONurl)
            .then(response => response.json())
            .then(data => {
                capaPaisesGlobal = L.geoJSON(data, {
                    style: {
                        color: '#4fc3f7',
                        weight: 1,
                        fillColor: '#1a3a4a',
                        fillOpacity: 0.6
                    },
                    onEachFeature: this.onEachFeature.bind(this)
                }).addTo(mapaGlobal);
                
                window.capaPaisesGlobal = capaPaisesGlobal;
                
                console.log('✅ GeoJSON de países cargado');
                console.log('📊 Total de países en el mapa:', capaPaisesGlobal.getLayers().length);
                
                // Precargar datos para coloreado rápido
                this.precargarDatos();
                
                window.dispatchEvent(new CustomEvent('mapa-listos'));
            })
            .catch(error => {
                console.error('❌ Error cargando GeoJSON:', error);
            });
    },
    
    precargarDatos: async function() {
        if (!window.APIBancoMundial) {
            console.log('⚠️ API Banco Mundial no disponible para precarga');
            return;
        }
        
        const paises = [];
        capaPaisesGlobal.eachLayer(layer => {
            const iso3 = layer.feature?.properties?.['ISO3166-1-Alpha-3'];
            if (iso3 && iso3 !== '-99' && iso3.length === 3 && window.APIBancoMundial.isSoportado(iso3)) {
                paises.push(iso3);
            }
        });
        
        console.log(`🔄 Precargando datos para ${paises.length} países...`);
        
        // Precargar en lotes pequeños
        const lote = 10;
        for (let i = 0; i < paises.length; i += lote) {
            const batch = paises.slice(i, i + lote);
            await Promise.all(batch.map(async (iso3) => {
                const datos = await window.APIBancoMundial.obtenerDatosPais(iso3);
                if (datos) {
                    this.datosPorPais.set(iso3, datos);
                }
            }));
        }
        
        console.log('✅ Precarga completada');
        this.aplicarColoresPorMetrica();
    },
    
    onEachFeature: function(feature, layer) {
        const nombre = feature.properties?.name || 
                      feature.properties?.ADMIN || 
                      'Desconocido';
        
        // Tooltip con nombre
        layer.bindTooltip(nombre, { sticky: true });
        
        // Click: pasar el feature completo (contiene ISO3)
        layer.on('click', () => {
            this.onPaisClick(feature);
        });
        
        // Guardar referencia al layer para coloreado posterior
        layer.feature = feature;
    },
    
    onPaisClick: async function(feature) {
        const nombre = feature.properties?.name || 
                      feature.properties?.ADMIN || 
                      'Desconocido';
        
        const iso3 = feature.properties?.['ISO3166-1-Alpha-3'] || null;
        
        console.log(`🔍 Clic en país: ${nombre} (ISO3: ${iso3})`);
        
        // Mostrar panel de carga
        const container = document.getElementById('dashboard-container');
        if (container) {
            container.innerHTML = `
                <div class="dashboard-cargando">
                    <div class="cargando-spinner"></div>
                    <p>Cargando datos de ${nombre}...</p>
                </div>
            `;
        }
        
        // Validar ISO3
        if (iso3 && iso3 !== '-99' && iso3.length === 3) {
            // Intentar obtener datos reales
            if (window.APIBancoMundial && window.APIBancoMundial.isSoportado(iso3)) {
                const datos = await window.APIBancoMundial.obtenerDatosPais(iso3);
                
                if (datos && window.DashboardReal) {
                    window.DashboardReal.mostrar(iso3);
                    
                    // ** NUEVO: Disparar evento para el verificador/simulador **
                    window.dispatchEvent(new CustomEvent('pais-seleccionado', {
                        detail: { 
                            iso3: iso3, 
                            nombre: nombre,
                            datos: datos
                        }
                    }));
                    return;
                }
            }
            
            // Si no hay datos del Banco Mundial, mostrar mensaje
            console.log(`ℹ️ No hay datos económicos para ${nombre} (${iso3})`);
            if (container) {
                container.innerHTML = `
                    <div class="dashboard-error">
                        <div class="error-icono">🌍</div>
                        <h3>${nombre}</h3>
                        <p>No tenemos datos económicos disponibles para este país.</p>
                        <p>Los datos del Banco Mundial están disponibles para la mayoría de los países.</p>
                        <button id="btn-simular-desde-pais" class="btn-naranja" style="margin-top: 15px;">
                            🎮 Simular escenario para ${nombre}
                        </button>
                    </div>
                `;
                
                // ** NUEVO: Botón para simular desde el panel **
                const btnSimular = document.getElementById('btn-simular-desde-pais');
                if (btnSimular) {
                    btnSimular.addEventListener('click', () => {
                        if (window.UISimulador) {
                            document.getElementById('escenario-input').value = `simular impacto económico en ${nombre}`;
                            if (window.CONFIG && CONFIG.modo === 'realidad') {
                                document.getElementById('btn-modo-juego')?.click();
                            }
                            window.UISimulador.simular();
                        }
                    });
                }
            }
        } else {
            // País sin ISO3 válido
            if (container) {
                container.innerHTML = `
                    <div class="dashboard-error">
                        <div class="error-icono">🏝️</div>
                        <h3>${nombre}</h3>
                        <p>Este territorio no tiene código ISO3 estándar.</p>
                        <p>No podemos mostrar datos económicos para este lugar.</p>
                    </div>
                `;
            }
        }
    },
    
    // ============================================
    // NUEVAS FUNCIONES PARA COLOREADO DINÁMICO
    // ============================================
    
    aplicarColoresPorMetrica: function(metrica = metricaActual) {
        if (!capaPaisesGlobal) {
            console.log('⚠️ Capa de países no cargada aún');
            return;
        }
        
        metricaActual = metrica;
        const config = COLORES_METRICAS[metrica];
        if (!config) return;
        
        console.log(`🎨 Aplicando coloreado por ${config.label}...`);
        
        let coloreados = 0;
        let sinDatos = 0;
        
        capaPaisesGlobal.eachLayer(layer => {
            const iso3 = layer.feature?.properties?.['ISO3166-1-Alpha-3'];
            let valor = null;
            
            // Obtener valor según métrica
            if (iso3 && this.datosPorPais.has(iso3)) {
                const datos = this.datosPorPais.get(iso3);
                switch(metrica) {
                    case 'pib':
                        valor = datos.pib_per_capita;
                        break;
                    case 'inflacion':
                        valor = datos.inflacion;
                        break;
                    case 'desempleo':
                        valor = datos.desempleo;
                        break;
                    case 'deuda':
                        valor = datos.deuda;
                        break;
                }
            }
            
            let color;
            if (valor !== null && !isNaN(valor)) {
                color = this.obtenerColorPorValor(valor, config);
                coloreados++;
            } else {
                color = '#1a3a4a'; // Color neutro para países sin datos
                sinDatos++;
            }
            
            layer.setStyle({
                fillColor: color,
                fillOpacity: 0.8,
                color: '#ffffff',
                weight: 0.5
            });
        });
        
        console.log(`✅ Coloreado completado: ${coloreados} países coloreados, ${sinDatos} sin datos`);
        
        // Actualizar leyenda
        const legendDiv = document.getElementById('mapa-leyenda');
        if (legendDiv) {
            this.actualizarLeyenda(legendDiv);
        }
        
        coloreadoActivo = true;
    },
    
    obtenerColorPorValor: function(valor, config) {
        for (let i = 0; i < config.dominio.length; i++) {
            if (valor <= config.dominio[i]) {
                return config.colores[i];
            }
        }
        return config.colores[config.colores.length - 1];
    },
    
    // Actualizar colores según la métrica seleccionada (para usar desde UI)
    cambiarMetrica: function(metrica) {
        if (!COLORES_METRICAS[metrica]) {
            console.error(`Métrica no válida: ${metrica}`);
            return;
        }
        
        this.aplicarColoresPorMetrica(metrica);
        this.mostrarNotificacion(`Mostrando: ${COLORES_METRICAS[metrica].label}`, '#2a7faa');
    },
    
    // Función específica para colorear por PIB (mantener compatibilidad)
    aplicarColoresPIB: function() {
        this.cambiarMetrica('pib');
    },
    
    centrarEn: function(lat, lon, zoom = 6) {
        if (mapaGlobal) {
            mapaGlobal.setView([lat, lon], zoom);
        }
    },
    
    centrarEnPais: function(iso3) {
        if (!capaPaisesGlobal) return;
        
        let encontrado = false;
        capaPaisesGlobal.eachLayer(layer => {
            const layerIso3 = layer.feature?.properties?.['ISO3166-1-Alpha-3'];
            if (layerIso3 === iso3) {
                const latlng = layer.getBounds().getCenter();
                this.centrarEn(latlng.lat, latlng.lng, 5);
                layer.fireEvent('click');
                encontrado = true;
            }
        });
        
        if (!encontrado) {
            console.log(`⚠️ No se encontró el país con ISO3: ${iso3}`);
        }
    },
    
    getMapa: function() {
        return mapaGlobal;
    },
    
    getDatosPais: function(iso3) {
        return this.datosPorPais.get(iso3) || null;
    }
};

// ============================================
// BUSCADOR GLOBAL MEJORADO
// ============================================

const BuscadorGlobal = {
    init: function() {
        const input = document.getElementById('buscador-rapido');
        const btn = document.getElementById('btn-buscar');
        
        if (!input) {
            console.log('⚠️ Buscador no encontrado (id="buscador-rapido")');
            return;
        }
        
        const buscar = async () => {
            const texto = input.value.trim();
            if (!texto) return;
            
            console.log('🔍 Buscando:', texto);
            
            // ** NUEVO: Detectar si es una pregunta para el verificador **
            if (texto.includes('¿') || texto.includes('?') || 
                texto.toLowerCase().includes('es verdad') || 
                texto.toLowerCase().includes('comprobar')) {
                this.buscarEnVerificador(texto);
                return;
            }
            
            // ** NUEVO: Detectar si es una simulación **
            if (texto.toLowerCase().includes('qué pasaría si') || 
                texto.toLowerCase().includes('simular') ||
                texto.toLowerCase().includes('impacto de')) {
                this.buscarEnSimulador(texto);
                return;
            }
            
            // Buscar por código ISO3 directo
            if (texto.length === 3 && /^[A-Za-z]{3}$/.test(texto)) {
                const iso3 = texto.toUpperCase();
                if (window.APIBancoMundial && window.APIBancoMundial.isSoportado(iso3)) {
                    if (window.DashboardReal) {
                        window.DashboardReal.mostrar(iso3);
                        MapaGlobal.centrarEnPais(iso3);
                        return;
                    }
                }
            }
            
            // Buscar en el mapa por nombre
            if (window.capaPaisesGlobal) {
                for (let layer of window.capaPaisesGlobal.getLayers()) {
                    const nombre = layer.feature?.properties?.name || '';
                    if (nombre.toLowerCase() === texto.toLowerCase()) {
                        layer.fireEvent('click');
                        const bounds = layer.getBounds();
                        if (bounds.isValid()) {
                            mapaGlobal.fitBounds(bounds);
                        }
                        return;
                    }
                }
            }
            
            // ** NUEVO: Buscar en el módulo legislativo **
            if (window.LEYES && window.InterpreteLegal) {
                const leyesEncontradas = window.LEYES.buscarPorAmbito(texto.toLowerCase());
                if (leyesEncontradas && leyesEncontradas.length > 0) {
                    if (window.mostrarPanelLegislativo) {
                        window.mostrarPanelLegislativo(null, leyesEncontradas[0].id);
                    }
                    return;
                }
            }
            
            alert(`❌ No se encontró "${texto}"`);
        };
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') buscar();
        });
        
        if (btn) {
            btn.addEventListener('click', buscar);
        }
        
        console.log('🔍 Buscador global inicializado');
    },
    
    buscarEnVerificador: function(texto) {
        // Cambiar al modo realidad si es necesario
        if (window.CONFIG && CONFIG.modo !== 'realidad') {
            document.getElementById('btn-modo-real')?.click();
        }
        
        // Rellenar y mostrar el verificador
        const inputVerificador = document.getElementById('verificador-pregunta');
        if (inputVerificador) {
            inputVerificador.value = texto;
        }
        
        const panelVerificador = document.getElementById('verificador-panel');
        if (panelVerificador) {
            panelVerificador.style.display = 'block';
        }
        
        if (window.UIVerificador) {
            window.UIVerificador.verificar();
        }
        
        // Mostrar notificación
        MapaGlobal.mostrarNotificacion('🔍 Buscando en el Verificador Ciudadano...', '#2e7d32');
    },
    
    buscarEnSimulador: function(texto) {
        // Cambiar al modo juego automáticamente
        if (window.CONFIG && CONFIG.modo !== 'juego') {
            document.getElementById('btn-modo-juego')?.click();
        }
        
        // Rellenar el campo del simulador
        const inputSimulador = document.getElementById('escenario-input');
        if (inputSimulador) {
            inputSimulador.value = texto;
        }
        
        // Ejecutar simulación
        if (window.UISimulador) {
            window.UISimulador.simular();
        }
        
        // Mostrar panel de simulación
        const panelSimulador = document.getElementById('simulador-panel');
        if (panelSimulador) {
            panelSimulador.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Mostrar notificación
        MapaGlobal.mostrarNotificacion('🎮 Ejecutando simulación...', '#b27c2c');
    }
};

// ============================================
// CONTROL DE CAPAS DESDE LA UI
// ============================================

const ControlCapas = {
    init: function() {
        // Botones de capas en el panel lateral
        const btnPIB = document.querySelector('[data-capa="pib"]');
        const btnInflacion = document.querySelector('[data-capa="inflacion"]');
        const btnDesempleo = document.querySelector('[data-capa="desempleo"]');
        const btnDeuda = document.querySelector('[data-capa="deuda"]');
        
        if (btnPIB) {
            btnPIB.addEventListener('click', () => {
                MapaGlobal.cambiarMetrica('pib');
                this.resaltarBotonActivo(btnPIB);
            });
        }
        
        if (btnInflacion) {
            btnInflacion.addEventListener('click', () => {
                MapaGlobal.cambiarMetrica('inflacion');
                this.resaltarBotonActivo(btnInflacion);
            });
        }
        
        if (btnDesempleo) {
            btnDesempleo.addEventListener('click', () => {
                MapaGlobal.cambiarMetrica('desempleo');
                this.resaltarBotonActivo(btnDesempleo);
            });
        }
        
        if (btnDeuda) {
            btnDeuda.addEventListener('click', () => {
                MapaGlobal.cambiarMetrica('deuda');
                this.resaltarBotonActivo(btnDeuda);
            });
        }
        
        console.log('🎮 Control de capas inicializado');
    },
    
    resaltarBotonActivo: function(btnActivo) {
        const botones = document.querySelectorAll('[data-capa]');
        botones.forEach(btn => {
            btn.classList.remove('activo');
            btn.style.background = 'var(--bg-panel)';
        });
        btnActivo.classList.add('activo');
        btnActivo.style.background = 'var(--accent)';
    }
};

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    MapaGlobal.init();
    BuscadorGlobal.init();
    ControlCapas.init();
    
    // Escuchar evento de cambio de idioma para actualizar leyenda
    window.addEventListener('idioma-cambiado', () => {
        const legendDiv = document.getElementById('mapa-leyenda');
        if (legendDiv) {
            MapaGlobal.actualizarLeyenda(legendDiv);
        }
    });
});

// Exportar para uso global
window.MapaGlobal = MapaGlobal;
window.BuscadorGlobal = BuscadorGlobal;
window.ControlCapas = ControlCapas;
window.COLORES_METRICAS = COLORES_METRICAS;
