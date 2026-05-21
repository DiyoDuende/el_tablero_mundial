/// ============================================
// SIMULADOR (modo juego)
// ============================================

const UISimulador = {
    
    init: function() {
        const btn = document.getElementById('btn-simular');
        const input = document.getElementById('simulador-pregunta');
        if (btn) btn.addEventListener('click', () => this.simular());
        if (input) input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.simular();
        });
    },
    
    simular: function() {
        if (CONFIG.modo !== 'juego') {
            alert('Activa primero el MODO JUEGO para simular');
            return;
        }

        const escenario = document.getElementById('simulador-pregunta').value.trim();
        if (!escenario) return;

        // 1. Extraer parámetros de la frase del usuario
        const texto = escenario.toLowerCase();
        let poder = 0.5;      // Valor base
        let sector = 0.5;
        let mecanismo = 0.5;
        let explicacion = "";

        if (texto.includes('petróleo') || texto.includes('energía')) {
            sector = 0.8;
            explicacion += " Sector Energético activado. ";
        }
        if (texto.includes('impuesto')) {
            mecanismo = 0.7;
            explicacion += " Mecanismo de impuestos aplicado. ";
        }
        // Puedes añadir más condiciones aquí (guerra, sanidad, etc.)

        // 2. Llamar al motor de simulación real
        const resultado = MotorSimulacion.simular({
            poder: poder,
            sector: sector,
            mecanismo: mecanismo,
            factorTerritorio: 1.0,
            factorEscala: 100
        });

        // 3. Mostrar los resultados dinámicos
        const contenedor = document.getElementById('simulador-resultados');
        if (contenedor && resultado && resultado.impacto) {
            const eco = resultado.impacto.económico;
            const geo = resultado.impacto.geopolítico;
            const soc = resultado.impacto.social;
            contenedor.innerHTML = `
                <h4>📊 RESULTADOS DE LA SIMULACIÓN</h4>
                <p><strong>Escenario simulado:</strong> ${escenario}</p>
                <p>${explicacion || "Análisis general completado."}</p>
                <p>• Impacto económico: ${eco > 0 ? '+' : ''}${eco}%</p>
                <p>• Impacto geopolítico: ${geo > 0 ? '+' : ''}${geo}%</p>
                <p>• Impacto social: ${soc > 0 ? '+' : ''}${soc}%</p>
                <p class="fuente">⚠️ SIMULACIÓN basada en modelo</p>
            `;
        } else {
            // Fallback por si el motor no responde
            contenedor.innerHTML = `<p class="fuente">⚠️ Simulación no disponible. Por favor, recarga la página.</p>`;
        }
    }
};

window.UISimulador = UISimulador;
