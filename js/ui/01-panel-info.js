// js/ui/01-panel-info.js
// ============================================
// PANEL INFO - Versión 4.0
// Dashboard completo con datos reales, leyes, geopolítica y alertas
// ============================================

const UIPanelInfo = {
    // Estado interno
    paisActual: null,
    datosActuales: null,
    seccionActual: 'general',
    
    // Configuración
    config: {
        usarDatosReales: true,
        mostrarAlertas: true,
        autoActualizar: true,
        intervaloActualizacion: 60000 // 1 minuto
    },
    
    // Elementos DOM
    elementos: {},
    
    init: function() {
        console.log('📊 Inicializando UIPanelInfo v4.0');
        
        try {
            // Capturar elementos del DOM
            this.elementos = {
                panelInfo: document.getElementById('panel-info'),
                paisNombre: document.getElementById('pais-nombre'),
                paisEstado: document.getElementById('pais-estado'),
                objetivosValor: document.getElementById('objetivos-valor'),
                infoAlertas: document.getElementById('info-alertas'),
                dashboardContainer: document.getElementById('dashboard-container')
            };
            
            // Configurar botones de sección
            const btnEconomia = document.querySelector('.info-btn[data-seccion="economia"]');
            const btnLeyes = document.querySelector('.info-btn[data-seccion="leyes"]');
            const btnGeopolitica = document.querySelector('.info-btn[data-seccion="geopolitica"]');
            const btnSocial = document.querySelector('.info-btn[data-seccion="social"]');
            const btnClima = document.querySelector('.info-btn[data-seccion="clima"]');
            
            if (btnEconomia) btnEconomia.addEventListener('click', () => this.mostrarSeccion('economia'));
            if (btnLeyes) btnLeyes.addEventListener('click', () => this.mostrarSeccion('leyes'));
            if (btnGeopolitica) btnGeopolitica.addEventListener('click', () => this.mostrarSeccion('geopolitica'));
            if (btnSocial) btnSocial.addEventListener('click', () => this.mostrarSeccion('social'));
            if (btnClima) btnClima.addEventListener('click', () => this.mostrarSeccion('clima'));
            
            // Configurar actualización automática
            if (this.config.autoActualizar) {
                setInterval(() => {
                    if (this.paisActual) {
                        this.actualizarDatos(this.paisActual);
                    }
                }, this.config.intervaloActualizacion);
            }
            
            // Escuchar eventos del mapa
            window.addEventListener('pais-seleccionado', (event) => {
                const { iso3, nombre, datos } = event.detail;
                this.mostrarPais(iso3, nombre, datos);
            });
            
            // Escuchar cambios de modo (realidad/juego)
            window.addEventListener('modo-cambiado', (event) => {
                this.actualizarModo(event.detail.modo);
            });
            
            console.log('✅ UIPanelInfo inicializado correctamente');
        } catch(e) {
            console.error('❌ Error en UIPanelInfo.init():', e.message);
        }
    },
    
    // ============================================
    // MOSTRAR PAÍS PRINCIPAL
    // ============================================
    
    mostrarPais: async function(iso3, nombre = null, datosPrecargados = null) {
        this.paisActual = iso3;
        
        console.log(`📌 Mostrando país: ${iso3} (${nombre || 'desconocido'})`);
        
        // Actualizar encabezado
        if (this.elementos.paisNombre) {
            this.elementos.paisNombre.innerHTML = this.getBandera(iso3) + ' ' + (nombre || iso3);
        }
        
        // Mostrar indicador de carga
        if (this.elementos.dashboardContainer) {
            this.elementos.dashboardContainer.innerHTML = this.generarCargandoHTML();
        }
        
        // Obtener datos
        let datos = datosPrecargados;
        if (!datos && window.CacheDatos && window.APIBancoMundial) {
            datos = await CacheDatos.obtenerDatos(iso3);
        }
        
        if (datos && datos.pib && datos.pib.valor) {
            this.datosActuales = datos;
            this.actualizarDashboard(datos);
            this.actualizarAlertas(datos);
            this.actualizarEstadoEstrategico(datos);
        } else {
            this.mostrarSinDatos(nombre || iso3);
        }
    },
    
    // ============================================
    // ACTUALIZAR DASHBOARD
    // ============================================
    
    actualizarDashboard: function(datos) {
        if (!this.elementos.dashboardContainer) return;
        
        const dashboardHTML = `
            <div class="dashboard-pais">
                <div class="dashboard-tabs">
                    <button class="tab-btn active" data-tab="economia">📊 Economía</button>
                    <button class="tab-btn" data-tab="leyes">📜 Leyes</button>
                    <button class="tab-btn" data-tab="geopolitica">🏛️ Geopolítica</button>
                    <button class="tab-btn" data-tab="social">👥 Social</button>
                </div>
                
                <div class="dashboard-contenido">
                    <!-- PESTAÑA ECONOMÍA -->
                    <div class="tab-contenido active" id="tab-economia">
                        ${this.generarEconomiaHTML(datos)}
                    </div>
                    
                    <!-- PESTAÑA LEYES -->
                    <div class="tab-contenido" id="tab-leyes">
                        ${this.generarLeyesHTML(this.paisActual)}
                    </div>
                    
                    <!-- PESTAÑA GEOPOLÍTICA -->
                    <div class="tab-contenido" id="tab-geopolitica">
                        ${this.generarGeopoliticaHTML(this.paisActual)}
                    </div>
                    
                    <!-- PESTAÑA SOCIAL -->
                    <div class="tab-contenido" id="tab-social">
                        ${this.generarSocialHTML(datos)}
                    </div>
                </div>
                
                <div class="dashboard-footer">
                    <div class="fuentes-info">
                        📚 Fuentes: Banco Mundial · INE · Eurostat · Datos.gob.es
                    </div>
                    <div class="actualizacion-info">
                        🕐 Actualizado: ${new Date().toLocaleString()}
                    </div>
                </div>
            </div>
        `;
        
        this.elementos.dashboardContainer.innerHTML = dashboardHTML;
        
        // Configurar eventos de las pestañas
        this.configurarTabs();
        
        // Configurar eventos de los botones de ley
        this.configurarBotonesLey();
    },
    
    generarEconomiaHTML: function(datos) {
        const pib = datos.pib?.valor || 'N/D';
        const pibAnual = datos.pib_per_capita?.valor || 'N/D';
        const inflacion = datos.inflacion?.valor || 'N/D';
        const desempleo = datos.desempleo?.valor || 'N/D';
        const deuda = datos.deuda?.valor || 'N/D';
        
        const pibClase = this.getClaseValor(pib, 30000);
        const inflacionClase = this.getClaseValor(inflacion, 2, true);
        const desempleoClase = this.getClaseValor(desempleo, 8, true);
        const deudaClase = this.getClaseValor(deuda, 60, true);
        
        return `
            <div class="economia-grid">
                <div class="indicador-card ${pibClase}">
                    <div class="indicador-icono">📊</div>
                    <div class="indicador-valor">${this.formatearNumero(pib)}</div>
                    <div class="indicador-label">PIB (millones USD)</div>
                    <div class="indicador-tendencia">${datos.pib?.anio || '2024'}</div>
                </div>
                
                <div class="indicador-card ${pibAnual !== 'N/D' ? pibClase : ''}">
                    <div class="indicador-icono">💰</div>
                    <div class="indicador-valor">${this.formatearNumero(pibAnual, 'USD')}</div>
                    <div class="indicador-label">PIB per cápita</div>
                    <div class="indicador-tendencia">${datos.pib_per_capita?.anio || '2024'}</div>
                </div>
                
                <div class="indicador-card ${inflacionClase}">
                    <div class="indicador-icono">📈</div>
                    <div class="indicador-valor">${this.formatearNumero(inflacion, '%')}</div>
                    <div class="indicador-label">Inflación</div>
                    <div class="indicador-tendencia">Interanual</div>
                </div>
                
                <div class="indicador-card ${desempleoClase}">
                    <div class="indicador-icono">👥</div>
                    <div class="indicador-valor">${this.formatearNumero(desempleo, '%')}</div>
                    <div class="indicador-label">Desempleo</div>
                    <div class="indicador-tendencia">Población activa</div>
                </div>
                
                <div class="indicador-card ${deudaClase}">
                    <div class="indicador-icono">🏦</div>
                    <div class="indicador-valor">${this.formatearNumero(deuda, '%')}</div>
                    <div class="indicador-label">Deuda pública</div>
                    <div class="indicador-tendencia">% PIB</div>
                </div>
            </div>
            
            <div class="analisis-economico">
                <h4>📋 Análisis automático</h4>
                <p>${this.generarAnalisisEconomico(datos)}</p>
            </div>
        `;
    },
    
    generarLeyesHTML: function(paisId) {
        if (!window.LEYES) {
            return '<p class="placeholder">📜 Módulo legislativo no disponible</p>';
        }
        
        const leyes = window.LEYES.getLeyesPais(paisId);
        if (!leyes || leyes.length === 0) {
            return '<p class="placeholder">📜 No hay leyes registradas para este país</p>';
        }
        
        let html = '<div class="leyes-lista">';
        for (const ley of leyes) {
            const interpretacion = window.InterpreteLegal?.analizarLey(ley.id);
            html += `
                <div class="ley-card" data-ley-id="${ley.id}">
                    <div class="ley-header">
                        <span class="ley-icono">📜</span>
                        <span class="ley-nombre">${ley.nombre}</span>
                        <span class="ley-estado ${ley.estado}">${ley.estado}</span>
                    </div>
                    ${interpretacion ? `
                        <div class="ley-explicacion">${interpretacion.explicacionCiudadana?.substring(0, 120)}...</div>
                        <div class="ley-impacto">
                            <span class="beneficiarios">✅ Beneficia: ${interpretacion.beneficiarios?.slice(0, 2).join(', ')}</span>
                            <span class="perjudicados">❌ Perjudica: ${interpretacion.perjudicados?.slice(0, 2).join(', ')}</span>
                        </div>
                    ` : ''}
                    <button class="btn-ver-ley-detalle" data-ley-id="${ley.id}">Ver análisis completo</button>
                </div>
            `;
        }
        html += '</div>';
        
        return html;
    },
    
    generarGeopoliticaHTML: function(paisId) {
        // Datos simulados de relaciones (en producción vendrían de una API)
        const relaciones = {
            'ESP': { aliados: ['PRT', 'FRA', 'DEU'], tensoCon: ['MAR'], neutral: ['GBR', 'ITA'] },
            'FRA': { aliados: ['DEU', 'ESP'], tensoCon: [], neutral: ['GBR', 'ITA'] },
            'DEU': { aliados: ['FRA', 'ESP'], tensoCon: [], neutral: ['GBR', 'ITA'] },
            'PRT': { aliados: ['ESP'], tensoCon: [], neutral: ['FRA', 'GBR'] }
        };
        
        const rel = relaciones[paisId] || { aliados: [], tensoCon: [], neutral: [] };
        
        return `
            <div class="geopolitica-info">
                <div class="relaciones-section">
                    <h4>🤝 Alianzas estratégicas</h4>
                    <div class="paises-lista">
                        ${rel.aliados.map(a => `<span class="pais-tag aliado">${this.getNombrePais(a)}</span>`).join('') || '<span>No hay alianzas registradas</span>'}
                    </div>
                </div>
                
                <div class="relaciones-section">
                    <h4>⚠️ Tensiones diplomáticas</h4>
                    <div class="paises-lista">
                        ${rel.tensoCon.map(t => `<span class="pais-tag tension">${this.getNombrePais(t)}</span>`).join('') || '<span>Sin tensiones activas</span>'}
                    </div>
                </div>
                
                <div class="relaciones-section">
                    <h4>🌐 Relaciones neutrales</h4>
                    <div class="paises-lista">
                        ${rel.neutral.map(n => `<span class="pais-tag neutral">${this.getNombrePais(n)}</span>`).join('') || '<span>No hay datos</span>'}
                    </div>
                </div>
                
                <div class="boton-simular">
                    <button id="btn-simular-geopolitica" class="btn-naranja">
                        🎮 Simular cambio de alianza
                    </button>
                </div>
            </div>
        `;
    },
    
    generarSocialHTML: function(datos) {
        const poblacion = datos.poblacion?.valor || 'N/D';
        const esperanzaVida = datos.esperanza_vida?.valor || 'N/D';
        
        // Indicadores sociales simulados (en producción vendrían de APIs reales)
        const indicadoresSociales = {
            desigualdad: '33.5',
            pobreza: '20.7',
            educacion: '78',
            sanidad: '85'
        };
        
        return `
            <div class="social-grid">
                <div class="indicador-card">
                    <div class="indicador-icono">👥</div>
                    <div class="indicador-valor">${this.formatearNumero(poblacion)}</div>
                    <div class="indicador-label">Población</div>
                </div>
                
                <div class="indicador-card">
                    <div class="indicador-icono">❤️</div>
                    <div class="indicador-valor">${esperanzaVida !== 'N/D' ? esperanzaVida + ' años' : 'N/D'}</div>
                    <div class="indicador-label">Esperanza de vida</div>
                </div>
                
                <div class="indicador-card warning">
                    <div class="indicador-icono">⚖️</div>
                    <div class="indicador-valor">${indicadoresSociales.desigualdad}%</div>
                    <div class="indicador-label">Coeficiente Gini</div>
                </div>
                
                <div class="indicador-card warning">
                    <div class="indicador-icono">📉</div>
                    <div class="indicador-valor">${indicadoresSociales.pobreza}%</div>
                    <div class="indicador-label">Tasa de pobreza</div>
                </div>
            </div>
            
            <div class="protestas-info">
                <h4>📊 Movilización social</h4>
                <div class="barra-protestas">
                    <div class="barra-label">Nivel de protestas:</div>
                    <div class="barra-contenedor">
                        <div class="barra-llena" style="width: 35%; background: #f57c00;"></div>
                    </div>
                    <div class="barra-valor">35%</div>
                </div>
                <p class="analisis-social">La tensión social es moderada. Los principales focos de protesta son vivienda y salarios.</p>
            </div>
        `;
    },
    
    // ============================================
    // ACTUALIZAR ALERTAS
    // ============================================
    
    actualizarAlertas: function(datos) {
        if (!this.elementos.infoAlertas) return;
        
        const alertas = [];
        
        // Alertas económicas
        if (datos.inflacion?.valor > 5) {
            alertas.push({ nivel: 'roja', texto: '🔴 Inflación alta (' + datos.inflacion.valor + '%)' });
        } else if (datos.inflacion?.valor > 3) {
            alertas.push({ nivel: 'amarilla', texto: '🟡 Inflación elevada (' + datos.inflacion.valor + '%)' });
        }
        
        if (datos.desempleo?.valor > 15) {
            alertas.push({ nivel: 'roja', texto: '🔴 Desempleo crítico (' + datos.desempleo.valor + '%)' });
        } else if (datos.desempleo?.valor > 10) {
            alertas.push({ nivel: 'amarilla', texto: '🟡 Desempleo alto (' + datos.desempleo.valor + '%)' });
        }
        
        if (datos.deuda?.valor > 100) {
            alertas.push({ nivel: 'roja', texto: '🔴 Deuda pública excesiva (' + datos.deuda.valor + '% PIB)' });
        } else if (datos.deuda?.valor > 80) {
            alertas.push({ nivel: 'amarilla', texto: '🟡 Deuda pública elevada (' + datos.deuda.valor + '% PIB)' });
        }
        
        // Alerta por defecto si no hay ninguna
        if (alertas.length === 0) {
            alertas.push({ nivel: 'verde', texto: '🟢 Indicadores económicos estables' });
        }
        
        this.elementos.infoAlertas.innerHTML = `
            <h4>⚠️ Alertas</h4>
            ${alertas.map(a => `<div class="alerta-item alerta-${a.nivel}">${a.texto}</div>`).join('')}
        `;
    },
    
    actualizarEstadoEstrategico: function(datos) {
        if (!this.elementos.paisEstado || !this.elementos.objetivosValor) return;
        
        // Calcular estado basado en indicadores
        let estado = 'ESTABLE';
        let estadoColor = '#2e7d32';
        let satisfaccion = 68;
        
        if (datos.inflacion?.valor > 10 || datos.desempleo?.valor > 20) {
            estado = 'CRÍTICO';
            estadoColor = '#b71c1c';
            satisfaccion = 25;
        } else if (datos.inflacion?.valor > 5 || datos.desempleo?.valor > 15) {
            estado = 'TENSIÓN';
            estadoColor = '#d32f2f';
            satisfaccion = 40;
        } else if (datos.inflacion?.valor > 3 || datos.desempleo?.valor > 10) {
            estado = 'INQUIETO';
            estadoColor = '#f57c00';
            satisfaccion = 55;
        }
        
        this.elementos.paisEstado.innerHTML = `<span style="color: ${estadoColor}">🟢 ${estado}</span>`;
        this.elementos.objetivosValor.innerHTML = satisfaccion + '%';
    },
    
    actualizarModo: function(modo) {
        const modoBadge = document.getElementById('modo-badge');
        if (modoBadge) {
            if (modo === 'juego') {
                modoBadge.innerHTML = '🎮 MODO JUEGO';
                modoBadge.style.background = '#b27c2c';
            } else {
                modoBadge.innerHTML = '🌐 MODO REAL';
                modoBadge.style.background = '#2e7d32';
            }
        }
        
        // Refrescar datos si es necesario
        if (this.paisActual) {
            this.actualizarDatos(this.paisActual);
        }
    },
    
    async actualizarDatos(iso3) {
        if (window.CacheDatos) {
            const nuevosDatos = await CacheDatos.obtenerDatos(iso3, { forzarActualizacion: true });
            if (nuevosDatos) {
                this.datosActuales = nuevosDatos;
                this.actualizarDashboard(nuevosDatos);
                this.actualizarAlertas(nuevosDatos);
                this.actualizarEstadoEstrategico(nuevosDatos);
            }
        }
    },
    
    mostrarSeccion: function(seccion) {
        this.seccionActual = seccion;
        console.log('📂 Mostrar sección:', seccion);
        
         // Cambiar pestaña activa en el dashboard
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContenidos = document.querySelectorAll('.tab-contenido');
        
        tabBtns.forEach(btn => {
            const tabId = btn.dataset.tab;
            if (tabId === seccion) {
                btn.classList.add('active');
                const contenido = document.getElementById(`tab-${seccion}`);
                if (contenido) contenido.classList.add('active');
            } else {
                btn.classList.remove('active');
                const contenido = document.getElementById(`tab-${btn.dataset.tab}`);
                if (contenido) contenido.classList.remove('active');
            }
        });
    },
    
    mostrarSinDatos: function(nombre) {
        if (this.elementos.dashboardContainer) {
            this.elementos.dashboardContainer.innerHTML = `
                <div class="dashboard-error">
                    <div class="error-icono">🌍</div>
                    <h3>${nombre}</h3>
                    <p>No tenemos datos económicos disponibles para este país.</p>
                    <p>Los datos del Banco Mundial están disponibles para la mayoría de los países.</p>
                    <button id="btn-simular-desde-error" class="btn-naranja" style="margin-top: 15px;">
                        🎮 Simular escenario para ${nombre}
                    </button>
                </div>
            `;
            
            const btnSimular = document.getElementById('btn-simular-desde-error');
            if (btnSimular) {
                btnSimular.addEventListener('click', () => {
                    if (window.UISimulador) {
                        document.getElementById('escenario-input').value = `simular impacto económico en ${nombre}`;
                        if (window.CONFIG && CONFIG.modo !== 'juego') {
                            document.getElementById('btn-modo-juego')?.click();
                        }
                        window.UISimulador.simular();
                    }
                });
            }
        }
        
        if (this.elementos.paisEstado) {
            this.elementos.paisEstado.innerHTML = '🟡 SIN DATOS';
        }
    },
    
    // ============================================
    // FUNCIONES AUXILIARES
    // ============================================
    
    configurarTabs: function() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                this.mostrarSeccion(tabId);
            });
        });
    },
    
    configurarBotonesLey: function() {
        const botones = document.querySelectorAll('.btn-ver-ley-detalle');
        botones.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const leyId = btn.dataset.leyId;
                if (window.mostrarPanelLegislativo) {
                    window.mostrarPanelLegislativo(this.paisActual, leyId);
                }
            });
        });
        
        const btnSimularGeo = document.getElementById('btn-simular-geopolitica');
        if (btnSimularGeo) {
            btnSimularGeo.addEventListener('click', () => {
                if (window.UISimulador) {
                    document.getElementById('escenario-input').value = `simular cambio de alianza para ${this.paisActual}`;
                    if (window.CONFIG && CONFIG.modo !== 'juego') {
                        document.getElementById('btn-modo-juego')?.click();
                    }
                    window.UISimulador.simular();
                }
            });
        }
    },
    
    getClaseValor: function(valor, umbralBueno, invertido = false) {
        if (valor === 'N/D' || valor === null) return '';
        const num = parseFloat(valor);
        if (isNaN(num)) return '';
        
        const esBueno = invertido ? num <= umbralBueno : num >= umbralBueno;
        if (esBueno) return 'bueno';
        if (num <= umbralBueno * 1.5) return 'regular';
        return 'malo';
    },
    
    formatearNumero: function(valor, sufijo = '') {
        if (valor === 'N/D' || valor === null) return 'N/D';
        const num = parseFloat(valor);
        if (isNaN(num)) return valor;
        
        if (Math.abs(num) >= 1e9) return (num / 1e9).toFixed(1) + 'B' + sufijo;
        if (Math.abs(num) >= 1e6) return (num / 1e6).toFixed(1) + 'M' + sufijo;
        if (sufijo === '%') return num.toFixed(1) + sufijo;
        return num.toLocaleString() + sufijo;
    },
    
    generarAnalisisEconomico: function(datos) {
        const partes = [];
        
        if (datos.pib?.valor) {
            const pib = datos.pib.valor;
            if (pib > 1e12) partes.push(`Es una economía de gran tamaño (${(pib/1e12).toFixed(1)}B USD).`);
            else if (pib > 1e11) partes.push(`Es una economía de tamaño medio-grande (${(pib/1e9).toFixed(0)}B USD).`);
            else partes.push(`Es una economía de tamaño pequeño (${(pib/1e9).toFixed(1)}B USD).`);
        }
        
        if (datos.inflacion?.valor) {
            const inflacion = datos.inflacion.valor;
            if (inflacion > 5) partes.push(`La inflación es alta (${inflacion}%), preocupando a consumidores y empresas.`);
            else if (inflacion > 2) partes.push(`La inflación es moderada (${inflacion}%), dentro de rangos controlables.`);
            else partes.push(`La inflación está controlada (${inflacion}%), buena para el poder adquisitivo.`);
        }
        
        if (datos.desempleo?.valor) {
            const desempleo = datos.desempleo.valor;
            if (desempleo > 15) partes.push(`El desempleo es crítico (${desempleo}%), requiere medidas urgentes.`);
            else if (desempleo > 8) partes.push(`El desempleo es elevado (${desempleo}%), un desafío social importante.`);
            else partes.push(`El desempleo es bajo (${desempleo}%), mercado laboral saludable.`);
        }
        
        return partes.join(' ') || 'No hay suficientes datos para un análisis completo.';
    },
    
    getBandera: function(iso3) {
        const banderas = {
            'ESP': '🇪🇸', 'FRA': '🇫🇷', 'DEU': '🇩🇪', 'ITA': '🇮🇹', 'PRT': '🇵🇹',
            'GBR': '🇬🇧', 'USA': '🇺🇸', 'CAN': '🇨🇦', 'MEX': '🇲🇽', 'BRA': '🇧🇷',
            'ARG': '🇦🇷', 'CHL': '🇨🇱', 'COL': '🇨🇴', 'PER': '🇵🇪', 'VEN': '🇻🇪',
            'CHN': '🇨🇳', 'JPN': '🇯🇵', 'KOR': '🇰🇷', 'IND': '🇮🇳', 'RUS': '🇷🇺',
            'AUS': '🇦🇺', 'ZAF': '🇿🇦', 'EGY': '🇪🇬', 'MAR': '🇲🇦', 'TUR': '🇹🇷'
        };
        return banderas[iso3] || '🌍';
    },
    
    getNombrePais: function(iso3) {
        const nombres = {
            'ESP': 'España', 'FRA': 'Francia', 'DEU': 'Alemania', 'ITA': 'Italia', 'PRT': 'Portugal',
            'GBR': 'Reino Unido', 'USA': 'Estados Unidos', 'CAN': 'Canadá', 'MEX': 'México',
            'BRA': 'Brasil', 'ARG': 'Argentina', 'CHL': 'Chile', 'COL': 'Colombia', 'PER': 'Perú',
            'CHN': 'China', 'JPN': 'Japón', 'KOR': 'Corea del Sur', 'IND': 'India', 'RUS': 'Rusia'
        };
        return nombres[iso3] || iso3;
    },
    
    generarCargandoHTML: function() {
        return `
            <div class="dashboard-cargando">
                <div class="cargando-spinner"></div>
                <p>Cargando datos económicos...</p>
                <p class="fuente-datos">Consultando Banco Mundial</p>
            </div>
        `;
    }
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UIPanelInfo.init());
} else {
    UIPanelInfo.init();
}

// Exportar para uso global
window.UIPanelInfo = UIPanelInfo;
