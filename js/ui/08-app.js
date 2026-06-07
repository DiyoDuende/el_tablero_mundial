// js/ui/08-app.js
// ============================================
// APP PRINCIPAL - CONTROL DE INTERFAZ
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 App inicializada");

    // ============================================
    // 1. CONFIGURAR BUSCADOR GLOBAL
    // ============================================
    const buscador = document.getElementById('buscador-rapido');
    if (buscador) {
        buscador.addEventListener('keypress', function(evento) {
            if (evento.key === 'Enter') {
                const texto = this.value.trim();
                if (texto !== "") {
                    console.log(`🔍 Buscando: "${texto}"`);
                    if (typeof window.buscarLugarGlobal === 'function') {
                        window.buscarLugarGlobal(texto);
                    } else {
                        console.error("❌ buscarLugarGlobal no está cargada");
                        alert("El sistema de búsqueda no está listo. Recarga la página.");
                    }
                }
            }
        });
        console.log("✅ Buscador global configurado");
    }

    // ============================================
    // 2. CONFIGURAR VERIFICADOR (demo)
    // ============================================
    const verificarBtn = document.getElementById('btn-verificar');
    const preguntaInput = document.getElementById('verificador-pregunta');
    const respuestaDiv = document.getElementById('verificador-respuesta');

    if (verificarBtn && preguntaInput && respuestaDiv) {
        verificarBtn.addEventListener('click', function() {
            const pregunta = preguntaInput.value.trim();
            if (pregunta === "") {
                respuestaDiv.innerHTML = "<p>✏️ Escribe una pregunta.</p>";
                return;
            }
            respuestaDiv.innerHTML = `<p>✅ Explicación: "${pregunta}" (Modo demostración - Próximamente disponible).</p>`;
        });
        console.log("✅ Verificador configurado");
    }

    // ============================================
    // 3. CONFIGURAR SIMULADOR (demo)
    // ============================================
    const simularBtn = document.getElementById('btn-simular');
    const escenarioInput = document.getElementById('escenario-input');
    const resultadoSimulacion = document.getElementById('simulador-resultados');

    if (simularBtn && escenarioInput && resultadoSimulacion) {
        simularBtn.addEventListener('click', function() {
            const escenario = escenarioInput.value.trim();
            if (escenario === "") {
                resultadoSimulacion.innerHTML = "<p>✏️ Escribe un escenario.</p>";
                return;
            }
            resultadoSimulacion.innerHTML = `<p>🎮 Simulando: "${escenario}" (Modo demostración).</p>`;
        });
        console.log("✅ Simulador configurado");
    }

    // ============================================
    // 4. MOSTRAR ESPAÑA POR DEFECTO
    // ============================================
    setTimeout(function() {
        if (typeof window.DashboardReal !== 'undefined') {
            console.log("🇪🇸 Cargando España por defecto");
            window.DashboardReal.mostrar('ESP', 'pais', 'España');
        }
    }, 1000);
});
