// ============================================
// PANEL DE INFORMACIÓN DEL PAÍS
// ============================================

const UIPanelInfo = {
    paisActual: 'españa',  // país por defecto
    
    init: function() {
        // Conectar botones del panel
        document.querySelectorAll('.info-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const seccion = e.currentTarget.dataset.seccion;
                if (seccion) this.mostrarSeccion(seccion);
            });
        });
    },
    
    mostrarPais: function(paisId) {
        this.paisActual = paisId;
        const territorio = TERRITORIOS[paisId];
        if (!territorio) return;
        
        // Datos de ejemplo (se pueden ampliar)
        const poblacion = territorio.poblacion ? territorio.poblacion.toLocaleString() : '—';
        const capital = territorio.capital || '—';
        
        // Estado estratégico simulado (luego se calculará con poderes)
        let estado = '🟢 ESTABLE';
        let colorEstado = '#2e7d32';
        
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
                <div class="info-alertas" id="info-alertas">
                    <h4>⚠️ Alertas</h4>
                    <div class="alerta-item alerta-roja">🔴 Seguridad energética</div>
                    <div class="alerta-item alerta-amarilla">🟡 Desempleo alto</div>
                </div>
            </div>
        `;
        
        // Reconectar eventos de los botones (por si se pierden al reemplazar el HTML)
        this.init();
    },
    
    mostrarSeccion: function(seccion) {
        const paisId = this.paisActual;
        const datos = EstadoTablero.real.territorios[paisId];
        if (!datos) return;
        
        let html = '';
        switch(seccion) {
            case 'economia':
                const pib = (datos.poderes.económico * 3).toFixed(1);
                const inflacion = (datos.poderes.financiero * 4).toFixed(1);
                const deuda = (datos.poderes.financiero * 120).toFixed(0);
                const desempleo = ((1 - datos.poderes.social) * 20).toFixed(1);
                html = `
                    <h4>📊 Datos económicos de ${paisId.toUpperCase()}</h4>
                    <p><strong>PIB (variación):</strong> ${pib > 0 ? '+' : ''}${pib}%</p>
                    <p><strong>Inflación:</strong> ${inflacion}%</p>
                    <p><strong>Deuda/PIB:</strong> ${deuda}%</p>
                    <p><strong>Desempleo:</strong> ${desempleo}%</p>
                    <p class="fuente">📚 Datos simulados (próximamente datos reales INE/Eurostat)</p>
                `;
                break;
            case 'leyes':
                html = <p>⚖️ Leyes destacadas de ${paisId.toUpperCase()}:<br>• Ley de Transición Energética 2026<br>• Reforma Sanitaria 2026<br>• Ley de Soberanía Digital</p><p class="fuente">📚 Fuente: BOE (simulado)</p>;
                break;
            case 'geopolitica':
                html = <p>🏛️ Relaciones internacionales de ${paisId.toUpperCase()}:<br>• UE: aliado estratégico<br>• OTAN: miembro<br>• Relaciones con Francia: cordiales</p>;
                break;
            case 'social':
                html = <p>👥 Indicadores sociales de ${paisId.toUpperCase()}:<br>• Confianza institucional: 45%<br>• Índice de protestas: bajo<br>• Satisfacción con servicios públicos: 52%</p>;
                break;
            case 'clima':
                html = <p>🌍 Datos climáticos de ${paisId.toUpperCase()}:<br>• Temperatura media: 15°C<br>• Riesgo de sequía: moderado<br>• Emisiones CO2: 5.8 ton/hab</p>;
                break;
            default:
                html = <p>Información no disponible</p>;
        }
        
        const container = document.getElementById('dashboard-container');
        if (container) container.innerHTML = html;
    }
};

window.UIPanelInfo = UIPanelInfo;
