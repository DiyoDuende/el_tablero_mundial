// js/ui/03-simulador.js
// ============================================
// SIMULADOR - Tablero Mundial v4.0
// Integración completa con motor de simulación, cadena de impacto y análisis por IA
// ============================================

const UISimulador = {
    // Estado interno
    ultimaSimulacion: null,
    historialSimulaciones: [],
    
    // Configuración
    config: {
        guardarHistorial: true,
        maxHistorial: 20,
        mostrarCadenaImpacto: true,
        mostrarSugerencias: true,
        mostrarAnalisisIA: true
    },
    
    init: function() {
        console.log('⚡ Inicializando UISimulador v4.0');
        
        try {
            const btnSimular = document.getElementById('btn-simular');
            const inputEscenario = document.getElementById('escenario-input');
            const modoBadge = document.getElementById('modo-badge');
            
            if (btnSimular && inputEscenario) {
                btnSimular.addEventListener('click', () => this.simular());
                inputEscenario.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.simular();
                });
                console.log('✅ Simulador: eventos configurados');
            } else {
                console.log('ℹ️ Simulador: elementos no encontrados en el DOM');
            }
            
            // Escuchar cambios de modo
            window.addEventListener('modo-cambiado', (event) => {
                this.actualizarModo(event.detail.modo);
            });
            
            // Escuchar selección de país para contexto
            window.addEventListener('pais-seleccionado', (event) => {
                this.contextoPais = event.detail;
                console.log(`📍 Contexto de simulación actualizado: ${event.detail.nombre}`);
            });
            
            // Cargar historial guardado
            this.cargarHistorial();
            
            // Configurar sugerencias rápidas
            this.configurarSugerenciasRapidas();
            
            console.log('✅ UISimulador inicializado correctamente');
        } catch(e) {
            console.error('❌ Error en UISimulador.init():', e.message);
        }
    },
    
    // ============================================
    // ANÁLISIS DE ESCENARIO POR LENGUAJE NATURAL
    // ============================================
    
    analizarEscenario: function(texto) {
        const textoLower = texto.toLowerCase();
        
        // Detectar tipo de escenario
        let tipo = 'general';
        let poder = 'económico';
        let sector = 'energía';
        let mecanismo = 'inversión';
        let magnitud = 10;
        
        // Extraer magnitud (números)
        const magnitudMatch = textoLower.match(/(\d+)(?:\s*%|\s*porciento)/);
        if (magnitudMatch) {
            magnitud = parseInt(magnitudMatch[1]);
        }
        
        // Detectar poder
        const poderes = {
            'político': ['político', 'gobierno', 'elección', 'voto', 'parlamento', 'congreso'],
            'económico': ['económico', 'economía', 'pib', 'crecimiento', 'recesión'],
            'financiero': ['financiero', 'banca', 'banco', 'crédito', 'deuda', 'hipoteca'],
            'militar': ['militar', 'ejército', 'defensa', 'guerra', 'conflicto', 'tanque'],
            'social': ['social', 'ciudadano', 'protesta', 'huelga', 'manifestación'],
            'mediático': ['mediático', 'medios', 'prensa', 'televisión', 'redes sociales'],
            'tecnológico': ['tecnológico', 'tecnología', 'digital', 'internet', 'ia', 'inteligencia artificial']
        };
        
        for (let [p, palabras] of Object.entries(poderes)) {
            if (palabras.some(palabra => textoLower.includes(palabra))) {
                poder = p;
                break;
            }
        }
        
        // Detectar sector
        const sectores = {
            'energía': ['energía', 'petróleo', 'gas', 'eléctrico', 'luz', 'renovable', 'solar'],
            'educación': ['educación', 'colegio', 'universidad', 'escuela', 'profesor'],
            'sanidad': ['sanidad', 'salud', 'hospital', 'médico', 'sanitario'],
            'industria': ['industria', 'fábrica', 'manufactura', 'producción'],
            'tecnología': ['tecnología', 'software', 'hardware', 'chip', 'digital'],
            'agricultura': ['agricultura', 'campo', 'cosecha', 'alimento', 'sequía'],
            'vivienda': ['vivienda', 'casa', 'alquiler', 'hipoteca', 'piso'],
            'empleo': ['empleo', 'trabajo', 'paro', 'desempleo', 'salario']
        };
        
        for (let [s, palabras] of Object.entries(sectores)) {
            if (palabras.some(palabra => textoLower.includes(palabra))) {
                sector = s;
                break;
            }
        }
        
        // Detectar mecanismo
        const mecanismos = {
            'inversión': ['invertir', 'inversión', 'financiar', 'capital'],
            'impuestos': ['impuesto', 'iva', 'irpf', 'tributo', 'fiscal'],
            'subvenciones': ['subvención', 'ayuda', 'subsidio', 'beca'],
            'sanción': ['sanción', 'castigo', 'multa', 'embargo'],
            'regulación': ['regular', 'ley', 'norma', 'regulación', 'decreto'],
            'privatización': ['privatizar', 'privado', 'concesión']
        };
        
        for (let [m, palabras] of Object.entries(mecanismos)) {
            if (palabras.some(palabra => textoLower.includes(palabra))) {
                mecanismo = m;
                break;
            }
        }
        
        return {
            textoOriginal: texto,
            tipo: tipo,
            poder: poder,
            sector: sector,
            mecanismo: mecanismo,
            magnitud: magnitud,
            factorTerritorio: this.contextoPais ? 1.0 : 1.0
        };
    },
    
    // ============================================
    // SIMULACIÓN PRINCIPAL
    // ============================================
    
    simular: async function() {
        const input = document.getElementById('escenario-input');
        const resultadosDiv = document.getElementById('simulador-resultados');
        
        if (!input || !resultadosDiv) return;
        
        const escenario = input.value.trim();
        if (!escenario) return;
        
        // Verificar modo
        const modoActual = window.CONFIG?.modo || 'realidad';
        if (modoActual === 'realidad') {
            resultadosDiv.innerHTML = this.generarHTMLModoReal(escenario);
            return;
        }
        
        // Mostrar estado de carga
        resultadosDiv.innerHTML = this.generarHTMLCargando(escenario);
        
        try {
            // Analizar escenario
            const analisis = this.analizarEscenario(escenario);
            console.log('🔍 Análisis de escenario:', analisis);
            
            // Ejecutar simulación con el motor
            let resultadoSimulacion = null;
            
            if (window.MotorSimulacion) {
                // Usar el motor real
                resultadoSimulacion = window.MotorSimulacion.simular({
                    poder: analisis.poder,
                    sector: analisis.sector,
                    mecanismo: analisis.mecanismo,
                    factorTerritorio: analisis.factorTerritorio,
                    factorEscala: analisis.magnitud * 10
                });
            } else {
                // Fallback a simulación básica
                resultadoSimulacion = this.simularBasico(analisis);
            }
            
            // Buscar cadena de impacto relacionada
            let cadenaImpactoHTML = '';
            if (this.config.mostrarCadenaImpacto && window.VisorCadena) {
                const cadena = window.VisorCadena.buscarYMostrar(escenario);
                if (cadena && !cadena.includes('No se encontraron')) {
                    cadenaImpactoHTML = `<div class="cadena-integrada">${cadena}</div>`;
                }
            }
            
            // Generar sugerencias
            let sugerenciasHTML = '';
            if (this.config.mostrarSugerencias) {
                const sugerencias = this.generarSugerencias(resultadoSimulacion);
                if (sugerencias.length > 0) {
                    sugerenciasHTML = this.generarHTMLSugerencias(sugerencias);
                }
            }
            
            // Generar análisis IA
            let analisisIAHTML = '';
            if (this.config.mostrarAnalisisIA && resultadoSimulacion) {
                analisisIAHTML = this.generarHTMLAnalisisIA(resultadoSimulacion, analisis);
            }
            
            // Guardar en historial
            if (this.config.guardarHistorial) {
                this.guardarEnHistorial(escenario, resultadoSimulacion);
            }
            
            // Generar HTML completo
            resultadosDiv.innerHTML = this.generarHTMLResultado(escenario, resultadoSimulacion, cadenaImpactoHTML, sugerenciasHTML, analisisIAHTML);
            
            // Configurar botones del resultado
            this.configurarBotonesResultado();
            
            this.ultimaSimulacion = { escenario, resultado: resultadoSimulacion };
            
        } catch(error) {
            console.error('❌ Error en simulación:', error);
            resultadosDiv.innerHTML = this.generarHTMLError(error.message);
        }
    },
    
    simularBasico: function(analisis) {
        // Simulación básica cuando el motor no está disponible
        const base = (analisis.magnitud / 100) * 0.5;
        
        return {
            exito: true,
            impactos: {
                económico: Math.round(base * 100 * 1.0),
                geopolítico: Math.round(base * 100 * 0.8),
                social: Math.round(base * 100 * 0.5)
            },
            impactosBase: {
                económico: Math.round(base * 100 * 1.0),
                geopolítico: Math.round(base * 100 * 0.8),
                social: Math.round(base * 100 * 0.5)
            },
            efectoCadena: {
                económico: { total: Math.round(base * 100 * 1.0), cadena: 'económico → empleo → consumo' },
                social: { total: Math.round(base * 100 * 0.5), cadena: 'social → protestas → estabilidad' }
            },
            nivelRiesgo: { valor: Math.round(35 + base * 50), nivel: '⚠️ Competitivo' },
            sugerencias: [],
            timestamp: new Date().toISOString()
        };
    },
    
    // ============================================
    // GENERACIÓN DE HTML
    // ============================================
    
    generarHTMLCargando: function(escenario) {
        return `
            <div class="simulacion-cargando">
                <div class="spinner"></div>
                <h4>🎮 Simulando: "${this.truncarTexto(escenario, 50)}"</h4>
                <p>Analizando impactos y generando cadena de efectos...</p>
            </div>
        `;
    },
    
    generarHTMLModoReal: function(escenario) {
        return `
            <div class="simulacion-modo-real">
                <div class="modo-real-icono">🌐</div>
                <h4>Modo REAL activado</h4>
                <p>Para simular escenarios como "<strong>${this.escapeHTML(escenario)}</strong>", activa primero el <strong>MODO JUEGO</strong>.</p>
                <button id="btn-activar-modo-juego-simulador" class="btn-naranja">🎮 Activar modo juego</button>
                <p class="fuente-datos">⚠️ La simulación solo está disponible en modo JUEGO.</p>
            </div>
        `;
    },
    
    generarHTMLResultado: function(escenario, resultado, cadenaImpacto, sugerencias, analisisIA) {
        const impactos = resultado.impactos || resultado;
        const nivelRiesgo = resultado.nivelRiesgo || { nivel: '⚠️ Competitivo', valor: 45 };
        
        // Determinar colores según impacto
        const colorEconomico = impactos.económico >= 0 ? '#2e7d32' : '#d32f2f';
        const colorSocial = impactos.social >= 0 ? '#2e7d32' : '#f57c00';
        const colorGeopolitico = impactos.geopolítico >= 0 ? '#2e7d32' : '#f57c00';
        
        const barraEconomico = Math.min(100, Math.abs(impactos.económico));
        const barraSocial = Math.min(100, Math.abs(impactos.social));
        const barraGeopolitico = Math.min(100, Math.abs(impactos.geopolítico));
        
        return `
            <div class="simulacion-resultado">
                <div class="resultado-header">
                    <h4>🎮 SIMULACIÓN</h4>
                    <span class="simulacion-badge">MODO JUEGO</span>
                </div>
                
                <div class="resultado-escenario">
                    <strong>📌 Escenario:</strong> "${this.escapeHTML(escenario)}"
                </div>
                
                <div class="resultado-impactos">
                    <h5>📊 IMPACTOS ESTIMADOS</h5>
                    
                    <div class="impacto-grupo">
                        <div class="impacto-label">
                            <span>💰 Económico</span>
                            <span style="color: ${colorEconomico}">${impactos.económico > 0 ? '+' : ''}${impactos.económico}%</span>
                        </div>
                        <div class="impacto-barra">
                            <div class="impacto-barra-llena" style="width: ${barraEconomico}%; background: ${colorEconomico};"></div>
                        </div>
                    </div>
                    
                    <div class="impacto-grupo">
                        <div class="impacto-label">
                            <span>👥 Social</span>
                            <span style="color: ${colorSocial}">${impactos.social > 0 ? '+' : ''}${impactos.social}%</span>
                        </div>
                        <div class="impacto-barra">
                            <div class="impacto-barra-llena" style="width: ${barraSocial}%; background: ${colorSocial};"></div>
                        </div>
                    </div>
                    
                    <div class="impacto-grupo">
                        <div class="impacto-label">
                            <span>🌍 Geopolítico</span>
                            <span style="color: ${colorGeopolitico}">${impactos.geopolítico > 0 ? '+' : ''}${impactos.geopolítico}%</span>
                        </div>
                        <div class="impacto-barra">
                            <div class="impacto-barra-llena" style="width: ${barraGeopolitico}%; background: ${colorGeopolitico};"></div>
                        </div>
                    </div>
                </div>
                
                ${resultado.efectoCadena ? `
                    <div class="resultado-cadena">
                        <h5>🔗 CADENA DE EFECTOS</h5>
                        <div class="cadena-efectos">
                            <div class="cadena-eslabon">💰 ${resultado.efectoCadena.económico?.cadena || 'Económico'}</div>
                            <div class="cadena-flecha">↓</div>
                            <div class="cadena-eslabon">👥 ${resultado.efectoCadena.social?.cadena || 'Social'}</div>
                        </div>
                    </div>
                ` : ''}
                
                <div class="resultado-riesgo">
                    <h5>⚠️ RIESGO GLOBAL</h5>
                    <div class="riesgo-indicador" style="color: ${nivelRiesgo.color || '#f57c00'}">
                        ${nivelRiesgo.nivel} (${nivelRiesgo.valor} puntos)
                    </div>
                    <div class="riesgo-barra">
                        <div class="riesgo-barra-llena" style="width: ${nivelRiesgo.valor}%; background: ${nivelRiesgo.color || '#f57c00'};"></div>
                    </div>
                </div>
                
                ${sugerencias}
                ${analisisIA}
                ${cadenaImpacto}
                
                <div class="resultado-acciones">
                    <button class="btn-exportar-simulacion" data-escenario="${this.escapeHTML(escenario)}">📤 Exportar simulación</button>
                    <button class="btn-reiniciar-simulador" onclick="document.getElementById('escenario-input').value = ''; document.getElementById('simulador-resultados').innerHTML = '<p class=\"placeholder\">🎲 Escribe un escenario para simular</p>';">🔄 Nueva simulación</button>
                </div>
                
                <div class="resultado-footer">
                    <p class="advertencia">⚠️ ESTO ES UNA SIMULACIÓN - Basada en modelos y datos históricos</p>
                    <p class="fuente-datos">📚 Motor de simulación v${window.MotorSimulacion?.version || '4.0'} · Datos históricos y modelos económicos</p>
                    <p class="timestamp">🕐 Simulación generada: ${new Date().toLocaleString()}</p>
                </div>
            </div>
        `;
    },
    
    generarHTMLSugerencias: function(sugerencias) {
        return `
            <div class="resultado-sugerencias">
                <h5>💡 SUGERENCIAS ESTRATÉGICAS</h5>
                <ul>
                    ${sugerencias.map(s => `<li>${s}</li>`).join('')}
                </ul>
            </div>
        `;
    },
    
    generarHTMLAnalisisIA: function(resultado, analisis) {
        const impactos = resultado.impactos || resultado;
        
        // Análisis basado en los impactos
        let analisisTexto = '';
        if (impactos.económico < -20) {
            analisisTexto = 'El impacto económico es severo. Se recomiendan medidas de estímulo fiscal y apoyo a sectores afectados.';
        } else if (impactos.económico < -10) {
            analisisTexto = 'El impacto económico es significativo. Podría haber contracción del PIB y aumento del desempleo.';
        } else if (impactos.económico < 0) {
            analisisTexto = 'El impacto económico es moderado. Se prevé una desaceleración controlable.';
        } else {
            analisisTexto = 'El escenario tiene un impacto económico positivo. Podría impulsar el crecimiento y la inversión.';
        }
        
        if (impactos.social < -15) {
            analisisTexto += ' El malestar social aumentará considerablemente. Se recomienda diálogo con los sectores afectados.';
        } else if (impactos.social < -5) {
            analisisTexto += ' Podría haber protestas sociales y descontento ciudadano.';
        }
        
        if (impactos.geopolítico < -10) {
            analisisTexto += ' Las relaciones internacionales se tensarán. Se recomienda diplomacia preventiva.';
        }
        
        return `
            <div class="resultado-analisis-ia">
                <h5>🧠 ANÁLISIS ESTRATÉGICO (IA)</h5>
                <p>${analisisTexto}</p>
                <div class="analisis-detalle">
                    <span>🎯 Poder afectado: ${analisis.poder}</span>
                    <span>📂 Sector: ${analisis.sector}</span>
                    <span>⚙️ Mecanismo: ${analisis.mecanismo}</span>
                </div>
            </div>
        `;
    },
    
    generarHTMLError: function(mensaje) {
        return `
            <div class="simulacion-error">
                <div class="error-icono">⚠️</div>
                <h4>Error en la simulación</h4>
                <p>${mensaje}</p>
                <button onclick="UISimulador.simular()" class="btn-reintentar">Reintentar</button>
            </div>
        `;
    },
    
    // ============================================
    // FUNCIONES AUXILIARES
    // ============================================
    
    generarSugerencias: function(resultado) {
        const sugerencias = [];
        const impactos = resultado.impactos || resultado;
        
        if (impactos.económico < -20) {
            sugerencias.push('💰 Considera medidas de estímulo económico para contrarrestar el impacto negativo');
        }
        if (impactos.social < -15) {
            sugerencias.push('👥 El malestar social requerirá políticas de diálogo y compensación');
        }
        if (impactos.geopolítico < -10) {
            sugerencias.push('🌍 Fortalece alianzas internacionales para mitigar tensiones');
        }
        if (impactos.económico > 20) {
            sugerencias.push('📈 Aprovecha el momento positivo para invertir en infraestructura');
        }
        if (resultado.efectoCadena?.económico?.total < -30) {
            sugerencias.push('🔗 El efecto cadena es amplio. Prepárate para impactos secundarios');
        }
        
        if (sugerencias.length === 0) {
            sugerencias.push('✅ El escenario parece controlado. Monitorea la evolución de indicadores clave');
        }
        
        return sugerencias;
    },
    
    generarSugerenciasRapidas: function() {
        const sugerenciasContainer = document.querySelector('.sugerencias-rapidas');
        if (!sugerenciasContainer) return;
        
        const sugerencias = [
            { texto: 'sube el petróleo un 20%', icono: '🛢️' },
            { texto: 'bajan los impuestos', icono: '💰' },
            { texto: 'huelga general en España', icono: '👥' },
            { texto: 'inversión en energías renovables', icono: '⚡' },
            { texto: 'sequía en Andalucía', icono: '🌞' }
        ];
        
        let html = '<div class="sugerencias-grid">';
        for (let s of sugerencias) {
            html += `
                <button class="sugerencia-btn" data-escenario="${this.escapeHTML(s.texto)}">
                    ${s.icono} ${s.texto}
                </button>
            `;
        }
        html += '</div>';
        
        sugerenciasContainer.innerHTML = html;
        
        // Event listeners
        document.querySelectorAll('.sugerencia-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const escenario = btn.dataset.escenario;
                const input = document.getElementById('escenario-input');
                if (input) {
                    input.value = escenario;
                    this.simular();
                }
            });
        });
    },
    
    configurarSugerenciasRapidas: function() {
        // Buscar o crear contenedor de sugerencias rápidas
        let container = document.querySelector('.sugerencias-rapidas');
        if (!container) {
            const simuladorContainer = document.getElementById('simulador-panel');
            if (simuladorContainer) {
                container = document.createElement('div');
                container.className = 'sugerencias-rapidas';
                container.innerHTML = '<h5>🎲 Escenarios rápidos</h5>';
                simuladorContainer.insertBefore(container, document.getElementById('simulador-resultados'));
            }
        }
        
        if (container) {
            this.generarSugerenciasRapidas();
        }
    },
    
    configurarBotonesResultado: function() {
        // Botón exportar
        const btnExportar = document.querySelector('.btn-exportar-simulacion');
        if (btnExportar) {
            btnExportar.addEventListener('click', () => {
                const escenario = btnExportar.dataset.escenario;
                this.exportarSimulacion(escenario);
            });
        }
        
        // Botón activar modo juego
        const btnActivarModo = document.getElementById('btn-activar-modo-juego-simulador');
        if (btnActivarModo) {
            btnActivarModo.addEventListener('click', () => {
                if (window.GestorModo) {
                    window.GestorModo.cambiarModo('juego');
                } else if (document.getElementById('btn-modo-juego')) {
                    document.getElementById('btn-modo-juego').click();
                }
                setTimeout(() => this.simular(), 100);
            });
        }
    },
    
    exportarSimulacion: function(escenario) {
        const resultado = this.ultimaSimulacion?.resultado;
        if (!resultado) return;
        
        const exportData = {
            fecha: new Date().toISOString(),
            escenario: escenario,
            impactos: resultado.impactos || resultado,
            nivelRiesgo: resultado.nivelRiesgo,
            version: '4.0'
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `simulacion_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.mostrarNotificacion('📥 Simulación exportada correctamente');
    },
    
    guardarEnHistorial: function(escenario, resultado) {
        this.historialSimulaciones.unshift({
            fecha: new Date().toISOString(),
            escenario: escenario,
            impactos: resultado.impactos || resultado,
            nivelRiesgo: resultado.nivelRiesgo
        });
        
        if (this.historialSimulaciones.length > this.config.maxHistorial) {
            this.historialSimulaciones.pop();
        }
        
        try {
            localStorage.setItem('simulador_historial', JSON.stringify(this.historialSimulaciones));
        } catch(e) {
            console.warn('No se pudo guardar historial:', e);
        }
    },
    
    cargarHistorial: function() {
        try {
            const guardado = localStorage.getItem('simulador_historial');
            if (guardado) {
                this.historialSimulaciones = JSON.parse(guardado);
                console.log(`📚 Historial cargado: ${this.historialSimulaciones.length} simulaciones`);
            }
        } catch(e) {
            console.warn('No se pudo cargar historial:', e);
        }
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
        
        // Limpiar resultados si cambia a modo realidad
        if (modo === 'realidad') {
            const resultadosDiv = document.getElementById('simulador-resultados');
            if (resultadosDiv && resultadosDiv.innerHTML.includes('SIMULACIÓN')) {
                resultadosDiv.innerHTML = '<p class="placeholder">🎲 Activa el modo JUEGO y escribe un escenario para simular</p>';
            }
        }
    },
    
    mostrarNotificacion: function(mensaje) {
        const notif = document.createElement('div');
        notif.textContent = mensaje;
        notif.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #2e7d32;
            color: white;
            padding: 8px 20px;
            border-radius: 30px;
            z-index: 1000;
            font-size: 14px;
            animation: fadeOut 3s ease forwards;
        `;
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 3000);
   };

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UISimulador.init());
} else {
    UISimulador.init();
}

window.UISimulador = UISimulador;

Ñ/* Estilos para el Simulador v4.0 */
.simulacion-cargando {
    text-align: center;
    padding: 30px;
    background: var(--bg-panel);
    border-radius: 16px;
}

.simulacion-cargando .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid var(--border);
    border-top-color: var(--info);
    border-radius: 50%;
    margin: 0 auto 15px;
    animation: spin 1s linear infinite;
}

.simulacion-modo-real {
    text-align: center;
    padding: 30px;
    background: var(--bg-panel);
    border-radius: 16px;
}

.modo-real-icono {
    font-size: 48px;
    margin-bottom: 15px;
}

.simulacion-resultado {
    background: var(--bg-panel);
    border-radius: 16px;
    padding: 20px;
    border: 2px solid var(--warning);
}

.resultado-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid var(--border);
}

.simulacion-badge {
    background: #b27c2c;
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
}

.resultado-escenario {
    background: var(--bg-card);
    padding: 12px;
    border-radius: 10px;
    margin-bottom: 20px;
    font-style: italic;
}

.resultado-impactos h5,
.resultado-cadena h5,
.resultado-riesgo h5,
.resultado-sugerencias h5,
.resultado-analisis-ia h5 {
    color: var(--info);
    margin-bottom: 12px;
    font-size: 0.95rem;
}

.impacto-grupo {
    margin-bottom: 15px;
}

.impacto-label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    font-size: 0.9rem;
}

.impacto-barra {
    height: 10px;
    background: var(--bg-card);
    border-radius: 5px;
    overflow: hidden;
}

.impacto-barra-llena {
    height: 100%;
    transition: width 0.5s ease;
}

.resultado-cadena {
    background: var(--bg-card);
    border-radius: 12px;
    padding: 15px;
    margin: 20px 0;
}

.cadena-efectos {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.cadena-eslabon {
    background: var(--bg-panel);
    padding: 10px 15px;
    border-radius: 10px;
    text-align: center;
    font-size: 0.9rem;
}

.cadena-flecha {
    font-size: 1.5rem;
    color: var(--info);
    animation: pulse 1.5s infinite;
}

.resultado-riesgo {
    background: var(--bg-card);
    border-radius: 12px;
    padding: 15px;
    margin: 20px 0;
}

.riesgo-indicador {
    font-weight: bold;
    margin-bottom: 8px;
}

.riesgo-barra {
    height: 8px;
    background: var(--bg-panel);
    border-radius: 4px;
    overflow: hidden;
}

.riesgo-barra-llena {
    height: 100%;
    transition: width 0.5s ease;
}

.resultado-sugerencias {
    background: rgba(79, 195, 247, 0.1);
    border-radius: 12px;
    padding: 15px;
    margin: 20px 0;
    border-left: 4px solid var(--info);
}

.resultado-sugerencias ul {
    margin: 0;
    padding-left: 20px;
}

.resultado-sugerencias li {
    margin: 8px 0;
    color: var(--text-muted);
}

.resultado-analisis-ia {
    background: rgba(156, 39, 176, 0.1);
    border-radius: 12px;
    padding: 15px;
    margin: 20px 0;
    border-left: 4px solid #9c27b0;
}

.analisis-detalle {
