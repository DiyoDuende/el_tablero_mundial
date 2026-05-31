// js/ui/03-simulador.js
// ============================================
// SIMULADOR - Tablero Mundial v4.0
// ============================================

const UISimulador = {
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
            }
            
            // Escuchar cambios de modo
            window.addEventListener('modo-cambiado', (event) => {
                this.actualizarModo(event.detail.modo);
            });
            
            console.log('✅ UISimulador inicializado correctamente');
        } catch(e) {
            console.error('❌ Error en UISimulador.init():', e.message);
        }
    },
    
    simular: function() {
        const input = document.getElementById('escenario-input');
        const resultadosDiv = document.getElementById('simulador-resultados');
        
        if (!input || !resultadosDiv) return;
        
        const escenario = input.value.trim();
        if (!escenario) return;
        
        // Verificar modo
        const modoActual = typeof CONFIG !== 'undefined' ? CONFIG.modo : 'realidad';
        
        if (modoActual === 'realidad') {
            resultadosDiv.innerHTML = `
                <div class="simulacion-modo-real">
                    <div class="modo-real-icono">🌐</div>
                    <h4>Modo REAL activado</h4>
                    <p>Para simular "<strong>${this.escapeHTML(escenario)}</strong>", activa primero el <strong>MODO JUEGO</strong>.</p>
                    <button id="btn-activar-modo-juego-simulador" class="btn-naranja">🎮 Activar modo juego</button>
                </div>
            `;
            const btnActivar = document.getElementById('btn-activar-modo-juego-simulador');
            if (btnActivar) {
                btnActivar.addEventListener('click', () => {
                    if (typeof GestorModo !== 'undefined') {
                        GestorModo.cambiarModo('juego');
                    } else if (document.getElementById('btn-modo-juego')) {
                        document.getElementById('btn-modo-juego').click();
                    }
                    setTimeout(() => this.simular(), 100);
                });
            }
            return;
        }
        
        // Mostrar carga
        resultadosDiv.innerHTML = `<div class="simulacion-cargando"><div class="spinner"></div><p>Simulando "${this.escapeHTML(escenario)}"...</p></div>`;
        
        // Analizar escenario para extraer parámetros
        const analisis = this.analizarEscenario(escenario);
        
        // Ejecutar simulación con el motor
        let impacto = { económico: 0, geopolítico: 0, social: 0 };
        let formula = '';
        
        if (typeof MotorSimulacion !== 'undefined' && MotorSimulacion.calcular) {
            const resultado = MotorSimulacion.calcular({
                poder: analisis.poder,
                sector: analisis.sector,
                mecanismo: analisis.mecanismo,
                factorTerritorio: analisis.factorTerritorio,
                factorEscala: analisis.magnitud * 10
            });
            impacto = {
                económico: resultado.económico,
                geopolítico: resultado.geopolítico,
                social: resultado.social
            };
            formula = resultado.formula || '';
        } else {
            // Fallback si el motor no está listo
            impacto = { económico: -15, geopolítico: -10, social: -5 };
        }
        
        // Generar resultado
        resultadosDiv.innerHTML = this.generarHTMLResultado(escenario, impacto, formula, analisis);
        
        // Configurar botón de reinicio
        const btnReiniciar = document.querySelector('.btn-reiniciar-simulador');
        if (btnReiniciar) {
            btnReiniciar.addEventListener('click', () => {
                input.value = '';
                resultadosDiv.innerHTML = '<p class="placeholder">🎲 Activa el modo JUEGO y escribe un escenario para simular</p>';
            });
        }
    },
    
    analizarEscenario: function(texto) {
        const t = texto.toLowerCase();
        
        // Detectar poder
        let poder = 0.7;
        if (t.includes('político') || t.includes('gobierno')) poder = 0.8;
        else if (t.includes('económico') || t.includes('economía')) poder = 0.9;
        else if (t.includes('militar') || t.includes('ejército')) poder = 0.85;
        else if (t.includes('social') || t.includes('ciudadano')) poder = 0.6;
        
        // Detectar sector
        let sector = 0.6;
        if (t.includes('petróleo') || t.includes('gas') || t.includes('energía')) sector = 0.8;
        else if (t.includes('tecnología')) sector = 0.75;
        else if (t.includes('industria')) sector = 0.7;
        else if (t.includes('educación')) sector = 0.5;
        
        // Detectar mecanismo
        let mecanismo = 0.5;
        if (t.includes('inversión') || t.includes('invertir')) mecanismo = 0.7;
        else if (t.includes('impuesto') || t.includes('subida')) mecanismo = 0.65;
        else if (t.includes('sanción')) mecanismo = 0.8;
        
        // Detectar magnitud
        let magnitud = 10;
        const magnitudMatch = t.match(/(\d+)(?:\s*%|\s*porciento)/);
        if (magnitudMatch) magnitud = parseInt(magnitudMatch[1]);
        
        return { poder, sector, mecanismo, magnitud, factorTerritorio: 1.0 };
    },
    
    generarHTMLResultado: function(escenario, impacto, formula, analisis) {
        const colorEconomico = impacto.económico >= 0 ? '#2e7d32' : '#d32f2f';
        const colorSocial = impacto.social >= 0 ? '#2e7d32' : '#f57c00';
        const colorGeopolitico = impacto.geopolítico >= 0 ? '#2e7d32' : '#f57c00';
        
        const barraEconomico = Math.min(100, Math.abs(impacto.económico));
        const barraSocial = Math.min(100, Math.abs(impacto.social));
        const barraGeopolitico = Math.min(100, Math.abs(impacto.geopolítico));
        
        return `
            <div class="simulacion-resultado">
                <div class="resultado-header">
                    <h4>🎮 SIMULACIÓN</h4>
                    <span class="simulacion-badge">MODO JUEGO</span>
                </div>
                <div class="resultado-escenario"><strong>📌 Escenario:</strong> "${this.escapeHTML(escenario)}"</div>
                
                <div class="resultado-impactos">
                    <h5>📊 IMPACTOS ESTIMADOS</h5>
                    <div class="impacto-grupo">
                        <div class="impacto-label"><span>💰 Económico</span><span style="color: ${colorEconomic}">${impacto.económico > 0 ? '+' : ''}${impacto.económico}%</span></div>
                        <div class="impacto-barra"><div class="impacto-barra-llena" style="width: ${barraEconomico}%; background: ${colorEconomico};"></div></div>
                    </div>
                    <div class="impacto-grupo">
                        <div class="impacto-label"><span>👥 Social</span><span style="color: ${colorSocial}">${impacto.social > 0 ? '+' : ''}${impacto.social}%</span></div>
                        <div class="impacto-barra"><div class="impacto-barra-llena" style="width: ${barraSocial}%; background: ${colorSocial};"></div></div>
                    </div>
                    <div class="impacto-grupo">
                        <div class="impacto-label"><span>🌍 Geopolítico</span><span style="color: ${colorGeopolitico}">${impacto.geopolítico > 0 ? '+' : ''}${impacto.geopolítico}%</span></div>
                        <div class="impacto-barra"><div class="impacto-barra-llena" style="width: ${barraGeopolitico}%; background: ${colorGeopolitico};"></div></div>
                    </div>
                </div>
                
                <div class="resultado-analisis">
                    <h5>🧠 ANÁLISIS</h5>
                    <p>${this.generarAnalisis(impacto)}</p>
                    <div class="analisis-detalle">
                        <span>🎯 Poder: ${analisis.poder > 0.7 ? 'alto' : 'moderado'}</span>
                        <span>📂 Sector: ${analisis.sector > 0.7 ? 'estratégico' : 'normal'}</span>
                        <span>⚙️ Mecanismo: ${analisis.mecanismo > 0.6 ? 'efectivo' : 'moderado'}</span>
                    </div>
                </div>
                
                <div class="resultado-acciones">
                    <button class="btn-reiniciar-simulador">🔄 Nueva simulación</button>
                </div>
                
                <div class="resultado-footer">
                    <p class="advertencia">⚠️ ESTO ES UNA SIMULACIÓN - Basada en modelos y datos históricos</p>
                    <p class="timestamp">🕐 Simulación: ${new Date().toLocaleString()}</p>
                </div>
            </div>
        `;
    },
    
    generarAnalisis: function(impacto) {
        if (impacto.económico < -20) return 'El impacto económico es severo. Se recomiendan medidas de estímulo fiscal.';
        if (impacto.económico < -10) return 'El impacto económico es significativo. Podría haber contracción del PIB.';
        if (impacto.social < -15) return 'El malestar social aumentará considerablemente. Se recomienda diálogo.';
        if (impacto.económico > 10) return 'El impacto económico es positivo. Podría impulsar el crecimiento.';
        return 'El escenario tiene efectos moderados. Monitorizar evolución de indicadores clave.';
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
            if (resultadosDiv) {
                resultadosDiv.innerHTML = '<p class="placeholder">🎲 Activa el modo JUEGO y escribe un escenario para simular</p>';
            }
        }
    },
    
    escapeHTML: function(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
};

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UISimulador.init());
} else {
    UISimulador.init();
}

window.UISimulador = UISimulador;
