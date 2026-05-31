// js/ui/10-inicio.js
// ============================================
// INICIALIZACIÓN UNIFICADA - Conecta todos los botones
// ============================================

(function() {
    console.log('🚀 Iniciando Tablero Mundial v4.1 - Conectando botones...');
    
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        iniciar();
    }
    
    function iniciar() {
        console.log('📄 DOM listo, conectando interfaces...');
        
        // ========================================
        // 1. BOTONES DE LA BARRA SUPERIOR
        // ========================================
        
        // Botón README
        const btnReadme = document.getElementById('btn-readme');
        if (btnReadme) {
            btnReadme.onclick = (e) => {
                e.preventDefault();
                mostrarModal('README', `
                    <h1>🌍 TABLERO MUNDIAL</h1>
                    <p>Plataforma interactiva de análisis geopolítico, económico y estratégico.</p>
                    <h2>📊 Características</h2>
                    <ul>
                        <li>Mapa mundial interactivo</li>
                        <li>Datos económicos reales del Banco Mundial</li>
                        <li>Verificador ciudadano</li>
                        <li>Simulador de escenarios</li>
                        <li>Cadenas de impacto</li>
                    </ul>
                    <h2>📚 Fuentes</h2>
                    <p>Banco Mundial · FMI · Eurostat · ONU</p>
                    <p><small>Versión 4.1 - Mayo 2026</small></p>
                `);
            };
        }
        
        // Botón NORMAS
        const btnNormas = document.getElementById('btn-normas');
        if (btnNormas) {
            btnNormas.onclick = (e) => {
                e.preventDefault();
                mostrarModal('📋 NORMAS DEL TABLERO', `
                    <h2>📜 Principios fundamentales</h2>
                    <ul>
                        <li><strong>Separación realidad/simulación</strong>: Modo REAL solo muestra datos verificados.</li>
                        <li><strong>Transparencia</strong>: Todas las fuentes son públicas y verificables.</li>
                        <li><strong>Neutralidad</strong>: No hay interpretaciones políticas, solo datos.</li>
                    </ul>
                    <h2>🎮 Modos de uso</h2>
                    <ul>
                        <li><strong>MODO REAL</strong>: Observación y análisis de datos reales.</li>
                        <li><strong>MODO JUEGO</strong>: Simulación de escenarios hipotéticos.</li>
                    </ul>
                    <h2>📚 Fuentes de datos</h2>
                    <p>INE · Eurostat · Banco Mundial · IEA · Datos abiertos</p>
                `);
            };
        }
        
        // Botón Verificador
        const btnVerificador = document.getElementById('btn-verificador-panel');
        const verificadorPanel = document.getElementById('verificador-panel');
        if (btnVerificador && verificadorPanel) {
            btnVerificador.onclick = () => {
                verificadorPanel.classList.toggle('active');
            };
        }
        
        // Botón cerrar verificador
        const btnCerrarVerificador = document.getElementById('btn-cerrar-verificador');
        if (btnCerrarVerificador && verificadorPanel) {
            btnCerrarVerificador.onclick = () => {
                verificadorPanel.classList.remove('active');
            };
        }
        
        // Botón Relaciones Globales
        const btnRelaciones = document.getElementById('btn-relaciones-globales');
        if (btnRelaciones) {
            btnRelaciones.onclick = () => {
                mostrarModal('🌐 RELACIONES GLOBALES', `
                    <h2>Próximamente</h2>
                    <p>Visualización de relaciones entre gobiernos, empresas, medios y ciudadanía.</p>
                    <p>Redes de poder · Flujos de influencia · Puertas giratorias</p>
                    <p><small>Disponible en versión 5.0</small></p>
                `);
            };
        }
        
        // Botón Timeline Global
        const btnTimeline = document.getElementById('btn-timeline-panel');
        if (btnTimeline) {
            btnTimeline.onclick = () => {
                mostrarModal('📅 TIMELINE GLOBAL', `
                    <h2>Evolución histórica</h2>
                    <p>Seguimiento de eventos globales y cadenas de impacto.</p>
                    <p>Próximamente: visualización interactiva de crisis energéticas, conflictos y cambios geopolíticos.</p>
                    <p><small>Disponible en versión 5.0</small></p>
                `);
            };
        }
        
        // ========================================
        // 2. BOTONES DE CAPAS (coloreado)
        // ========================================
        
        // Buscar botones por texto o por data-capa
        const botonesCapas = document.querySelectorAll('.capa-icon, [data-capa]');
        botonesCapas.forEach(btn => {
            const titulo = btn.getAttribute('title') || btn.textContent || '';
            
            if (titulo.includes('PIB') || titulo.includes('💰')) {
                btn.onclick = () => {
                    if (window.Coloreado) window.Coloreado.aplicarColoresPIB();
                    console.log('💰 Capa PIB activada');
                };
            } else if (titulo.includes('Inflación') || titulo.includes('📈')) {
                btn.onclick = () => {
                    if (window.Coloreado) window.Coloreado.aplicarColoresInflacion();
                    console.log('📈 Capa Inflación activada');
                };
            } else if (titulo.includes('Desempleo') || titulo.includes('👥')) {
                btn.onclick = () => {
                    if (window.Coloreado) window.Coloreado.aplicarColoresDesempleo();
                    console.log('👥 Capa Desempleo activada');
                };
            } else if (titulo.includes('Normal') || titulo.includes('Restablecer') || titulo.includes('🔄')) {
                btn.onclick = () => {
                    if (window.Coloreado) window.Coloreado.resetearColores();
                    console.log('🔄 Colores restablecidos');
                };
            }
        });
        
        // ========================================
        // 3. MODO REAL / MODO JUEGO
        // ========================================
        
        const btnModoReal = document.getElementById('btn-modo-real');
        const btnModoJuego = document.getElementById('btn-modo-juego');
        const modoBadge = document.getElementById('modo-badge');
        
        if (btnModoReal) {
            btnModoReal.onclick = () => {
                if (window.CONFIG) window.CONFIG.modo = 'realidad';
                btnModoReal.classList.add('active');
                btnModoJuego?.classList.remove('active');
                if (modoBadge) {
                    modoBadge.innerHTML = '🌐 MODO REAL';
                    modoBadge.style.background = '#2e7d32';
                }
                console.log('🌐 Modo REAL activado');
            };
        }
        
        if (btnModoJuego) {
            btnModoJuego.onclick = () => {
                if (window.CONFIG) window.CONFIG.modo = 'juego';
                btnModoJuego.classList.add('active');
                btnModoReal?.classList.remove('active');
                if (modoBadge) {
                    modoBadge.innerHTML = '🎮 MODO JUEGO';
                    modoBadge.style.background = '#b27c2c';
                }
                console.log('🎮 Modo JUEGO activado');
            };
        }
        
        // ========================================
        // 4. BOTÓN DE BÚSQUEDA (si existe)
        // ========================================
        
        const btnBuscar = document.getElementById('btn-buscar');
        if (btnBuscar && window.BuscadorGlobal) {
            btnBuscar.onclick = () => {
                if (window.BuscadorGlobal.buscar) window.BuscadorGlobal.buscar();
            };
        }
        
        // ========================================
        // 5. BOTÓN DE SIMULACIÓN
        // ========================================
        
        const btnSimular = document.getElementById('btn-simular');
        if (btnSimular && window.UISimulador) {
            btnSimular.onclick = () => {
                if (window.UISimulador.simular) window.UISimulador.simular();
            };
        }
        
        // ========================================
        // 6. BOTÓN DE VERIFICAR
        // ========================================
        
        const btnVerificar = document.getElementById('btn-verificar');
        if (btnVerificar && window.UIVerificador) {
            btnVerificar.onclick = () => {
                if (window.UIVerificador.verificar) window.UIVerificador.verificar();
            };
        }
        
        console.log('✅ Todos los botones conectados');
    }
    
    // Función auxiliar para mostrar modales
    function mostrarModal(titulo, contenido) {
        // Verificar si ya existe un modal
        let modal = document.getElementById('modal-global');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modal-global';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.85);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 20000;
            `;
            document.body.appendChild(modal);
        }
        
        modal.innerHTML = `
            <div style="
                background: #1a2a30;
                width: 90%;
                max-width: 700px;
                max-height: 80vh;
                border-radius: 20px;
                padding: 20px;
                position: relative;
                overflow-y: auto;
                border: 1px solid #4fc3f7;
            ">
                <button id="modal-cerrar" style="
                    position: absolute;
                    top: 10px;
                    right: 15px;
                    font-size: 24px;
                    background: none;
                    border: none;
                    color: #9aaec2;
                    cursor: pointer;
                ">✕</button>
                <div style="color: #ecf0f3; line-height: 1.6;">
                    ${contenido}
                </div>
            </div>
        `;
        
        modal.style.display = 'flex';
        
        const btnCerrar = document.getElementById('modal-cerrar');
        if (btnCerrar) {
            btnCerrar.onclick = () => {
                modal.style.display = 'none';
            };
        }
        
        modal.onclick = (e) => {
            if (e.target === modal) modal.style.display = 'none';
        };
    }
})();
