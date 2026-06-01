// js/ui/03b-simulador-basico.js
// ============================================
// SIMULADOR BÁSICO - Control de modo juego
// ============================================

const SimuladorBasico = {
    init: function() {
        console.log('🎮 SimuladorBasico inicializado');
        this.configurarBotones();
    },
    
    configurarBotones: function() {
        // Botones de capas de poder
        const botonesCapa = document.querySelectorAll('.capa-btn');
        botonesCapa.forEach(btn => {
            btn.addEventListener('click', () => {
                const capa = btn.dataset.capa;
                this.mostrarCapa(capa);
            });
        });
        
        console.log('✅ Botones de capas configurados');
    },
    
    mostrarCapa: function(capa) {
        console.log(`📊 Mostrando capa: ${capa}`);
        
        const mensajesCapa = {
            'politico': '🏛️ Capa política: gobiernos y decisiones políticas',
            'economico': '💰 Capa económica: mercados e indicadores financieros',
            'militar': '⚔️ Capa militar: fuerzas militares y estrategia',
            'judicial': '⚖️ Capa judicial: sistemas legales y justicia',
            'legislativo': '📜 Capa legislativa: leyes y regulaciones',
            'medios': '📺 Capa de medios: comunicación y medios',
            'social': '👥 Capa social: movimientos sociales y opinión pública',
            'ecosistema': '🌍 Capa de ecosistema: clima y sostenibilidad',
            'corporaciones': '🏢 Capa de corporaciones: poder empresarial global'
        };
        
        alert(mensajesCapa[capa] || 'Capa no identificada');
    }
};

window.SimuladorBasico = SimuladorBasico;

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SimuladorBasico.init());
} else {
    SimuladorBasico.init();
}
