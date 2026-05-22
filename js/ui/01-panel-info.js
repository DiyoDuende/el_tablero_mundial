// js/ui/01-panel-info.js
const UIPanelInfo = {
    paisActual: 'españa',
    
    init: function() {
        this.vincularBotones();
    },
    
    vincularBotones: function() {
        document.querySelectorAll('.info-btn').forEach(btn => {
            btn.removeEventListener('click', this.handleBotonClick);
            btn.addEventListener('click', this.handleBotonClick.bind(this));
        });
    },
    
    handleBotonClick: function(e) {
        const seccion = e.currentTarget.dataset.seccion;
        if (seccion) this.mostrarSeccion(seccion);
    },
    
    mostrarPais: function(paisId) {
        this.paisActual = paisId;
        const territorio = TERRITORIOS[paisId];
        if (!territorio) return;
        
        const poblacion = territorio.poblacion ? territorio.poblacion.toLocaleString() : '—';
        const capital = territorio.capital || '—';
        const estado = '🟢 ESTABLE';
        const colorEstado = '#2e7d32';
        
        this.mostrarPanelBasico(territorio.nombre, estado, colorEstado, poblacion, capital);
    },
    
    mostrarPanelBasico: function(nombre, estado, colorEstado, poblacion, capital) {
        const container = document.getElementById('dashboard-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="dashboard-pais">
                <div class="info-header">
                    <h3>🇪🇸 ${nombre}</h3>
                    <span class="pais-estado" style="background: ${colorEstado}">${estado}</span>
                </div>
                <div class="info-objetivos">
                    🎯 Objetivos: <span id="objetivos-valor">68%</span>
                </div>
                <div class="info-botones">
                    <button class="info-btn" data-seccion="economia">📊 Economía</button>
                    <button class="info-btn" data-seccion="leyes">⚖️ Leyes</button>
                    <button class="info-btn" data-seccion="geopolitica">🏛️ Geopolítica</button>
                    <button class="info-btn" data-seccion="social">👥 Social</button>
                    <button class="info-btn" data-seccion="clima">🌍 Clima</button>
                </div>
                <div class="info-datos-basicos">
                    <p><strong>Población:</strong> ${poblacion}</p>
                    <p><strong>Capital:</strong> ${capital}</p>
                </div>
                <div class="info-alertas">
                    <h4>⚠️ Alertas</h4>
                    <div class="alerta-item alerta-roja">🔴 Seguridad energética</div>
                    <div class="alerta-item alerta-amarilla">🟡 Desempleo alto</div>
                </div>
            </div>
        `;
        
        // Volver a vincular los botones (porque el innerHTML los ha recreado)
        this.vincularBotones();
    },
    
    mostrarSeccion: function(seccion) {
        const paisId = this.paisActual;
        // Intentar obtener datos reales, si no existen usar valores por defecto
        let datosTerritorio = null;
        if (EstadoTablero && EstadoTablero.real && EstadoTablero.real.territorios) {
            datosTerritorio = EstadoTablero.real.territorios[paisId];
        }
        
        // Valores por defecto si no hay datos
        const poderEconomico = datosTerritorio?.poderes?.económico ?? 0.5;
        const poderFinanciero = datosTerritorio?.poderes?.financiero ?? 0.5;
        const poderSocial = datosTerritorio?.poderes?.social ?? 0.5;
        
        let html = '';
        const nombrePais = paisId.toUpperCase();
        
        switch(seccion) {
            case 'economia':
                const pib = (poderEconomico * 3).toFixed(1);
                const inflacion = (poderFinanciero * 4).toFixed(1);
                const deuda = (poderFinanciero * 120).toFixed(0);
                const desempleo = ((1 - poderSocial) * 20).toFixed(1);
                html = `
                    <div class="dashboard-seccion">
                        <h4>📊 Datos económicos de ${nombrePais}</h4>
                        <p><strong>PIB (variación):</strong> ${pib > 0 ? '+' : ''}${pib}%</p>
                        <p><strong>Inflación:</strong> ${inflacion}%</p>
                        <p><strong>Deuda/PIB:</strong> ${deuda}%</p>
                        <p><strong>Desempleo:</strong> ${desempleo}%</p>
                        <p class="fuente">📚 Datos simulados (próximamente datos reales)</p>
                        <button class="btn-volver">◀ Volver al panel</button>
                    </div>
                `;
                break;
            case 'leyes':
                html = `
                    <div class="dashboard-seccion">
                        <h4>⚖️ Leyes destacadas de ${nombrePais}</h4>
                        <ul>
                            <li>Ley de Transición Energética 2026</li>
                            <li>Reforma Sanitaria 2026</li>
                            <li>Ley de Soberanía Digital</li>
                        </ul>
                        <p class="fuente">📚 Fuente: BOE (simulado)</p>
                        <button class="btn-volver">◀ Volver al panel</button>
                    </div>
                `;
                break;
            case 'geopolitica':
                html = `
                    <div class="dashboard-seccion">
                        <h4>🏛️ Relaciones internacionales de ${nombrePais}</h4>
                        <p>• UE: aliado estratégico</p>
                        <p>• OTAN: miembro</p>
                        <p>• Relaciones con Francia: cordiales</p>
                        <button class="btn-volver">◀ Volver al panel</button>
                    </div>
                `;
                break;
            case 'social':
                html = `
                    <div class="dashboard-seccion">
                        <h4>👥 Indicadores sociales de ${nombrePais}</h4>
                        <p><strong>Confianza institucional:</strong> 45%</p>
                        <p><strong>Índice de protestas:</strong> bajo</p>
                        <p><strong>Satisfacción con servicios públicos:</strong> 52%</p>
                        <button class="btn-volver">◀ Volver al panel</button>
                    </div>
                `;
                break;
            case 'clima':
                html = `
                    <div class="dashboard-seccion">
                        <h4>🌍 Datos climáticos de ${nombrePais}</h4>
                        <p><strong>Temperatura media:</strong> 15°C</p>
                        <p><strong>Riesgo de sequía:</strong> moderado</p>
                        <p><strong>Emisiones CO2:</strong> 5.8 ton/hab</p>
                        <button class="btn-volver">◀ Volver al panel</button>
                    </div>
                `;
                break;
            default:
                html = `<p>Información no disponible</p>`;
        }
        
        const container = document.getElementById('dashboard-container');
        if (container) {
            container.innerHTML = html;
            // Vincular el botón "Volver" si existe
            const btnVolver = container.querySelector('.btn-volver');
            if (btnVolver) {
                btnVolver.addEventListener('click', () => {
                    this.mostrarPais(this.paisActual);
                });
            }
        }
    }
};

window.UIPanelInfo = UIPanelInfo;
