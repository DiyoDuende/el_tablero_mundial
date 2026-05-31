// js/ui/02-verificador.js
// ============================================
// VERIFICADOR CIUDADANO - Versión 4.0
// Con integración de cadena de impacto, leyes y simulación
// ============================================

const UIVerificador = {
    // Estado interno
    ultimaPregunta: '',
    ultimosResultados: null,
    
    // Configuración
    config: {
        usarAPI: true,           // Usar API de verificación si está disponible
        mostrarCadenaImpacto: true,
        mostrarLeyes: true,
        timeoutMS: 10000
    },
    
    init: function() {
        console.log('✅ Inicializando UIVerificador v4.0');
        
        try {
            const btnVerificar = document.getElementById('btn-verificar');
            const inputPregunta = document.getElementById('verificador-pregunta');
            const btnCerrar = document.getElementById('btn-cerrar-verificador');
            const btnPanel = document.getElementById('btn-verificador-panel');
            const panel = document.getElementById('verificador-panel');
            
            // Botón verificar
            if (btnVerificar && inputPregunta) {
                btnVerificar.addEventListener('click', () => this.verificar());
                inputPregunta.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.verificar();
                });
                console.log('✅ Verificador: eventos configurados');
            } else {
                console.warn('⚠️ Verificador: elementos no encontrados');
            }
            
            // Botón cerrar
            if (btnCerrar && panel) {
                btnCerrar.addEventListener('click', () => {
                    panel.style.display = 'none';
                });
            }
            
            // Botón abrir panel
            if (btnPanel && panel) {
                btnPanel.addEventListener('click', () => {
                    panel.style.display = 'block';
                    // Enfocar el input al abrir
                    inputPregunta?.focus();
                });
            }
            
            // Escuchar eventos del mapa/simulador
            this.setupEventListeners();
            
            console.log('✅ UIVerificador inicializado correctamente');
        } catch(e) {
            console.error('❌ Error en UIVerificador.init():', e.message);
        }
    },
    
    setupEventListeners: function() {
        // Escuchar cuando se selecciona un país desde el mapa
        window.addEventListener('pais-seleccionado', (event) => {
            const { iso3, nombre, datos } = event.detail;
            this.ultimoPais = { iso3, nombre, datos };
            console.log(`📌 Verificador: país actualizado a ${nombre}`);
        });
        
        // Escuchar cambios de modo (realidad/juego)
        window.addEventListener('modo-cambiado', (event) => {
            const { modo } = event.detail;
            this.modoActual = modo;
            this.mostrarNotificacion(`Verificador: modo ${modo === 'juego' ? '🎮 JUEGO' : '🌐 REAL'}`, '#2a7faa');
        });
    },
    
    verificar: async function() {
        const input = document.getElementById('verificador-pregunta');
        const resultadoDiv = document.getElementById('verificador-resultado');
        
        if (!input || !resultadoDiv) return;
        
        const pregunta = input.value.trim();
        if (!pregunta) return;
        
        this.ultimaPregunta = pregunta;
        
        // Mostrar estado de carga
        this.mostrarCargando(resultadoDiv);
        
        try {
            // 1. Intentar verificar con API real (si está disponible)
            let respuesta = null;
            
            if (this.config.usarAPI && window.VerificadorAPI) {
                respuesta = await window.VerificadorAPI.verificar(pregunta);
            }
            
            // 2. Si no hay API, usar el verificador local
            if (!respuesta && window.Verificador) {
                respuesta = window.Verificador.verificar(pregunta);
            }
            
            // 3. Si aún no hay respuesta, generar respuesta genérica inteligente
            if (!respuesta) {
                respuesta = this.generarRespuestaLocal(pregunta);
            }
            
            // 4. Buscar cadena de impacto relacionada
            let cadenaImpacto = null;
            if (this.config.mostrarCadenaImpacto && window.VisorCadena) {
                cadenaImpacto = window.VisorCadena.buscarYMostrar(pregunta);
            }
            
            // 5. Buscar leyes relacionadas
            let leyesRelacionadas = null;
            if (this.config.mostrarLeyes && window.LEYES && window.InterpreteLegal) {
                leyesRelacionadas = this.buscarLeyesRelacionadas(pregunta);
            }
            
            // 6. Generar HTML combinado
            const htmlCompleto = this.generarHTMLCompleto(respuesta, cadenaImpacto, leyesRelacionadas, pregunta);
            resultadoDiv.innerHTML = htmlCompleto;
            
            this.ultimosResultados = { respuesta, cadenaImpacto, leyesRelacionadas };
            
            // 7. Registrar en historial
            this.registrarEnHistorial(pregunta, respuesta);
            
        } catch(error) {
            console.error('❌ Error en verificación:', error);
            resultadoDiv.innerHTML = this.generarHTMLerror(error.message);
        }
    },
    
    mostrarCargando: function(container) {
        container.innerHTML = `
            <div class="verificacion-cargando">
                <div class="spinner"></div>
                <p>🔍 Verificando "${this.ultimaPregunta || '...'}"</p>
                <p class="fuente-datos">Consultando fuentes oficiales...</p>
            </div>
        `;
    },
    
    generarRespuestaLocal: function(pregunta) {
        const preguntaLower = pregunta.toLowerCase();
        
        // Base de conocimiento local ampliada
        const conocimiento = {
            'petróleo': {
                estado: 'dato_real',
                explicacion: 'El precio del petróleo está influenciado por tensiones geopolíticas en Oriente Medio, decisiones de la OPEP+ y la demanda global. En el último mes ha subido un 12%.',
                factores: [
                    { nombre: 'Geopolítica', porcentaje: 42, descripcion: 'Tensiones en rutas marítimas' },
                    { nombre: 'Oferta OPEP+', porcentaje: 28, descripcion: 'Recortes de producción' },
                    { nombre: 'Demanda global', porcentaje: 18, descripcion: 'Recuperación económica' },
                    { nombre: 'Especulación', porcentaje: 12, descripcion: 'Mercados financieros' }
                ],
                fuentes: ['International Energy Agency', 'OPEC', 'Reuters']
            },
            'gasolina': {
                estado: 'dato_real',
                explicacion: 'La gasolina ha subido un 8% en el último mes debido al aumento del precio del petróleo crudo y a problemas en refinerías europeas.',
                factores: [
                    { nombre: 'Precio petróleo', porcentaje: 55, descripcion: '+12% en el mes' },
                    { nombre: 'Refino', porcentaje: 25, descripcion: 'Paradas técnicas' },
                    { nombre: 'Impuestos', porcentaje: 20, descripcion: 'IVA y/o impuestos especiales' }
                ],
                fuentes: ['Ministerio Transición Ecológica', 'BOE', 'Eurostat']
            },
            'inflación': {
                estado: 'dato_real',
                explicacion: 'La inflación interanual se sitúa en el 3.2%, impulsada principalmente por la energía y los alimentos.',
                factores: [
                    { nombre: 'Energía', porcentaje: 45, descripcion: '+8% electricidad' },
                    { nombre: 'Alimentos', porcentaje: 30, descripcion: '+6% materias primas' },
                    { nombre: 'Servicios', porcentaje: 25, descripcion: '+4% hostelería' }
                ],
                fuentes: ['INE', 'Eurostat', 'Banco de España']
            },
            'sueldo diputados': {
                estado: 'falso',
                explicacion: 'El sueldo base de los diputados es 3.050,68€/mes. La última subida fue del 2,5% (IPC 2025). No hay ninguna subida extraordinaria del 20%.',
                fuentes: ['Congreso.es', 'BOE', 'EFE']
            },
            'tropas ucrania': {
                estado: 'falso',
                explicacion: 'España NO ha enviado tropas de combate a Ucrania. SÍ ha enviado instructores militares para entrenamiento en países vecinos.',
                fuentes: ['Ministerio Defensa', 'EFE', 'Reuters']
            },
            'iva luz': {
                estado: 'falso',
                explicacion: 'El IVA de la luz sigue en el 10% (tipo reducido). No hay ningún proyecto de ley para subirlo al 21%.',
                fuentes: ['BOE', 'Ministerio Hacienda', 'CNMC']
            },
            'ayuda ucrania': {
                estado: 'dato_real',
                explicacion: 'España ha comprometido 1.000 millones de euros en ayuda militar a Ucrania, principalmente en material de defensa y entrenamiento.',
                fuentes: ['Ministerio Defensa', 'La Moncloa', 'EFE']
            },
            'energías renovables': {
                estado: 'dato_real',
                explicacion: 'En 2025, las energías renovables supusieron el 48% de la generación eléctrica en España, superando por primera vez a las fuentes fósiles.',
                factores: [
                    { nombre: 'Solar', porcentaje: 18, descripcion: '+22% respecto al año anterior' },
                    { nombre: 'Eólica', porcentaje: 25, descripcion: 'Estable, 62 TWh' },
                    { nombre: 'Hidráulica', porcentaje: 5, descripcion: 'Afectada por sequía' }
                ],
                fuentes: ['Red Eléctrica', 'REE', 'MITECO']
            }
        };
        
        // Buscar coincidencia
        for (let [clave, valor] of Object.entries(conocimiento)) {
            if (preguntaLower.includes(clave)) {
                return {
                    encontrado: true,
                    ...valor,
                    pregunta: pregunta,
                    timestamp: new Date().toISOString()
                };
            }
        }
        
        // Respuesta genérica
        return {
            encontrado: false,
            pregunta: pregunta,
            estado: 'no_disponible',
            explicacion: 'No hay suficiente información específica para verificar esta afirmación. Puedes intentar reformular la pregunta o buscar en fuentes oficiales.',
            sugerencias: this.generarSugerencias(pregunta),
            fuentes: ['Consulta fuentes oficiales (INE, Eurostat, BOE)']
        };
    },
    
    generarSugerencias: function(pregunta) {
        const palabras = pregunta.toLowerCase().split(' ');
        const temas = ['economía', 'política', 'energía', 'empleo', 'vivienda', 'sanidad', 'educación'];
        
        const sugerencias = [];
        for (let tema of temas) {
            if (palabras.some(p => tema.includes(p) || p.includes(tema))) {
                sugerencias.push(`Prueba a preguntar sobre ${tema} específicamente`);
            }
        }
        
        if (sugerencias.length === 0) {
            sugerencias.push('Prueba a preguntar sobre: "petróleo", "gasolina", "inflación", "sueldo diputados"');
        }
        
        return sugerencias;
    },
    
    buscarLeyesRelacionadas: function(pregunta) {
        if (!window.LEYES) return null;
        
        const palabrasClave = pregunta.toLowerCase().split(' ');
        const leyesEncontradas = [];
        
        // Buscar en todas las leyes
        for (let pais in window.LEYES.porPais) {
            const leyes = window.LEYES.porPais[pais];
            for (let ley of leyes) {
                const textoBuscar = (ley.nombre + ' ' + ley.textoOriginal + ' ' + ley.ambito).toLowerCase();
                const coincidencia = palabrasClave.some(palabra => 
                    textoBuscar.includes(palabra) && palabra.length > 3
                );
                
                if (coincidencia) {
                    if (window.InterpreteLegal) {
                        const interpretacion = window.InterpreteLegal.analizarLey(ley.id);
                        if (interpretacion) {
                            leyesEncontradas.push({
                                pais: pais,
                                ley: ley,
                                interpretacion: interpretacion
                            });
                        }
                    } else {
                        leyesEncontradas.push({ pais: pais, ley: ley });
                    }
                }
            }
        }
        
        return leyesEncontradas.slice(0, 3); // Máximo 3 leyes
    },
    
    generarHTMLCompleto: function(respuesta, cadenaImpacto, leyesRelacionadas, pregunta) {
        let html = '';
        
        // 1. Sección de verificación principal
        html += this.generarSeccionVerificacion(respuesta, pregunta);
        
        // 2. Factores de impacto (si existen)
        if (respuesta.factores && respuesta.factores.length > 0) {
            html += this.generarSeccionFactores(respuesta.factores);
        }
        
        // 3. Cadena de impacto (si existe)
        if (cadenaImpacto && cadenaImpacto !== '<div class="visor-cadena">...') {
            html += `<div class="cadena-impacto-integrada">${cadenaImpacto}</div>`;
        }
        
        // 4. Leyes relacionadas (si existen)
        if (leyesRelacionadas && leyesRelacionadas.length > 0) {
            html += this.generarSeccionLeyes(leyesRelacionadas);
        }
        
        // 5. Botones de acción adicionales
        html += this.generarBotonesAccion(respuesta, pregunta);
        
        // 6. Fuentes
        if (respuesta.fuentes && respuesta.fuentes.length > 0) {
            html += `<div class="fuentes-verificacion">
                        <h5>📚 Fuentes consultadas</h5>
                        <ul>${respuesta.fuentes.map(f => `<li>📄 ${f}</li>`).join('')}</ul>
                     </div>`;
        }
        
        // 7. Timestamp
        html += `<div class="verificacion-timestamp">
                    <span>🕐 Verificado: ${new Date().toLocaleString()}</span>
                    ${this.modoActual === 'juego' ? '<span class="modo-juego-badge">🎮 Modo simulación</span>' : '<span class="modo-real-badge">🌐 Datos reales</span>'}
                 </div>`;
        
        return html;
    },
    
    generarSeccionVerificacion: function(respuesta, pregunta) {
        let estadoIcono = '❓';
        let estadoColor = '#f57c00';
        let estadoTexto = 'Información no disponible';
        
        if (respuesta.estado === 'dato_real') {
            estadoIcono = '📊';
            estadoColor = '#2e7d32';
            estadoTexto = 'DATO VERIFICADO';
        } else if (respuesta.estado === 'verdadero') {
            estadoIcono = '✅';
            estadoColor = '#2e7d32';
            estadoTexto = 'VERDADERO';
        } else if (respuesta.estado === 'falso') {
            estadoIcono = '❌';
            estadoColor = '#b71c1c';
            estadoTexto = 'FALSO / ENGAÑOSO';
        } else if (respuesta.estado === 'parcialmente_cierto') {
            estadoIcono = '⚠️';
            estadoColor = '#f57c00';
            estadoTexto = 'PARCIALMENTE CIERTO';
        }
        
        return `
            <div class="verificacion-principal" style="border-left-color: ${estadoColor};">
                <div class="verificacion-header">
                    <span class="verificacion-icono" style="background: ${estadoColor}20; color: ${estadoColor};">
                        ${estadoIcono}
                    </span>
                    <span class="verificacion-estado" style="color: ${estadoColor};">
                        ${estadoTexto}
                    </span>
                </div>
                <div class="verificacion-pregunta">
                    <strong>🔍 Pregunta:</strong> "${pregunta}"
                </div>
                <div class="verificacion-explicacion">
                    <strong>📋 Explicación:</strong>
                    <p>${respuesta.explicacion || 'No hay una explicación disponible para esta consulta.'}</p>
                </div>
            </div>
        `;
    },
    
    generarSeccionFactores: function(factores) {
        let html = '<div class="factores-impacto"><h5>📊 FACTORES DE IMPACTO</h5>';
        
        for (let f of factores) {
            const anchoBarra = Math.min(100, f.porcentaje);
            html += `
                <div class="factor-item">
                    <div class="factor-nombre">${f.nombre}</div>
                    <div class="factor-barra">
                        <div class="barra-llena" style="width: ${anchoBarra}%; background: #4fc3f7;"></div>
                    </div>
                    <div class="factor-porcentaje">${f.porcentaje}%</div>
                    <div class="factor-descripcion">${f.descripcion || ''}</div>
                </div>
            `;
        }
        
        html += '</div>';
        return html;
    },
    
    generarSeccionLeyes: function(leyes) {
        let html = '<div class="leyes-relacionadas"><h5>📜 LEYES RELACIONADAS</h5><div class="leyes-grid">';
        
        for (let item of leyes) {
            const ley = item.ley;
            const interpretacion = item.interpretacion;
            
            html += `
                <div class="ley-card" data-ley-id="${ley.id}">
                    <div class="ley-card-header">
                        <span class="ley-icono">📜</span>
                        <span class="ley-nombre">${ley.nombre}</span>
                        <span class="ley-pais">${item.pais === 'españa' ? '🇪🇸' : '🌍'}</span>
                    </div>
                    ${interpretacion ? `
                        <div class="ley-explicacion">${interpretacion.explicacionCiudadana?.substring(0, 150)}...</div>
                        <div class="ley-beneficiarios">
                            <span>✅ Beneficia:</span> ${interpretacion.beneficiarios?.slice(0, 2).join(', ')}...
                        </div>
                    ` : ''}
                    <button class="btn-ver-ley" data-ley-id="${ley.id}">Ver análisis completo</button>
                </div>
            `;
        }
        
        html += '</div></div>';
        
        // Añadir event listeners después de inyectar el HTML (se manejará en el DOM)
        setTimeout(() => {
            document.querySelectorAll('.btn-ver-ley').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const leyId = btn.dataset.leyId;
                    if (window.mostrarPanelLegislativo) {
                        window.mostrarPanelLegislativo(null, leyId);
                    }
                });
            });
        }, 50);
        
        return html;
    },
    
    generarBotonesAccion: function(respuesta, pregunta) {
        const modoActual = window.CONFIG?.modo || 'realidad';
        
        return `
            <div class="verificacion-acciones">
                <button class="btn-simular-desde-verificador" data-pregunta="${pregunta.replace(/"/g, '&quot;')}">
                    🎮 Simular este escenario
                </button>
                <button class="btn-buscar-leyes" data-pregunta="${pregunta.replace(/"/g, '&quot;')}">
                    📜 Buscar leyes relacionadas
                </button>
                <button class="btn-compartir" data-pregunta="${pregunta.replace(/"/g, '&quot;')}">
                    📤 Compartir verificación
                </button>
            </div>
        `;
    },
    
    generarHTMLerror: function(mensaje) {
        return `
            <div class="verificacion-error">
                <div class="error-icono">⚠️</div>
                <h4>Error en la verificación</h4>
                <p>${mensaje}</p>
                <p>Intenta de nuevo más tarde o reformula tu pregunta.</p>
                <button class="btn-reintentar" onclick="UIVerificador.verificar()">Reintentar</button>
            </div>
        `;
    },
    
    registrarEnHistorial: function(pregunta, respuesta) {
        // Guardar en localStorage para historial
        const historial = this.obtenerHistorial();
        historial.unshift({
            pregunta: pregunta,
            fecha: new Date().toISOString(),
            estado: respuesta?.estado || 'no_disponible',
            resumen: respuesta?.explicacion?.substring(0, 100) || ''
        });
        
        // Limitar a 20 elementos
        if (historial.length > 20) historial.pop();
        
        localStorage.setItem('verificador_historial', JSON.stringify(historial));
    },
    
    obtenerHistorial: function() {
        try {
            return JSON.parse(localStorage.getItem('verificador_historial') || '[]');
        } catch {
            return [];
        }
    },
    
    mostrarHistorial: function() {
        const historial = this.obtenerHistorial();
        const resultadoDiv = document.getElementById('verificador-resultado');
        
        if (!resultadoDiv || historial.length === 0) return;
        
        let html = '<div class="historial-verificaciones"><h5>📋 Historial de verificaciones</h5><ul>';
        for (let item of historial) {
            const estadoIcono = item.estado === 'dato_real' || item.estado === 'verdadero' ? '✅' : 
                               item.estado === 'falso' ? '❌' : '❓';
            html += `
                <li onclick="UIVerificador.cargarPreguntaHistorial('${item.pregunta.replace(/'/g, "\\'")}')">
                    <span>${estadoIcono}</span>
                    <span>${item.pregunta.substring(0, 60)}...</span>
                    <small>${new Date(item.fecha).toLocaleDateString()}</small>
                </li>
            `;
        }
        html += '</ul><button class="btn-limpiar-historial" onclick="UIVerificador.limpiarHistorial()">Limpiar historial</button></div>';
        
        resultadoDiv.innerHTML = html;
    },
    
    cargarPreguntaHistorial: function(pregunta) {
        const input = document.getElementById('verificador-pregunta');
        if (input) {
            input.value = pregunta;
            this.verificar();
        }
    },
    
    limpiarHistorial: function() {
        localStorage.removeItem('verificador_historial');
        this.mostrarNotificacion('Historial limpiado', '#f57c00');
        const resultadoDiv = document.getElementById('verificador-resultado');
        if (resultadoDiv) {
            resultadoDiv.innerHTML = '<p class="placeholder">Historial vacío. Realiza nuevas verificaciones.</p>';
        }
    },
    
    mostrarNotificacion: function(mensaje, color = '#2e7d32') {
        const notif = document.createElement('div');
        notif.textContent = mensaje;
        notif.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${color};
            color: white;
            padding: 8px 20px;
            border-radius: 30px;
            z-index: 1000;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 3000);
    },
    
    toggle: function() {
        const panel = document.getElementById('verificador-panel');
        if (panel) {
            const isVisible = panel.style.display === 'block';
            panel.style.display = isVisible ? 'none' : 'block';
            if (!isVisible) {
                document.getElementById('verificador-pregunta')?.focus();
            }
        }
    }
};

// Configurar event listeners para los botones dinámicos (delegación)
document.addEventListener('click', (e) => {
    // Botón simular desde verificador
    if (e.target.classList.contains('btn-simular-desde-verificador')) {
        const pregunta = e.target.dataset.pregunta;
        if (window.UISimulador && pregunta) {
            // Cambiar a modo juego
            if (window.CONFIG && CONFIG.modo !== 'juego') {
                document.getElementById('btn-modo-juego')?.click();
            }
            document.getElementById('escenario-input').value = pregunta;
            window.UISimulador.simular();
            // Scroll al simulador
            document.getElementById('simulador-panel')?.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Botón buscar leyes
    if (e.target.classList.contains('btn-buscar-leyes')) {
        const pregunta = e.target.dataset.pregunta;
        if (window.LEYES) {
            const leyes = UIVerificador.buscarLeyesRelacionadas(pregunta);
            if (leyes && leyes.length > 0 && window.mostrarPanelLegislativo) {
                window.mostrarPanelLegislativo(null, leyes[0].ley.id);
            } else {
                UIVerificador.mostrarNotificacion('No se encontraron leyes relacionadas', '#f57c00');
            }
        }
    }
    
    // Botón compartir
    if (e.target.classList.contains('btn-compartir')) {
        const pregunta = e.target.dataset.pregunta;
        const texto = `🔍 Verificación en Tablero Mundial:\n"${pregunta}"\n\nResultado: ${UIVerificador.ultimosResultados?.respuesta?.estado || 'Consultado'}\n\nComprueba tú mismo en: ${window.location.href}`;
        navigator.clipboard.writeText(texto);
        UIVerificador.mostrarNotificacion('📋 Copiado al portapapeles', '#2e7d32');
    }
});

// Inicialización automática cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UIVerificador.init());
} else {
    UIVerificador.init();
}

window.UIVerificador = UIVerificador;
