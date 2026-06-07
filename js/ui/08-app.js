// js/ui/08-app.js
// ============================================
// APP PRINCIPAL - Inicialización de todo el sistema
// ============================================

console.log('🚀 Iniciando Tablero Mundial');

document.addEventListener('DOMContentLoaded', () => {
    
    // Inicializar componentes
    if (typeof UIPanelInfo !== 'undefined') UIPanelInfo.init();
    if (typeof UIVerificador !== 'undefined') UIVerificador.init();
    if (typeof UISimulador !== 'undefined') UISimulador.init();
    if (typeof Idioma !== 'undefined') Idioma.init();
    
    // ============================================
    // ESPERAR A QUE EL MAPA ESTÉ LISTO
    // ============================================
    window.addEventListener('mapa-listos', function() {
        console.log("🗺️ Mapa listo, inicializando componentes del mapa...");
        
        // Conectar botones de capa
        const capaBotones = document.querySelectorAll('.capa-icon');
        capaBotones.forEach(btn => {
            btn.addEventListener('click', function() {
                const capa = this.dataset.capa;
                const estaActivo = this.classList.contains('activo');
                
                capaBotones.forEach(b => b.classList.remove('activo'));
                if (!estaActivo) this.classList.add('activo');
                
                if (window.MapaMundial) {
                    window.MapaMundial.activarCapa(capa, !estaActivo);
                }
            });
        });
        
        // Activar capa económica por defecto
        const capaEconomica = document.querySelector('.capa-icon[data-capa="economico"]');
        if (capaEconomica) capaEconomica.click();
        
        // Mostrar España en el dashboard
        if (typeof DashboardReal !== 'undefined') {
            DashboardReal.mostrar('ESP', 'pais', 'España');
        }
        
        // Activar coloreado
        if (typeof Coloreado !== 'undefined') {
            setTimeout(function() {
                Coloreado.aplicarColoresPIB();
            }, 500);
        }
    });
    
    // ============================================
    // BUSCADOR RÁPIDO
    // ============================================
    const buscador = document.getElementById('buscador-rapido');
    if (buscador) {
        buscador.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const texto = e.target.value.trim();
                if (texto && window.MapaMundial && window.MapaMundial.buscarLugar) {
                    window.MapaMundial.buscarLugar(texto);
                }
            }
        });
    }
    
    // ============================================
    // BOTONES README Y NORMAS
    // ============================================
    const btnReadme = document.getElementById('btn-readme');
    const btnNormas = document.getElementById('btn-normas');
    const modalReadme = document.getElementById('modal-readme');
    const modalNormas = document.getElementById('modal-normas');
    
    if (btnReadme && modalReadme) {
        btnReadme.addEventListener('click', () => { modalReadme.style.display = 'flex'; });
    }
    if (btnNormas && modalNormas) {
        btnNormas.addEventListener('click', () => { modalNormas.style.display = 'flex'; });
    }
    
    // Cerrar modales
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal-overlay');
            if (modal) modal.style.display = 'none';
        });
    });
    
    console.log('✅ Tablero Mundial listo');
});

function mostrarModal(titulo, contenido) {
    let modal = document.getElementById('modal-global');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-global';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.85); display: flex; justify-content: center;
            align-items: center; z-index: 20000;
        `;
        document.body.appendChild(modal);
    }
    modal.innerHTML = `
        <div style="background: #1a2a30; width: 90%; max-width: 600px; max-height: 80vh;
                    border-radius: 20px; padding: 20px; overflow-y: auto; border: 1px solid #4fc3f7;">
            <button id="modal-cerrar" style="position: absolute; top: 10px; right: 20px;
                    font-size: 24px; background: none; border: none; color: #9aaec2; cursor: pointer;">✕</button>
            <div style="color: #ecf0f3;">${contenido}</div>
        </div>
    `;
    modal.style.display = 'flex';
    const btnCerrar = document.getElementById('modal-cerrar');
    if (btnCerrar) btnCerrar.onclick = () => modal.style.display = 'none';
    modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
}
