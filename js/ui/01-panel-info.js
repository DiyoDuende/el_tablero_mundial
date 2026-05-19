// 01-panel-info.js - Refresca todos los valores en UI
function refrescarPanelCompleto() {
    if (!window.estadoJuego) return;
    const ind = window.estadoJuego.indicadores;
    const modoTexto = window.estadoJuego.modo?.toUpperCase() || "REAL";
    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.innerText = value;
    };
    setText("paro_valor", (ind.desempleo || 0).toFixed(1) + "%");
    setText("inflacion_valor", (ind.inflacion || 0).toFixed(1) + "%");
    setText("apoyo_valor", (ind.apoyoGobierno || 0) + "%");
    setText("protestas_valor", (ind.indiceProtestas || 0));
    setText("tecnologia_valor", (ind.nivelTecnologico || 0));
    setText("energia_valor", (ind.consumoEnergia || 0));
    const modoDiv = document.getElementById("modo_actual");
    if (modoDiv) modoDiv.innerText = `⚡ MODO: ${modoTexto}`;
    const feedbackDiv = document.getElementById("feedback_mensaje");
    if (feedbackDiv && window.estadoJuego.mensajeFeedback) {
        feedbackDiv.innerText = window.estadoJuego.mensajeFeedback;
    }
    // Estabilidad visual adicional (opcional)
    const estabilidad = window.SimuladorBase?.calcularEstabilidadGeneral(ind) || 50;
    const estabilidadDiv = document.getElementById("estabilidad_valor");
    if (estabilidadDiv) estabilidadDiv.innerText = estabilidad;
}
window.addEventListener('estadoActualizado', refrescarPanelCompleto);
document.addEventListener('DOMContentLoaded', refrescarPanelCompleto);
console.log("✅ ui/01-panel-info.js cargado");

    // Actualizar elementos HTML (ajusta los IDs según tu index.html)
    const spanParo = document.getElementById("paro_valor");
    if (spanParo) spanParo.innerText = ind.desempleo.toFixed(1) + "%";

    const spanInflacion = document.getElementById("inflacion_valor");
    if (spanInflacion) spanInflacion.innerText = ind.inflacion.toFixed(1) + "%";

    const spanApoyo = document.getElementById("apoyo_valor");
    if (spanApoyo) spanApoyo.innerText = ind.apoyoGobierno + "%";

    const spanProtestas = document.getElementById("protestas_valor");
    if (spanProtestas) spanProtestas.innerText = ind.indiceProtestas;

    const feedbackDiv = document.getElementById("feedback_mensaje");
    if (feedbackDiv) feedbackDiv.innerText = window.estadoJuego.mensajeFeedback;

    const modoDiv = document.getElementById("modo_actual");
    if (modoDiv) modoDiv.innerText = `⚡ Modo: ${modoTexto}`;
}

// Escuchar cambios en el estado
window.addEventListener('estadoActualizado', refrescarPanelCompleto);

// Al cargar la página, mostrar datos iniciales
document.addEventListener('DOMContentLoaded', refrescarPanelCompleto);
// ============================================
// PANEL DE INFORMACIÓN DEL PAÍS
// ============================================

const UIPanelInfo = {
    
    datosMock: {
        españa: {
            nombre: 'España',
            estado: 'ESTABLE',
            color: '#2e7d32',
            objetivos: 68,
            alertas: [
                { tipo: 'roja', texto: 'Seguridad energética' },
                { tipo: 'amarilla', texto: 'Desempleo alto' }
            ],
            economia: {
                pib: 2.3,
                inflacion: 2.1,
                deuda: 98,
                desempleo: 11.2
            }
        },
        francia: {
            nombre: 'Francia',
            estado: 'ESTABLE',
            color: '#2e7d32',
            objetivos: 72,
            alertas: [
                { tipo: 'amarilla', texto: 'Protestas sociales' }
            ],
            economia: {
                pib: 1.8,
                inflacion: 2.5,
                deuda: 112,
                desempleo: 7.5
            }
        },
        portugal: {
            nombre: 'Portugal',
            estado: 'INQUIETO',
            color: '#f57c00',
            objetivos: 55,
            alertas: [
                { tipo: 'roja', texto: 'Deuda pública' },
                { tipo: 'amarilla', texto: 'Crecimiento lento' }
            ],
            economia: {
                pib: 1.2,
                inflacion: 2.8,
                deuda: 127,
                desempleo: 6.8
            }
        }
    },
    
    init: function() {
        document.querySelectorAll('.info-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const seccion = e.target.dataset.seccion;
                this.mostrarSeccion(seccion);
            });
        });
    },
    
    mostrarPais: function(paisId) {
        const datos = this.datosMock[paisId] || this.datosMock.españa;
        
        document.getElementById('pais-nombre').innerHTML = `🇪🇸 ${datos.nombre}`;
        document.getElementById('pais-estado').innerHTML = `🟢 ${datos.estado}`;
        document.getElementById('pais-estado').style.background = datos.color;
        document.getElementById('objetivos-valor').innerHTML = `${datos.objetivos}%`;
        
        let alertasHtml = '';
        datos.alertas.forEach(a => {
            alertasHtml += `<div class="alerta-item alerta-${a.tipo}">${a.tipo === 'roja' ? '🔴' : '🟡'} ${a.texto}</div>`;
        });
        document.getElementById('info-alertas').innerHTML = `<h4 data-i18n="alertas">⚠️ Alertas</h4>${alertasHtml}`;
    },
    
    mostrarSeccion: function(seccion) {
        const pais = document.getElementById('pais-nombre').innerText.split(' ')[1].toLowerCase();
        const datos = this.datosMock[pais] || this.datosMock.españa;
        
        let html = '';
        
        switch(seccion) {
            case 'economia':
                html = `
                    <h5>📊 Datos económicos</h5>
                    <p>PIB: ${datos.economia.pib}%</p>
                    <p>Inflación: ${datos.economia.inflacion}%</p>
                    <p>Deuda/PIB: ${datos.economia.deuda}%</p>
                    <p>Desempleo: ${datos.economia.desempleo}%</p>
                `;
                break;
            case 'leyes':
                html = '<p>⚖️ Información legislativa próximamente</p>';
                break;
            case 'geopolitica':
                html = '<p>🏛️ Análisis geopolítico próximamente</p>';
                break;
            case 'social':
                html = '<p>👥 Datos sociales próximamente</p>';
                break;
            case 'clima':
                html = '<p>🌍 Datos climáticos próximamente</p>';
                break;
        }
        
        // Crear modal o panel flotante
        alert(html.replace(/<[^>]*>/g, ' ')); // Simplificado, en producción sería un modal
    }
};

window.UIPanelInfo = UIPanelInfo;
